//! AnchorPass Soroban contract
//!
//! Implements on-chain state for:
//!  - Institution registration
//!  - Scholarship creation + student assignment
//!  - Scholarship claiming
//!  - Credential issuance / verification / revocation
//!
//! Design notes:
//!  - Heavy data (certificate PDFs, images, long descriptions) is kept off-chain
//!    in IPFS. Only a content hash (`metadata_hash`, e.g. a CIDv1 string) is
//!    stored on-chain, along with the minimum fields needed for verification
//!    and access control.
//!  - Every state-mutating function requires `require_auth()` from the
//!    relevant wallet, so nobody can call these on someone else's behalf.

#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, Address, Env, String, Vec,
};

// ---------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------

#[derive(Clone)]
#[contracttype]
pub struct Institution {
    pub wallet: Address,
    pub name: String,
    pub verified: bool,
}

#[derive(Clone)]
#[contracttype]
pub struct Scholarship {
    pub id: u64,
    pub institution: Address,
    pub title: String,
    pub total_amount: i128,
    pub total_seats: u32,
    pub deadline: u64, // ledger timestamp (unix seconds)
    pub assigned: Vec<Address>,
    pub claimed: Vec<Address>,
}

#[derive(Clone, PartialEq, Eq)]
#[contracttype]
pub enum CredentialStatus {
    Valid,
    Revoked,
}

#[derive(Clone)]
#[contracttype]
pub struct Credential {
    pub id: u64,
    pub institution: Address,
    pub student: Address,
    pub title: String,
    pub metadata_hash: String, // IPFS CID of certificate metadata
    pub issued_at: u64,
    pub status: CredentialStatus,
}

// ---------------------------------------------------------------------
// Storage keys
// ---------------------------------------------------------------------

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Institution(Address),
    Scholarship(u64),
    ScholarshipCount,
    Credential(u64),
    CredentialCount,
}

// ---------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ContractError {
    InstitutionAlreadyRegistered = 1,
    InstitutionNotFound = 2,
    ScholarshipNotFound = 3,
    ScholarshipFull = 4,
    ScholarshipExpired = 5,
    StudentAlreadyAssigned = 6,
    StudentNotAssigned = 7,
    StudentAlreadyClaimed = 8,
    CredentialAlreadyExists = 9,
    CredentialNotFound = 10,
    NotInstitutionOwner = 11,
    CredentialAlreadyRevoked = 12,
}

// ---------------------------------------------------------------------
// Contract
// ---------------------------------------------------------------------

#[contract]
pub struct AnchorPassContract;

#[contractimpl]
impl AnchorPassContract {
    /// Register a wallet as an institution. Institutions must register
    /// before they can create scholarships or issue credentials.
    pub fn register_institution(
        env: Env,
        institution_wallet: Address,
        name: String,
    ) -> Result<(), ContractError> {
        institution_wallet.require_auth();

        let key = DataKey::Institution(institution_wallet.clone());
        if env.storage().persistent().has(&key) {
            return Err(ContractError::InstitutionAlreadyRegistered);
        }

        let institution = Institution {
            wallet: institution_wallet.clone(),
            name,
            verified: false, // manual/off-chain verification flips this later
        };
        env.storage().persistent().set(&key, &institution);

        env.events()
            .publish((symbol_short!("inst_reg"),), institution_wallet);

        Ok(())
    }

    /// Create a new scholarship campaign. Caller must be a registered institution.
    pub fn create_scholarship(
        env: Env,
        institution_wallet: Address,
        title: String,
        total_amount: i128,
        total_seats: u32,
        deadline: u64,
    ) -> Result<u64, ContractError> {
        institution_wallet.require_auth();
        Self::assert_institution_exists(&env, &institution_wallet)?;

        let count_key = DataKey::ScholarshipCount;
        let id: u64 = env.storage().persistent().get(&count_key).unwrap_or(0);
        let next_id = id + 1;

        let scholarship = Scholarship {
            id: next_id,
            institution: institution_wallet.clone(),
            title,
            total_amount,
            total_seats,
            deadline,
            assigned: Vec::new(&env),
            claimed: Vec::new(&env),
        };

        env.storage()
            .persistent()
            .set(&DataKey::Scholarship(next_id), &scholarship);
        env.storage().persistent().set(&count_key, &next_id);

        env.events()
            .publish((symbol_short!("sch_new"),), next_id);

        Ok(next_id)
    }

    /// Assign an eligible student wallet to a scholarship. Institution-only.
    pub fn assign_student(
        env: Env,
        institution_wallet: Address,
        scholarship_id: u64,
        student_wallet: Address,
    ) -> Result<(), ContractError> {
        institution_wallet.require_auth();

        let key = DataKey::Scholarship(scholarship_id);
        let mut scholarship: Scholarship = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(ContractError::ScholarshipNotFound)?;

        if scholarship.institution != institution_wallet {
            return Err(ContractError::NotInstitutionOwner);
        }
        if scholarship.assigned.contains(&student_wallet) {
            return Err(ContractError::StudentAlreadyAssigned);
        }
        if scholarship.assigned.len() >= scholarship.total_seats {
            return Err(ContractError::ScholarshipFull);
        }

        scholarship.assigned.push_back(student_wallet.clone());
        env.storage().persistent().set(&key, &scholarship);

        env.events()
            .publish((symbol_short!("sch_asgn"),), (scholarship_id, student_wallet));

        Ok(())
    }

    /// Student claims an assigned scholarship. Must be called by the student wallet.
    pub fn claim_scholarship(
        env: Env,
        scholarship_id: u64,
        student_wallet: Address,
    ) -> Result<(), ContractError> {
        student_wallet.require_auth();

        let key = DataKey::Scholarship(scholarship_id);
        let mut scholarship: Scholarship = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(ContractError::ScholarshipNotFound)?;

        if env.ledger().timestamp() > scholarship.deadline {
            return Err(ContractError::ScholarshipExpired);
        }
        if !scholarship.assigned.contains(&student_wallet) {
            return Err(ContractError::StudentNotAssigned);
        }
        if scholarship.claimed.contains(&student_wallet) {
            return Err(ContractError::StudentAlreadyClaimed);
        }

        scholarship.claimed.push_back(student_wallet.clone());
        env.storage().persistent().set(&key, &scholarship);

        env.events()
            .publish((symbol_short!("sch_clm"),), (scholarship_id, student_wallet));

        Ok(())
    }

    /// Issue a credential to a student. Institution-only. `metadata_hash` is
    /// an IPFS CID pointing to the full certificate JSON.
    pub fn issue_credential(
        env: Env,
        institution_wallet: Address,
        student_wallet: Address,
        title: String,
        metadata_hash: String,
    ) -> Result<u64, ContractError> {
        institution_wallet.require_auth();
        Self::assert_institution_exists(&env, &institution_wallet)?;

        let count_key = DataKey::CredentialCount;
        let id: u64 = env.storage().persistent().get(&count_key).unwrap_or(0);
        let next_id = id + 1;

        let credential = Credential {
            id: next_id,
            institution: institution_wallet,
            student: student_wallet,
            title,
            metadata_hash,
            issued_at: env.ledger().timestamp(),
            status: CredentialStatus::Valid,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Credential(next_id), &credential);
        env.storage().persistent().set(&count_key, &next_id);

        env.events()
            .publish((symbol_short!("cred_new"),), next_id);

        Ok(next_id)
    }

    /// Publicly readable — anyone can verify a credential, no auth required.
    pub fn verify_credential(env: Env, credential_id: u64) -> Result<Credential, ContractError> {
        env.storage()
            .persistent()
            .get(&DataKey::Credential(credential_id))
            .ok_or(ContractError::CredentialNotFound)
    }

    /// Revoke a previously issued credential. Only the issuing institution can revoke.
    pub fn revoke_credential(
        env: Env,
        institution_wallet: Address,
        credential_id: u64,
    ) -> Result<(), ContractError> {
        institution_wallet.require_auth();

        let key = DataKey::Credential(credential_id);
        let mut credential: Credential = env
            .storage()
            .persistent()
            .get(&key)
            .ok_or(ContractError::CredentialNotFound)?;

        if credential.institution != institution_wallet {
            return Err(ContractError::NotInstitutionOwner);
        }
        if credential.status == CredentialStatus::Revoked {
            return Err(ContractError::CredentialAlreadyRevoked);
        }

        credential.status = CredentialStatus::Revoked;
        env.storage().persistent().set(&key, &credential);

        env.events()
            .publish((symbol_short!("cred_rvk"),), credential_id);

        Ok(())
    }

    /// Read-only helper for the frontend to fetch full scholarship state.
    pub fn get_scholarship(env: Env, scholarship_id: u64) -> Result<Scholarship, ContractError> {
        env.storage()
            .persistent()
            .get(&DataKey::Scholarship(scholarship_id))
            .ok_or(ContractError::ScholarshipNotFound)
    }

    /// Read-only helper for the frontend to fetch institution state.
    pub fn get_institution(env: Env, wallet: Address) -> Result<Institution, ContractError> {
        env.storage()
            .persistent()
            .get(&DataKey::Institution(wallet))
            .ok_or(ContractError::InstitutionNotFound)
    }

    // -------------------------------------------------------------
    // internal helpers
    // -------------------------------------------------------------

    fn assert_institution_exists(env: &Env, wallet: &Address) -> Result<(), ContractError> {
        if !env
            .storage()
            .persistent()
            .has(&DataKey::Institution(wallet.clone()))
        {
            return Err(ContractError::InstitutionNotFound);
        }
        Ok(())
    }
}

mod test;

// Force new WASM hash for Protocol 22 deploy


#[contractimpl] 
impl AnchorPassContract {
  pub fn ping(env: Env) -> u32 { 1 }
}

