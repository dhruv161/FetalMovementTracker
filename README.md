📱 Daily Fetal Movement Tracker (React Native)

A simple React Native mobile application to help users track daily fetal movements by recording the time taken to feel 10 kicks.
All data is stored locally on the device with no backend dependency.

This project was built as part of a React Native Developer Intern assignment.

✨ Features

📋 View previously saved fetal movement sessions

⏱️ Record time taken for 10 fetal kicks

💾 Local data persistence using AsyncStorage

🔄 Data persists after app restart

📊 Sessions sorted by latest date/time

ℹ️ Informational bottom sheet with tracking steps

📱 Android & iOS support

📷 Screens

Home Screen

Displays list of past records

Shows date and time taken (in minutes)

Counter Screen

Timer starts at 00:00

Start / Stop recording

Save or go back without saving

Info Modal

Step-by-step instructions for tracking fetal kicks

🛠️ Tech Stack

React Native CLI (v0.83)

TypeScript

React Navigation v7

AsyncStorage (@react-native-async-storage/async-storage)

react-native-safe-area-context

📁 Project Structure
src/
 ├─ screens/
 │   ├─ HomeScreen.tsx
 │   ├─ CounterScreen.tsx
 ├─ navigation/
 │   ├─ AppNavigator.tsx
 ├─ storage/
 │   ├─ sessionStorage.ts
 ├─ types/
 │   ├─ session.ts
 ├─ components/
 │   ├─ InfoModal.tsx
 └─ App.tsx

🗃️ Data Storage Design

Each fetal movement session is stored as an object:

type FetalSession = {
  id: string;
  startedAt: number;          // timestamp
  durationInSeconds: number; // total time taken
};


All sessions are stored as an array in AsyncStorage under a single key:

FETAL_SESSIONS


Sessions are:

Serialized using JSON.stringify

Parsed using JSON.parse

Sorted by latest startedAt

▶️ How to Run the Project
1️⃣ Install dependencies
npm install

2️⃣ iOS Setup
cd ios
pod install
cd ..
npx react-native run-ios

3️⃣ Android Setup

Start Android Emulator OR connect physical device

npx react-native run-android

📦 Generate Android APK (Debug)
cd android
./gradlew assembleDebug


APK path:

android/app/build/outputs/apk/debug/app-debug.apk