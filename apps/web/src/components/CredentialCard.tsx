import { Link } from "react-router-dom";
import type { Credential } from "../lib/api.ts";
import { VerificationSeal } from "./VerificationSeal.tsx";

export function CredentialCard({ credential }: { credential: Credential }) {
  return (
    <div className="paper-texture relative overflow-hidden rounded-xl border border-seal/30 bg-white p-6 shadow-sm">
      <div className="absolute inset-0 rounded-xl border-[3px] border-double border-seal/20 m-2 pointer-events-none" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-seal">
            Verified Credential
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">{credential.title}</h3>
          <p className="mt-1 font-mono text-xs text-ink/50">
            Issued {new Date(credential.issuedAt).toLocaleDateString()}
          </p>
        </div>
        <VerificationSeal status={credential.status} />
      </div>

      <div className="relative mt-5 space-y-1 border-t border-ink/10 pt-4 font-mono text-xs text-ink/60">
        <p>Student: {credential.studentWallet.slice(0, 6)}...{credential.studentWallet.slice(-6)}</p>
        <p>IPFS: {credential.ipfsHash.slice(0, 12)}...</p>
        {credential.transactionHash && (
          <p>Tx: {credential.transactionHash.slice(0, 10)}...</p>
        )}
      </div>

      <Link
        to={`/verify/${credential.id}`}
        className="relative mt-5 inline-block font-body text-sm font-semibold text-institution underline underline-offset-2"
      >
        View public verification page →
      </Link>
    </div>
  );
}
