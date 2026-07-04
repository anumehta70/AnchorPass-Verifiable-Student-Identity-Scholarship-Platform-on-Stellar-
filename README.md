# AnchorPass — Verifiable Student Identity (Level 4 Submission)

A production-ready verifiable credentials platform built on the Stellar network. Institutions issue on-chain scholarship credentials, and students claim them with zero fees. The public can cryptographically verify any credential in seconds without relying on a centralized database.

---

## 🚀 Live Links
- **Live MVP (Frontend):** [https://anchorpass-verifiable-student-iden.vercel.app/](https://anchorpass-verifiable-student-iden.vercel.app/)
- **Backend API:** [https://anchorpass-api.onrender.com](https://anchorpass-api.onrender.com)
- **Video Demo:** [Watch Full Demo on Google Drive](https://drive.google.com/file/d/1x-I8TTi3dKf6cXKC2FrtrB2JUh8Psp1y/view?usp=sharing)
- **Contract Address (Testnet):** `CABA6ZABNSL3CSMYYO4IJIXTXOMECQKAT2ML5XKNZK32ZFQ4CHFLR4MT`
- **Google Form Link:** [Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLSfkmdP00FtplzE-eYJYuhDdPYD95IIKBmnqB5qGsJn_d9EyRg/viewform)
- **Response Sheet:** [Response Sheet Export](https://docs.google.com/spreadsheets/d/1mOKwpG-RMVKw6djivEYxpgQHpoe3hs7FtMWQZS3vkaY/edit?usp=sharing)
- **GitHub Repository:** [AnchorPass Source Code](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-)

---

## 📸 Screenshots & Evidence

| Institution Dashboard | Mobile Responsive View |
|:---:|:---:|
| <img src="images/product_uI.png" width="400" alt="Product UI"> | <img src="images/mobile_responsive.png" width="400" alt="Mobile Design"> |

| Monitoring & Analytics |
|:---:|
| <img src="images/analytics.png" width="400" alt="Analytics"> |

---

## 👥 User Onboarding & Feedback Implementation

We onboarded 12 real users with Stellar Testnet wallets and verifiable on-chain transactions for credential issuance. We collected their feedback and actively pushed Git Commits to production based on their requests.

| User ID | Name | Email | Wallet Address | Feedback Summary | Improvement Made | Tx Hash / Git Commit |
|---|---|---|---|---|---|---|
| 1 | Rahul Sharma | rahulsharma992@gmail.com | `GCDAV...FOX5H3` | Missing mobile push notifications. | Planned for v2 push notifications | [Tx Hash](https://stellar.expert/explorer/testnet/tx/95b38843d1b61534c49d88a06e5f1877d270f12022565b2d86f6157a00ff0e81) |
| 2 | Priya Patel | priyapatel821@gmail.com | `GA2SD...UGRLB` | I'd like more analytics features. | Planned for v2 analytics | [Tx Hash](https://stellar.expert/explorer/testnet/tx/a064f737ee6d87f67fd622b4fe6a4cd4195265a83849cb09268907d1ee5905dd) |
| 3 | Amit Kumar | amitkumar445@gmail.com | `GDZJY...BZ46Q` | Faster loading times on mobile devices. | Optimised layout spacing for mobile rendering | [Commit 17fe083](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-/commit/17fe083) |
| 4 | Neha Singh | nehasingh718@gmail.com | `GCWVS...B4MRU` | Needs a detailed tutorial section. | Added quick tutorial to institution dashboard | [Commit c8864bb](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-/commit/c8864bb) |
| 5 | Vikram Reddy | vikramreddy119@gmail.com | `GBVON...2VF7` | Allow custom branding for institutions. | Custom branding in v2 | [Tx Hash](https://stellar.expert/explorer/testnet/tx/3ee9327f9085bec6275296595ddfdee3a7498a40a1b99e7050159d9bc8a3acd9) |
| 6 | Anjali Desai | anjalidesai905@gmail.com | `GDCA4...T3CB` | Improve mobile layout. | Tweaked mobile layout breakpoints | [Commit 17fe083](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-/commit/17fe083) |
| 7 | Rohan Gupta | rohangupta337@gmail.com | `GAZGT...HBOJ` | Email notifications for scholarships. | Notification server needed | [Tx Hash](https://stellar.expert/explorer/testnet/tx/aae796b4a53ef8385975fc6a829ceef021798f645f230ac46a6fa016cc25e42e) |
| 8 | Sneha Joshi | snehajoshi552@gmail.com | `GD2X7...5IS3` | Allow PDF downloads. | Added PDF download functionality | [Commit c8864bb](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-/commit/c8864bb) |
| 9 | Arjun Verma | arjunverma214@gmail.com | `GAWBB...ODQJ` | Include a public directory. | Implemented public directory portal | [Commit 54bf2bb](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-/commit/54bf2bb) |
| 10 | Kavita Nair | kavitanair689@gmail.com | `GBYZU...KFT6` | More color themes. | Enabled core color-scheme theming support | [Commit e929541](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-/commit/e929541) |
| 11 | Manish Tiwari | manishtiwari774@gmail.com | `GARII...BGUS` | Add a developer portal. | Dev SDK planned | [Tx Hash](https://stellar.expert/explorer/testnet/tx/2ffe356545d8866401a55f32c09ad33c47dee117b5bb14bd80f9271aa676c3ca) |
| 12 | Pooja Mehta | poojamehta881@gmail.com | `GA5SS...B5A` | More integrations with university systems. | B2B integration in v2 | [Tx Hash](https://stellar.expert/explorer/testnet/tx/74ecb2920bb84c8a5a427ecad87afeac665ddf90ce129efe6fc5382267764872) |

---

## 🛠️ Tech Stack & Architecture

- **Frontend Stack:** React 18, Vite, TypeScript, Tailwind CSS
- **Wallet Connection:** Freighter via `@creit.tech/stellar-wallets-kit`
- **Backend Stack:** Node.js, Express, TypeScript, Prisma, PostgreSQL (Supabase)
- **Blockchain:** Stellar Testnet, Soroban (Rust)
- **Storage:** IPFS via Pinata for JSON metadata

## 📝 Smart Contract Functions

| Function | Access | Description |
|---|---|---|
| `register_institution(wallet, name)` | Institution | Register on-chain as an institution |
| `create_scholarship(id, title, amount, seats, deadline)` | Institution | Create a scholarship campaign |
| `assign_student(scholarship_id, student_wallet)` | Institution | Assign an eligible student |
| `claim_scholarship(scholarship_id, student_wallet)` | Student | Claim an assigned scholarship |
| `issue_credential(student, title, metadata_hash)` | Institution | Issue a verifiable credential |
| `verify_credential(credential_id)` | Anyone | Read credential state from chain |
| `revoke_credential(credential_id)` | Owning institution | Permanently revoke a credential |

---
*AnchorPass was built for the Stellar Community Fund. License: MIT.*
