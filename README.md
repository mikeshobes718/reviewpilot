# ReviewPilot

A simple Next.js + Firebase Starter that lets users sign in, create and list “review requests” in Firestore.

## Features

- Email/Password auth (Firebase Auth)  
- Firestore-backed “review_requests” collection  
- Create, list & delete your own requests  
- Strict security rules so each user only sees their own data

## Getting Started

1. Copy `.env.local.example` to `.env.local` and fill in your Firebase config.  
2. Install & run locally:
   \`\`\`bash
   npm install
   npm run dev
   \`\`\`
3. Sign in with an existing Firebase Auth user (or create one in the console).  
4. Start creating review requests!
