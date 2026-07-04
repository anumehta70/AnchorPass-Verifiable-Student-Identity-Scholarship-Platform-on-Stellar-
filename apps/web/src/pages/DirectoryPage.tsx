import { Link } from "react-router-dom";

export function DirectoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl font-semibold text-ink">Public Directory</h1>
      <p className="mt-4 font-body text-ink/70 max-w-xl mx-auto">
        A public directory of all verified educational institutions issuing credentials on AnchorPass.
      </p>
      
      <div className="mt-12 rounded-2xl bg-ink/5 p-12 border border-ink/10 flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-institution text-paper text-2xl mb-4">
          🏢
        </div>
        <h2 className="font-display text-xl font-semibold text-ink">Directory coming in v2</h2>
        <p className="mt-2 font-body text-sm text-ink/60">
          We are currently working on a decentralized public directory powered by Stellar smart contracts.
        </p>
        <Link to="/" className="mt-6 rounded-full bg-ink px-6 py-2.5 font-body text-sm font-semibold text-paper hover:bg-ink/80 transition-colors">
          Return Home
        </Link>
      </div>
    </div>
  );
}
