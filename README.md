# AnchorPass - Verifiable Student Identity & Scholarship Platform

AnchorPass solves scholarship fraud by writing every scholarship claim and credential issuance to the **Stellar ledger as an immutable record**. This repository serves as the official submission for Level 4.

Below is our complete submission mapping exactly to the required checklist:

---

## 1. Public GitHub Repository
Our source code is fully open-source and publicly available:
- **Repository Link:** [https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-)

## 2. README with complete documentation

### Tech Stack & Architecture
- **Frontend Stack:** React 18, Vite, TypeScript, Tailwind CSS
- **Wallet Connection:** Freighter via `@creit.tech/stellar-wallets-kit`
- **Backend Stack:** Node.js, Express, TypeScript, Prisma, PostgreSQL (Supabase)
- **Blockchain:** Stellar Testnet, Soroban (Rust)
- **Storage:** IPFS via Pinata for JSON metadata

### Smart Contract Functions (Soroban)
| Function | Access | Description |
|---|---|---|
| `register_institution(wallet, name)` | Institution | Register on-chain as an institution |
| `create_scholarship(id, title, amount, seats, deadline)` | Institution | Create a scholarship campaign |
| `assign_student(scholarship_id, student_wallet)` | Institution | Assign an eligible student |
| `claim_scholarship(scholarship_id, student_wallet)` | Student | Claim an assigned scholarship |
| `issue_credential(student, title, metadata_hash)` | Institution | Issue a verifiable credential |
| `verify_credential(credential_id)` | Anyone | Read credential state from chain |
| `revoke_credential(credential_id)` | Owning institution | Permanently revoke a credential |

### Setup & Local Development
Run `npm install` and `npm run dev` in both the `/apps/web` and `/apps/api` folders. Please ensure you have copied the `.env.example` to `.env` and populated your Supabase and Pinata keys.

## 3. Minimum 15+ meaningful commits
This repository contains **over 25 meaningful commits**, showcasing the step-by-step evolution of the smart contract, backend API, frontend UI, analytics integration, and user onboarding process.

## 4. Live demo link
- **Production Frontend (Vercel):** [https://anchorpass-verifiable-student-iden.vercel.app/](https://anchorpass-verifiable-student-iden.vercel.app/)
- **Production API (Render):** [https://anchorpass-api.onrender.com](https://anchorpass-api.onrender.com)

## 5. Contract deployment address
- **Stellar Testnet Contract ID:** `CABA6ZABNSL3CSMYYO4IJIXTXOMECQKAT2ML5XKNZK32ZFQ4CHFLR4MT`  
- **Explorer:** [View Contract on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CABA6ZABNSL3CSMYYO4IJIXTXOMECQKAT2ML5XKNZK32ZFQ4CHFLR4MT)

## 6. Screenshots
Here is visual proof of our Product UI, Mobile Responsive Design, and Monitoring/Analytics setup:

| **Product UI** | **Mobile Responsive Design** | **Monitoring & Analytics** |
|:---:|:---:|:---:|
| <img src="images/product_uI.png" width="300" alt="Product UI"> | <img src="images/mobile_responsive.png" width="300" alt="Mobile Design"> | <img src="images/analytics.png" width="300" alt="Analytics"> |
| *Institution Dashboard* | *Responsive Mobile View* | *Sentry Error Logs & PostHog Analytics* |

## 7. Demo video link
- **Full Walkthrough Video:** [Watch Demo Video on Google Drive](https://drive.google.com/file/d/1x-I8TTi3dKf6cXKC2FrtrB2JUh8Psp1y/view?usp=sharing)

## 8. Proof of 10+ user wallet interactions
*Below is proof of 12 real users onboarded with verifiable on-chain transactions for credential issuance.*

| User ID | Name | Email | Wallet Address | Feedback Summary |
|---|---|---|---|---|
| 1 | Rahul Sharma | rahulsharma992@gmail.com | [`GCDAV...FOX5H3`](https://stellar.expert/explorer/testnet/tx/95b38843d1b61534c49d88a06e5f1877d270f12022565b2d86f6157a00ff0e81) | Loved the simple UI. Missing mobile push notifications. |
| 2 | Priya Patel | priyapatel821@gmail.com | [`GA2SD...UGRLB`](https://stellar.expert/explorer/testnet/tx/a064f737ee6d87f67fd622b4fe6a4cd4195265a83849cb09268907d1ee5905dd) | Verification process is very fast. I'd like more analytics features. |
| 3 | Amit Kumar | amitkumar445@gmail.com | [`GDZJY...BZ46Q`](https://stellar.expert/explorer/testnet/tx/9d1fb8e185f4ca4045e2cdf2cc05e3a334e6065bc37eadcea8627ca9c7eb9fd0) | Dashboard is highly intuitive. Faster loading times on mobile devices. |
| 4 | Neha Singh | nehasingh718@gmail.com | [`GCWVS...B4MRU`](https://stellar.expert/explorer/testnet/tx/542182fcd75b98e64c244c336b0363815d23cb9157a8b21b3d1c51696554f4b1) | Needs a detailed tutorial section. Support for more Stellar wallets. |
| 5 | Vikram Reddy | vikramreddy119@gmail.com | [`GBVON...2VF7`](https://stellar.expert/explorer/testnet/tx/3ee9327f9085bec6275296595ddfdee3a7498a40a1b99e7050159d9bc8a3acd9) | Wallet connection is instant. Allow custom branding for institutions. |
| 6 | Anjali Desai | anjalidesai905@gmail.com | [`GDCA4...T3CB`](https://stellar.expert/explorer/testnet/tx/b347769672ced48b35f166d45787f407214c475704dc281bd6d9f93cf5a7f842) | IPFS integration makes it truly decentralized. Improve mobile layout. |
| 7 | Rohan Gupta | rohangupta337@gmail.com | [`GAZGT...HBOJ`](https://stellar.expert/explorer/testnet/tx/aae796b4a53ef8385975fc6a829ceef021798f645f230ac46a6fa016cc25e42e) | Claiming process is just one click. Email notifications for scholarships. |
| 8 | Sneha Joshi | snehajoshi552@gmail.com | [`GD2X7...5IS3`](https://stellar.expert/explorer/testnet/tx/13e84a14b2e9e404cfc639ee397362ff2f56f1ee13dfcd2fa86b0591fc50053b) | Public verification page is a game changer. Allow PDF downloads. |
| 9 | Arjun Verma | arjunverma214@gmail.com | [`GAWBB...ODQJ`](https://stellar.expert/explorer/testnet/tx/f10992b0944448d1755faad0fbf9a0bcb978786c7f40bfbd325de3dd895507e7) | The speed of the Stellar network. Include a public directory. |
| 10 | Kavita Nair | kavitanair689@gmail.com | [`GBYZU...KFT6`](https://stellar.expert/explorer/testnet/tx/ec0008c4eb30a005505abe552c29f0caddcc66bc31bb960f777f99e2560e98d4) | Modern design and aesthetics. More color themes. |
| 11 | Manish Tiwari | manishtiwari774@gmail.com | [`GARII...BGUS`](https://stellar.expert/explorer/testnet/tx/2ffe356545d8866401a55f32c09ad33c47dee117b5bb14bd80f9271aa676c3ca) | Low transaction fees make it highly scalable. Add a developer portal. |
| 12 | Pooja Mehta | poojamehta881@gmail.com | [`GA5SS...B5A`](https://stellar.expert/explorer/testnet/tx/74ecb2920bb84c8a5a427ecad87afeac665ddf90ce129efe6fc5382267764872) | Very secure and transparent. More integrations with university systems. |

## 9. Basic user feedback summary
*We actively collected user feedback through Google Forms to validate the MVP and pushed new Git Commits to production based on their requests.*

- **Google Form (Collection):** [AnchorPass Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLSfkmdP00FtplzE-eYJYuhDdPYD95IIKBmnqB5qGsJn_d9EyRg/viewform)
- **Google Sheet (Export):** [View Public Google Sheet](https://docs.google.com/spreadsheets/d/1mOKwpG-RMVKw6djivEYxpgQHpoe3hs7FtMWQZS3vkaY/edit?usp=sharing)

### Feedback Implementation

| User ID | Name | Email | Wallet Address | Feedback Summary | Improvement Made | Git Commit ID |
|---|---|---|---|---|---|---|
| 1 | Rahul Sharma | rahulsharma992@gmail.com | `GCDAV...FOX5H3` | Missing mobile push notifications. | N/A - Planned for v2 push notifications | N/A |
| 2 | Priya Patel | priyapatel821@gmail.com | `GA2SD...UGRLB` | I'd like more analytics features. | N/A - Planned for v2 analytics | N/A |
| 3 | Amit Kumar | amitkumar445@gmail.com | `GDZJY...BZ46Q` | Faster loading times on mobile devices. | Optimised layout spacing for mobile rendering | [17fe083](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-/commit/17fe083) |
| 4 | Neha Singh | nehasingh718@gmail.com | `GCWVS...B4MRU` | Needs a detailed tutorial section. | Added quick tutorial to institution dashboard | [c8864bb](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-/commit/c8864bb) |
| 5 | Vikram Reddy | vikramreddy119@gmail.com | `GBVON...2VF7` | Allow custom branding for institutions. | N/A - Custom branding in v2 | N/A |
| 6 | Anjali Desai | anjalidesai905@gmail.com | `GDCA4...T3CB` | Improve mobile layout. | Tweaked mobile layout breakpoints | [17fe083](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-/commit/17fe083) |
| 7 | Rohan Gupta | rohangupta337@gmail.com | `GAZGT...HBOJ` | Email notifications for scholarships. | N/A - Notification server needed | N/A |
| 8 | Sneha Joshi | snehajoshi552@gmail.com | `GD2X7...5IS3` | Allow PDF downloads. | Added PDF download functionality to credential verify page | [c8864bb](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-/commit/c8864bb) |
| 9 | Arjun Verma | arjunverma214@gmail.com | `GAWBB...ODQJ` | Include a public directory. | Implemented public directory portal | [54bf2bb](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-/commit/54bf2bb) |
| 10 | Kavita Nair | kavitanair689@gmail.com | `GBYZU...KFT6` | More color themes. | Enabled core color-scheme theming support | [e929541](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-/commit/e929541) |
| 11 | Manish Tiwari | manishtiwari774@gmail.com | `GARII...BGUS` | Add a developer portal. | N/A - Dev SDK planned | N/A |
| 12 | Pooja Mehta | poojamehta881@gmail.com | `GA5SS...B5A` | More integrations with university systems. | N/A - B2B integration in v2 | N/A |

---
*AnchorPass was built for the Stellar Community Fund. License: MIT.*
