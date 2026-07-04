import { useState, type FormEvent } from "react";
import { api } from "../lib/api.ts";
import { ErrorAlert } from "./ErrorAlert.tsx";

interface Props {
  walletAddress: string;
}

export function FeedbackForm({ walletAddress }: Props) {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.submitFeedback({ walletAddress, rating, message: message || undefined });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-verified/30 bg-verified/5 p-5 text-center">
        <p className="font-body text-sm text-verified font-semibold">
          Thank you — your feedback has been recorded.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-ink/10 bg-white p-5 space-y-4">
      {error && <ErrorAlert message={error} />}

      <div>
        <span className="mb-2 block font-body text-sm font-medium text-ink/70">
          Rating
        </span>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`h-9 w-9 rounded-lg border font-body text-sm font-semibold transition ${
                rating === n
                  ? "border-seal bg-seal text-ink"
                  : "border-ink/15 text-ink/50 hover:border-seal"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="mb-1 block font-body text-sm font-medium text-ink/70">
          Message (optional)
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="What did you think of AnchorPass?"
          className="w-full rounded-lg border border-ink/15 px-3 py-2 font-body text-sm focus:outline-none focus:ring-2 focus:ring-seal/50"
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-institution py-2.5 font-body text-sm font-semibold text-paper hover:bg-ink disabled:opacity-60 transition"
      >
        {submitting ? "Submitting…" : "Submit Feedback"}
      </button>
    </form>
  );
}
