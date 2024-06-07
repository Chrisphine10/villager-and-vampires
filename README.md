# Vampire Village React App

This React application is a multiplayer game called Vampire Village, where players take on the roles of villagers and vampires in a battle of wits and deduction.

## Day Phase Instructions:

- During the day phase, all players gather in the village square to discuss and deliberate.
- Villagers should share any suspicions they have about other players and present evidence if available.
- Players can ask questions, analyze behavior, and attempt to deduce the identities of vampires.
- The goal for villagers is to identify and vote out suspected vampires.
- Players must be cautious not to reveal sensitive information that could be used by vampires against them.
- Once all discussions are complete, players vote on which player they believe is a vampire.
- The player with the most votes is eliminated from the game and their role is revealed.
- After the vote, the game progresses to the night phase.

## Night Phase Instructions:

- During the night phase, vampires secretly select a player to eliminate.
- Villagers must try to protect themselves from vampire attacks.
- Special roles like the Seer may have additional actions they can perform during the night.
- Once all actions are resolved, the day phase begins again.

## How to Run the App:

To run the Vampire Village React App locally, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Install dependencies by running `npm install` or `yarn install`.
4. Create a Firebase project and configure it with your Firebase credentials.
5. Update the Firebase configuration in the app's source code.
6. Start the development server by running `npm start` or `yarn start`.
7. Open your browser and navigate to `http://localhost:3000` to view the app.

## Firebase.js in /SRC
```
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set, onValue, update, off } from "firebase/database";
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID" // Optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const real = getDatabase(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Set persistence
setPersistence(auth, browserLocalPersistence);

export { db, auth, real, ref, set, onValue, update, off };
```

## Technologies Used:

- React
- Firebase (for backend services)
- Material-UI (for UI components)
- Redux (for state management)

## Contributors:

- Chrisphine10

