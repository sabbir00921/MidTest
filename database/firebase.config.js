// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsysvwwc6VEYGtfzwwuFDOndZVUupaxY0",
  authDomain: "mern-mid-test.firebaseapp.com",
  databaseURL: "https://mern-mid-test-default-rtdb.firebaseio.com",
  projectId: "mern-mid-test",
  storageBucket: "mern-mid-test.firebasestorage.app",
  messagingSenderId: "725260012226",
  appId: "1:725260012226:web:982a3b2087ce4951bd895b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;