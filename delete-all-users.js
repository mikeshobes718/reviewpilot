const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

// Firebase configuration
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

async function deleteAllUsers() {
  try {
    console.log('🔐 Signing in as admin...');
    
    // Sign in with admin credentials
    const adminEmail = 'admin@reviewsandmarketing.com'; // Replace with actual admin email
    const adminPassword = 'admin123'; // Replace with actual admin password
    
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('✅ Signed in as admin');
    } catch (authError) {
      console.log('⚠️ Could not sign in as admin, trying to proceed without authentication...');
      console.log('Note: Some operations may fail without proper authentication');
    }
    
    console.log('🗑️ Starting user deletion process...');
    
    // Get all users from Firestore
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    if (usersSnapshot.empty) {
      console.log('✅ No users found in database');
      return;
    }
    
    console.log(`📊 Found ${usersSnapshot.size} users to delete`);
    
    // Delete each user document
    const deletePromises = usersSnapshot.docs.map(async (userDoc) => {
      try {
        await deleteDoc(doc(db, 'users', userDoc.id));
        console.log(`✅ Deleted user: ${userDoc.id}`);
        return { success: true, id: userDoc.id };
      } catch (error) {
        console.error(`❌ Failed to delete user ${userDoc.id}:`, error.message);
        return { success: false, id: userDoc.id, error: error.message };
      }
    });
    
    const results = await Promise.all(deletePromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log('\n📋 Deletion Summary:');
    console.log(`✅ Successfully deleted: ${successful} users`);
    if (failed > 0) {
      console.log(`❌ Failed to delete: ${failed} users`);
    }
    
    // Also try to delete from other collections that might contain user data
    console.log('\n🧹 Cleaning up other user-related collections...');
    
    const collectionsToCheck = ['userProfiles', 'subscriptions', 'reviewRequests'];
    
    for (const collectionName of collectionsToCheck) {
      try {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        
        if (!snapshot.empty) {
          console.log(`🗑️ Deleting ${snapshot.size} documents from ${collectionName}...`);
          const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
          await Promise.all(deletePromises);
          console.log(`✅ Deleted all documents from ${collectionName}`);
        } else {
          console.log(`✅ No documents found in ${collectionName}`);
        }
      } catch (error) {
        console.log(`⚠️ Could not access ${collectionName}: ${error.message}`);
      }
    }
    
    console.log('\n🎉 User deletion process completed!');
    console.log('💡 You can now test the signup process from scratch');
    
  } catch (error) {
    console.error('❌ Error during user deletion:', error);
  }
}

// Run the deletion
deleteAllUsers().catch(console.error);
