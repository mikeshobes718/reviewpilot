// scripts/set-admin.js

// --- THE FIX IS HERE ---
// We will explicitly load the dotenv package and tell it exactly where to find our environment file.
// This is more reliable than using the -r flag.
require('dotenv').config({ path: './.env.local' });

const admin = require('firebase-admin');

// This line should now work because the require('dotenv') line above has loaded the variable.
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = process.argv[2];

if (!uid) {
  console.error('Error: Please provide a UID as a command-line argument.');
  process.exit(1);
}

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Successfully set admin claim for user: ${uid}`);
    console.log("You now have the admin keycard. We can proceed to build the admin page.");
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error setting custom claims:', error);
    process.exit(1);
  });

