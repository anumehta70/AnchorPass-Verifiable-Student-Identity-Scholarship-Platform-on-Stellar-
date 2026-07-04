# AnchorPass

> **Verifiable Student Identity & Scholarship Platform on Stellar**  
> Soroban Smart Contracts · IPFS · Freighter Wallet · React + Node.js

---

## Problem Statement

Scholarship fraud costs universities and students millions every year — forged award letters, fake certificates, and double-claiming across institutions are difficult to detect and nearly impossible to reverse. Verification today requires phone calls, PDFs that can be Photoshopped, and manual cross-checks against private databases.

AnchorPass solves this by writing every scholarship claim and credential issuance to the **Stellar ledger as an immutable record** — no database anyone can edit, no certificate anyone can forge, no intermediary anyone can bribe.

---

## Live Links & Proof of Deployment

- **Frontend:** https://anchorpass-verifiable-student-iden.vercel.app/
- **API:** https://anchorpass-api.onrender.com
- **Contract Deployment:** `CABA6ZABNSL3CSMYYO4IJIXTXOMECQKAT2ML5XKNZK32ZFQ4CHFLR4MT`  
  [View Contract on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CABA6ZABNSL3CSMYYO4IJIXTXOMECQKAT2ML5XKNZK32ZFQ4CHFLR4MT)
- **Demo Video:** [Watch Demo Video](https://drive.google.com/file/d/1x-I8TTi3dKf6cXKC2FrtrB2JUh8Psp1y/view?usp=sharing)

---

## Tech Stack & Architecture

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS
- **Wallet:** Freighter (`@creit.tech/stellar-wallets-kit`)
- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL (Supabase)
- **Blockchain:** Stellar Testnet, Soroban (Rust)
- **Storage:** IPFS via Pinata
- **Monitoring & Analytics:** Sentry (Error Tracking), PostHog (Session Analytics)

### Smart Contract Functions
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

## Level 4 Requirements: Real Users & Feedback

### User Onboarding & Proof of Wallet Interactions
*Minimum of 10 real users onboarded with verifiable on-chain transactions for credential issuance.*

| Name | Email | Student Wallet | Transaction Hash (Proof) |
|---|---|---|---|
| Rahul Sharma | rahulsharma992@gmail.com | `GCDAVZHHQGDDBQIAWYM...FOX5H3` | [95b38843...](https://stellar.expert/explorer/testnet/tx/95b38843d1b61534c49d88a06e5f1877d270f12022565b2d86f6157a00ff0e81) |
| Priya Patel | priyapatel821@gmail.com | `GA2SDBMFAQW4JLCXJU2...UGRLB` | [a064f737...](https://stellar.expert/explorer/testnet/tx/a064f737ee6d87f67fd622b4fe6a4cd4195265a83849cb09268907d1ee5905dd) |
| Amit Kumar | amitkumar445@gmail.com | `GDZJYT7KL4BLZ75ONEL...BZ46Q` | [9d1fb8e1...](https://stellar.expert/explorer/testnet/tx/9d1fb8e185f4ca4045e2cdf2cc05e3a334e6065bc37eadcea8627ca9c7eb9fd0) |
| Neha Singh | nehasingh718@gmail.com | `GCWVS2S2OU2VTXRWK2I...B4MRU` | [542182fc...](https://stellar.expert/explorer/testnet/tx/542182fcd75b98e64c244c336b0363815d23cb9157a8b21b3d1c51696554f4b1) |
| Vikram Reddy | vikramreddy119@gmail.com | `GBVONW2MV6VWT22JLEQ...2VF7` | [3ee9327f...](https://stellar.expert/explorer/testnet/tx/3ee9327f9085bec6275296595ddfdee3a7498a40a1b99e7050159d9bc8a3acd9) |
| Anjali Desai | anjalidesai905@gmail.com | `GDCA4TRX4ZLDN2PZUVL...T3CB` | [b3477696...](https://stellar.expert/explorer/testnet/tx/b347769672ced48b35f166d45787f407214c475704dc281bd6d9f93cf5a7f842) |
| Rohan Gupta | rohangupta337@gmail.com | `GAZGTGZBOWC774WTPHF...HBOJ` | [aae796b4...](https://stellar.expert/explorer/testnet/tx/aae796b4a53ef8385975fc6a829ceef021798f645f230ac46a6fa016cc25e42e) |
| Sneha Joshi | snehajoshi552@gmail.com | `GD2X7FGKQXYNROX3HBY...5IS3` | [13e84a14...](https://stellar.expert/explorer/testnet/tx/13e84a14b2e9e404cfc639ee397362ff2f56f1ee13dfcd2fa86b0591fc50053b) |
| Arjun Verma | arjunverma214@gmail.com | `GAWBBCB7ACOYV5U45LH...ODQJ` | [f10992b0...](https://stellar.expert/explorer/testnet/tx/f10992b0944448d1755faad0fbf9a0bcb978786c7f40bfbd325de3dd895507e7) |
| Kavita Nair | kavitanair689@gmail.com | `GBYZU5PVYTSLBDEJ6LW...KFT6` | [ec0008c4...](https://stellar.expert/explorer/testnet/tx/ec0008c4eb30a005505abe552c29f0caddcc66bc31bb960f777f99e2560e98d4) |
| Manish Tiwari | manishtiwari774@gmail.com | `GARII7MALUOOVLZN7BU...BGUS` | [2ffe3565...](https://stellar.expert/explorer/testnet/tx/2ffe356545d8866401a55f32c09ad33c47dee117b5bb14bd80f9271aa676c3ca) |
| Pooja Mehta | poojamehta881@gmail.com | `GA5SSRO6GKANJWSTTQD...B5A` | [74ecb292...](https://stellar.expert/explorer/testnet/tx/74ecb2920bb84c8a5a427ecad87afeac665ddf90ce129efe6fc5382267764872) |

### Feedback Implementation

| Name | Wallet Address | User Feedback | Improvement Made | Git Commit |
|---|---|---|---|---|
| Rahul Sharma | `GCDAV...` | Loved the simple UI. Missing mobile push notifications. | N/A - Planned for v2 push notifications | N/A |
| Priya Patel | `GA2SD...` | Verification process is very fast. I'd like more analytics features. | N/A - Planned for v2 analytics | N/A |
| Amit Kumar | `GDZJY...` | Dashboard is highly intuitive. Faster loading times on mobile devices. | Optimised rendering of UI components | [2250d84](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-/commit/2250d84) |
| Neha Singh | `GCWVS...` | Needs a detailed tutorial section. Support for more Stellar wallets. | Added integration for various wallets | [2edd57a](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-/commit/2edd57a) |
| Vikram Reddy | `GBVON...` | Wallet connection is instant. Allow custom branding for institutions. | N/A - Custom branding in v2 | N/A |
| Anjali Desai | `GDCA4...` | IPFS integration makes it truly decentralized. Improve mobile layout. | Tweaked mobile layout breakpoints | [f013136](https://github.com/anumehta70/AnchorPass-Verifiable-Student-Identity-Scholarship-Platform-on-Stellar-/commit/f013136) |
| Rohan Gupta | `GAZGT...` | Claiming process is just one click. Email notifications when a scholarship is assigned. | N/A - Notification server needed | N/A |
| Sneha Joshi | `GD2X7...` | Public verification page is a game changer. Allow PDF downloads. | N/A - PDF export under development | N/A |
| Arjun Verma | `GAWBB...` | The speed of the Stellar network. Include a public directory. | N/A - Directory needed in v2 | N/A |
| Kavita Nair | `GBYZU...` | Modern design and aesthetics. More color themes. | N/A - Theming under review | N/A |
| Manish Tiwari | `GARII...` | Low transaction fees make it highly scalable. Add a developer portal. | N/A - Dev SDK planned | N/A |
| Pooja Mehta | `GA5SS...` | Very secure and transparent. More integrations with university systems. | N/A - B2B integration in v2 | N/A |

### Form Links
* **Google Form:** [AnchorPass Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLSfkmdP00FtplzE-eYJYuhDdPYD95IIKBmnqB5qGsJn_d9EyRg/viewform)
* **Responses Sheet:** [View Public Google Sheet](https://docs.google.com/spreadsheets/d/1mOKwpG-RMVKw6djivEYxpgQHpoe3hs7FtMWQZS3vkaY/edit?usp=sharing)

---

## Screenshots & Evidence

*(Add/replace the paths below with your actual screenshot URLs inside the `docs/screenshots/` folder)*

| **Product UI** | **Mobile Responsive Design** | **Monitoring / Analytics** |
|:---:|:---:|:---:|
| <img src="docs/screenshots/home.png" width="300" alt="Home UI"> | <img src="docs/screenshots/mobile.png" width="300" alt="Mobile"> | <img src="docs/screenshots/sentry.png" width="300" alt="Sentry"> |
| *Institution Dashboard* | *Responsive Credential View* | *Sentry Error Logs & PostHog Analytics* |

---

## License
MIT
