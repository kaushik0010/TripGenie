# TripGenie 🧞 - Your Personal AI Travel Assistant

**TripGenie** is an intelligent, AI-powered Progressive Web App (PWA) that transforms the travel planning experience. It moves beyond static suggestions to act as a personal travel expert, crafting complete, personalized, and real-time adjustable itineraries based on a user's unique budget, interests, and circumstances.



## 🎯 Project Goal

Traditional travel planning is a fragmented and time-consuming process. Users spend hours jumping between blogs, booking sites, and maps to piece together a trip, often missing local insights and struggling to manage their budget.

**TripGenie solves this by creating a single, intelligent platform where a user's travel dream is converted into a detailed, bookable reality in seconds.** Our goal is to make travel planning accessible, personal, and delightful for everyone.



## ✨ Core Functionalities

* **🧠 AI-Powered Itinerary Generation:** Creates complete, day-by-day travel plans from simple user inputs.
* **💡 Intelligent Destination Suggestions:** For users unsure where to go, the AI suggests suitable destinations based on their interests, budget, and source location.
* **🌐 Multilingual Interface:** Supports multiple Indian languages for both the UI and the AI-generated content, making travel planning accessible to a wider audience.
* **🌦️ Real-Time Smart Adjustments:** Users can input real-time events (e.g., "it's raining," "a museum is closed"), and the AI will regenerate that day's plan with suitable alternatives.
* **💰 Multi-Currency Budgeting:** Users can plan their budget in their native currency (USD, INR, EUR), and the AI provides a detailed cost analysis in the destination's local currency.
* **🗺️ Interactive Map Visualization:** Every itinerary is plotted on a Google Map with a clear polyline path connecting the source and all activity locations.
* **🧑‍🤝‍🧑 Personalized for Group Types:** Itineraries are tailored for solo, family, or group travel, with crowd-aware suggestions for weekends.
* **🏢 Local Agency Finder:** Automatically finds and displays a list of local tour and travel agencies at the destination using the Google Places API.
* **🔐 Secure User Accounts:** Full authentication using Firebase allows users to securely save and revisit their planned trips.


---


## 🛠️ Technical Implementation & Tech Stack

TripGenie is built on a modern, scalable, and secure tech stack, leveraging the best of the Google AI ecosystem.

| Layer                | Technology                               | Purpose                                                              |
| -------------------- | ---------------------------------------- | -------------------------------------------------------------------- |
| **Frontend** | **Next.js 14 (App Router)**, React, TypeScript | Performant, server-first UI with excellent developer experience.       |
| **Styling** | **Tailwind CSS** & **shadcn/ui** | A modern, utility-first CSS framework for rapid and clean UI development. |
| **Backend/API** | **Next.js API Routes** | Serverless functions for all backend logic, hosted at the edge.        |
| **AI Services** | **Google AI (Gemini 2.5 Flash)** | Powering all generative features: suggestions, itineraries, and adjustments. |
| **Authentication** | **Firebase Authentication** | Secure user sign-up, login, and session management.                  |
| **Database** | **MongoDB Atlas** with **Mongoose** | Storing user profiles and their saved trip itineraries.              |
| **Maps & Places** | **Google Maps API** & **Places API** | Visualizing itineraries and finding local travel agencies.         |
| **Security** | **Firebase Admin SDK**, Rate Limiting, XSS Sanitization | Server-side token verification and protection against common threats. |
| **Deployment** | **Vercel** | Optimized hosting for Next.js applications.                          |

---

## 🚀 Instructions for Judges to Access & Test

### Prerequisites
* Node.js (v18 or later)
* `pnpm` package manager (`npm install -g pnpm`)
* Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/kaushik0010/TripGenie.git
cd tripgenie
```

### Step 2: Install Dependencies
```bash
pnpm install
```

### Step 3: Set Up Environment Variables (Crucial)

Create a new file named .env.local in the root of the project and populate it with the following keys.

```bash
# 1. Google AI Studio Key ([https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# 2. Exchange Rate API Key ([https://www.exchangerate-api.com](https://www.exchangerate-api.com))
EXCHANGE_RATE_API_KEY="YOUR_EXCHANGE_RATE_API_KEY_HERE"

# 3. Google Maps API Key ([https://console.cloud.google.com/](https://console.cloud.google.com/))
#    - Enable: Maps JavaScript API, Geocoding API, Places API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_MAPS_API_KEY_HERE"

# 4. Firebase Project Keys (From your Firebase project settings)
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_KEY_HERE"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_DOMAIN_HERE"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID_HERE"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_BUCKET_HERE"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_SENDER_ID_HERE"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID_HERE"

# 5. Firebase Admin SDK
#    - Generate a private key from Firebase Settings > Service Accounts
#    - Place the downloaded .json file in the root of the project and rename it to "serviceAccountKey.json"

# 6. MongoDB Atlas Connection String
MONGODB_URI="mongodb+srv://USER:PASS@cluster.mongodb.net/tripgenie?retryWrites=true&w=majority"
```

### Step 4: Run the Application
```bash
pnpm dev
```

### Step 5: Access the Solution
Open your browser and navigate to http://localhost:3000.


---


## 🧪 How to Test the Functionalities

### Scenario 1: The "I'm Not Sure Where to Go" Flow

1. Leave the Destination field blank.

2. Fill in other details like Source Location, Duration, Budget, and Interests.

3. Click "Suggest Destinations".

4. Result: The app should display several AI-powered destination suggestions. Click one of them.

5. Result: The app will auto-fill the destination and generate a complete itinerary for it.

### Scenario 2: The "Smart Adjust" Flow
1. Generate any itinerary.

2. On one of the day cards, click the "Adjust" button.

3. In the popup, type a real-time event like "It's raining heavily" or "The main temple is closed for a private event".

4. Click "Update Plan".

5. Result: The activities for that specific day should be regenerated with suitable alternatives.

### Scenario 3: The "Save & View" Flow
1. Sign in using the Google authentication button.

2. Generate any itinerary.

3. Click the "Save Trip" button. You should see a "Saved!" confirmation.

4. Navigate to the "My Trips" page using the link in the header.

5. Result: You should see a card for the trip you just saved. Click it.

6. Result: You will be taken to a detail page showing the complete saved itinerary.


---


## 🌱 Social Impact
TripGenie aims to make travel more accessible, personalized, and enjoyable.
1. Democratizing Travel Planning: By removing the complexity and time commitment of planning, we empower more people to explore new places with confidence.

2. Promoting Local Tourism: The "Local Agencies" and "Hidden Gems" features encourage travelers to engage with local businesses and discover less-traveled spots, helping to distribute tourist spending more evenly.

3. Breaking Language Barriers: By providing both a UI and AI-generated content in multiple Indian languages, we make our tool accessible to a much broader audience, ensuring language is not a barrier to travel.