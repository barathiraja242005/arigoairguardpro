
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyASJ95SENqp8UBsshdSwwtMurDgdwCKADk",
  authDomain: "test-1-eee0e.firebaseapp.com",
  databaseURL: "https://test-1-eee0e-default-rtdb.firebaseio.com",
  projectId: "test-1-eee0e",
  messagingSenderId: "719530155670",
  appId: "1:719530155670:web:f69c03af261b603fe8acb7",
  measurementId: "G-PNJYGX96WH"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
