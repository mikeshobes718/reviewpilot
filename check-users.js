const { initializeApp } = require('firebase/app');
const { getAuth, listUsers } = require('firebase/auth');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbvy5lC1yczSa8HMmicpEYFFZz0tbHZ5s",
  authDomain: "reviewpilot2.firebaseapp.com",
  projectId: "reviewpilot2",
  storageBucket: "reviewpilot2.firebasestorage.app",
  messagingSenderId: "577051575061",
  appId: "1:577051575061:web:16dfd593d88bbdc5351f1c",
  measurementId: "G-JZ78N8KWSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function checkExistingUsers() {
  console.log('🔍 Checking existing users in your Firebase database...');
  console.log('📊 Project ID:', firebaseConfig.projectId);
  
  try {
    // Check Firestore for user documents
    console.log('\n📚 Checking Firestore collections...');
    
    const collections = ['users', 'profiles', 'subscriptions', 'reviews'];
    
    for (const collectionName of collections) {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        console.log(`   📁 Collection '${collectionName}': ${querySnapshot.size} documents`);
        
        if (querySnapshot.size > 0) {
          querySnapshot.forEach((doc) => {
            console.log(`      📄 Document ID: ${doc.id}`);
            console.log(`         Data: ${JSON.stringify(doc.data(), null, 2)}`);
          });
        }
      } catch (error) {
        console.log(`   ⚠️ Collection '${collectionName}': ${error.message}`);
      }
    }
    
    // Note: Firebase Admin SDK is required for listUsers
    console.log('\n⚠️ Note: To check Firebase Auth users, you need Firebase Admin SDK');
    console.log('   This requires server-side access or Firebase Admin credentials');
    
    console.log('\n✅ User database check completed!');
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  }
}

// Run the check
checkExistingUsers().catch(console.error);
