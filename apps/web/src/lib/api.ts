const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export interface Scholarship {
  id: string;
  contractScholarshipId: string;
  title: string;
  description?: string;
  amount: string;
  totalSeats: number;
  deadline: string;
  eligibility?: string;
  status: "DRAFT" | "OPEN" | "CLOSED" | "EXPIRED";
  institutionWallet: string;
  assignments: { studentWallet: string; claimed: boolean }[];
}

export interface Credential {
  id: string;
  contractCredentialId: string;
  title: string;
  studentWallet: string;
  institutionWallet: string;
  ipfsHash: string;
  status: "VALID" | "REVOKED";
  issuedAt: string;
  transactionHash?: string;
  verificationUrl?: string;
  qrCode?: string;
}

export const api = {
  upsertUser: (data: { walletAddress: string; role: string; name?: string }) =>
    request("/users", { method: "POST", body: JSON.stringify(data) }),

  listScholarships: (params?: { institutionWallet?: string; studentWallet?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<Scholarship[]>(`/scholarships${qs ? `?${qs}` : ""}`);
  },

  createScholarship: (data: Record<string, unknown>) =>
    request<Scholarship>("/scholarships", { method: "POST", body: JSON.stringify(data) }),

  assignStudent: (scholarshipId: string, studentWallet: string) =>
    request(`/scholarships/${scholarshipId}/assign`, {
      method: "POST",
      body: JSON.stringify({ studentWallet }),
    }),

  claimScholarship: (scholarshipId: string, studentWallet: string, transactionHash: string) =>
    request(`/scholarships/${scholarshipId}/claim`, {
      method: "POST",
      body: JSON.stringify({ studentWallet, transactionHash }),
    }),

  prepareCredential: (data: Record<string, unknown>) =>
    request<{ ipfsHash: string; ipfsUrl: string }>("/credentials/prepare", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  finalizeCredential: (data: Record<string, unknown>) =>
    request<Credential>("/credentials", { method: "POST", body: JSON.stringify(data) }),

  getCredential: (id: string) => request<Credential>(`/credentials/${id}`),

  listCredentialsForStudent: (wallet: string) =>
    request<Credential[]>(`/credentials/student/${wallet}`),

  revokeCredential: (id: string, transactionHash: string) =>
    request<Credential>(`/credentials/${id}/revoke`, {
      method: "POST",
      body: JSON.stringify({ transactionHash }),
    }),

  submitFeedback: (data: { walletAddress: string; rating: number; message?: string }) =>
    request("/feedback", { method: "POST", body: JSON.stringify(data) }),

  analyticsSummary: () =>
    request<{
      uniqueWalletsOnboarded: number;
      totalScholarships: number;
      totalCredentialsIssued: number;
      totalClaims: number;
      averageFeedbackRating: number | null;
    }>("/analytics/summary"),
};
