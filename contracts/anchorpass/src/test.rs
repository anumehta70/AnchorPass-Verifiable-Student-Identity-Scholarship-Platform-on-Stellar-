#![cfg(test)]

use super::*;
use soroban_sdk::testutils::{Address as _, Ledger};
use soroban_sdk::Env;

fn setup(env: &Env) -> (Address, AnchorPassContractClient) {
    let contract_id = env.register(AnchorPassContract, ());
    let client = AnchorPassContractClient::new(env, &contract_id);
    (contract_id, client)
}

#[test]
fn test_register_institution() {
    let env = Env::default();
    env.mock_all_auths();
    let (_, client) = setup(&env);

    let institution = Address::generate(&env);
    client.register_institution(&institution, &String::from_str(&env, "MIT"));

    let stored = client.get_institution(&institution);
    assert_eq!(stored.name, String::from_str(&env, "MIT"));
    assert!(!stored.verified);
}

#[test]
fn test_double_register_fails() {
    let env = Env::default();
    env.mock_all_auths();
    let (_, client) = setup(&env);

    let institution = Address::generate(&env);
    client.register_institution(&institution, &String::from_str(&env, "MIT"));

    let result = client.try_register_institution(&institution, &String::from_str(&env, "MIT"));
    assert_eq!(result, Err(Ok(ContractError::InstitutionAlreadyRegistered)));
}

#[test]
fn test_full_scholarship_and_credential_lifecycle() {
    let env = Env::default();
    env.mock_all_auths();
    let (_, client) = setup(&env);

    let institution = Address::generate(&env);
    let student = Address::generate(&env);

    client.register_institution(&institution, &String::from_str(&env, "Stanford"));

    let deadline = env.ledger().timestamp() + 100_000;
    let scholarship_id = client.create_scholarship(
        &institution,
        &String::from_str(&env, "Merit Scholarship 2026"),
        &1_000_000_i128,
        &10u32,
        &deadline,
    );
    assert_eq!(scholarship_id, 1);

    client.assign_student(&institution, &scholarship_id, &student);

    let scholarship = client.get_scholarship(&scholarship_id);
    assert_eq!(scholarship.assigned.len(), 1);

    client.claim_scholarship(&scholarship_id, &student);

    let scholarship_after = client.get_scholarship(&scholarship_id);
    assert_eq!(scholarship_after.claimed.len(), 1);

    // issue credential
    let credential_id = client.issue_credential(
        &institution,
        &student,
        &String::from_str(&env, "Merit Scholarship Certificate"),
        &String::from_str(&env, "bafybeigdyrztxyz examplecidhash"),
    );
    assert_eq!(credential_id, 1);

    let credential = client.verify_credential(&credential_id);
    assert_eq!(credential.status, CredentialStatus::Valid);
    assert_eq!(credential.student, student);

    // revoke
    client.revoke_credential(&institution, &credential_id);
    let revoked = client.verify_credential(&credential_id);
    assert_eq!(revoked.status, CredentialStatus::Revoked);
}

#[test]
fn test_claim_without_assignment_fails() {
    let env = Env::default();
    env.mock_all_auths();
    let (_, client) = setup(&env);

    let institution = Address::generate(&env);
    let student = Address::generate(&env);
    client.register_institution(&institution, &String::from_str(&env, "Yale"));

    let deadline = env.ledger().timestamp() + 1000;
    let scholarship_id = client.create_scholarship(
        &institution,
        &String::from_str(&env, "Need-Based Grant"),
        &500_000_i128,
        &5u32,
        &deadline,
    );

    let result = client.try_claim_scholarship(&scholarship_id, &student);
    assert_eq!(result, Err(Ok(ContractError::StudentNotAssigned)));
}

#[test]
fn test_scholarship_full_rejects_extra_assignment() {
    let env = Env::default();
    env.mock_all_auths();
    let (_, client) = setup(&env);

    let institution = Address::generate(&env);
    client.register_institution(&institution, &String::from_str(&env, "Harvard"));

    let deadline = env.ledger().timestamp() + 1000;
    let scholarship_id = client.create_scholarship(
        &institution,
        &String::from_str(&env, "Tiny Scholarship"),
        &100_i128,
        &1u32,
        &deadline,
    );

    let student1 = Address::generate(&env);
    let student2 = Address::generate(&env);
    client.assign_student(&institution, &scholarship_id, &student1);

    let result = client.try_assign_student(&institution, &scholarship_id, &student2);
    assert_eq!(result, Err(Ok(ContractError::ScholarshipFull)));
}

#[test]
fn test_expired_scholarship_cannot_be_claimed() {
    let env = Env::default();
    env.mock_all_auths();
    let (_, client) = setup(&env);

    let institution = Address::generate(&env);
    let student = Address::generate(&env);
    client.register_institution(&institution, &String::from_str(&env, "Princeton"));

    let deadline = env.ledger().timestamp() + 10;
    let scholarship_id = client.create_scholarship(
        &institution,
        &String::from_str(&env, "Fast Deadline Scholarship"),
        &100_i128,
        &5u32,
        &deadline,
    );
    client.assign_student(&institution, &scholarship_id, &student);

    env.ledger().with_mut(|li| li.timestamp = deadline + 1);

    let result = client.try_claim_scholarship(&scholarship_id, &student);
    assert_eq!(result, Err(Ok(ContractError::ScholarshipExpired)));
}

#[test]
fn test_only_owning_institution_can_revoke() {
    let env = Env::default();
    env.mock_all_auths();
    let (_, client) = setup(&env);

    let institution_a = Address::generate(&env);
    let institution_b = Address::generate(&env);
    let student = Address::generate(&env);

    client.register_institution(&institution_a, &String::from_str(&env, "Institution A"));
    client.register_institution(&institution_b, &String::from_str(&env, "Institution B"));

    let credential_id = client.issue_credential(
        &institution_a,
        &student,
        &String::from_str(&env, "Cert"),
        &String::from_str(&env, "cid123"),
    );

    let result = client.try_revoke_credential(&institution_b, &credential_id);
    assert_eq!(result, Err(Ok(ContractError::NotInstitutionOwner)));
}
