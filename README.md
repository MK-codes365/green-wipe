# 🛡️ Green Wipe - Secure & Eco-Friendly Data Erasure

Green Wipe is a modern, web-based application that provides verifiable, compliant, and eco-friendly data sanitization solutions. It leverages generative AI to suggest optimal wiping procedures and generates blockchain-anchored certificates to ensure a tamper-proof audit trail. Built with a focus on security and ease-of-use, Green Wipe empowers everyone from individuals to large corporations to securely erase data while promoting electronics recycling and reducing e-waste.

## ✨ Key Features

- **AI-Powered Wipe Suggestions:** Get expert recommendations for data sanitization methods (e.g., NIST SP 800-88, DoD 5220.22-M) based on the media type.
- **Multi-Platform Wiping:**
    - Securely wipe individual files directly through the browser.
    - Simulate wiping of entire drives (HDD, SSD, NVMe).
    - Simulate remote wiping of devices (Android, Windows, etc.).
- **Verifiable Certificates:** Generate official certificates of data erasure for every completed wipe.
- **Blockchain Anchoring (Simulated):** Anchor wipe certificates to a simulated blockchain to create a permanent, immutable record of destruction.
- **Real-Time Dashboard:** Monitor key statistics like total wipes, environmental impact (CO₂ saved, e-waste diverted), and see live updates on the impact tracker chart.
- **Secure User Authentication:** User sign-up and login handled securely via Firebase Authentication with support for email/password, Google, and GitHub providers.
- **Dynamic Content Translation:** The marketing homepage can be translated into multiple languages on the fly using AI.
- **Powerful Offline Wiping:** Includes `greenwipe.exe`, a standalone tool for creating bootable USB drives to perform full system wipes, ensuring even primary boot drives can be sanitized securely.

## 🔑 User Authentication

Green Wipe provides a secure and flexible authentication system powered by Firebase.

- **Create Account:** New users can sign up using their email and password, or instantly with their Google or GitHub accounts. Upon signing up with an email, a verification link is sent to confirm the address.
- **Login:** Registered users can log in using their chosen method. Social logins with Google and GitHub provide a quick and seamless way to access the dashboard.
- **Logout:** Users can securely log out of their account at any time using the "Log out" option in the user profile menu, which appears in the header after a successful login.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI Library:** [React](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
- **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Generative AI:** [Firebase Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models.
- **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Charts:** [Recharts](https://recharts.org/)
- **Deployment:** [Vercel](https://vercel.com/)

## 🔧 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later recommended)
- [npm](https://www.npmjs.com/) or a compatible package manager
- [Git](https://git-scm.com/) installed on your machine.
- A [Firebase Project](https://console.firebase.google.com/).

### Installation

1.  **Clone the repository (if applicable):**
    ```bash
    git clone https://github.com/your-username/green-wipe.git
    cd green-wipe
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    - **Google AI (Gemini):**
      Create a `.env.local` file in the root of your project and add your Google AI (Gemini) API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
      ```
      GEMINI_API_KEY="your_gemini_api_key_here"
      ```
      
    - **Firebase:**
      Open the `src/firebase/config.ts` file. You will see a `firebaseConfig` object with placeholder values. Replace these placeholders with your actual Firebase project's credentials.

      ```typescript
      // src/firebase/config.ts

      // 1. Go to your Firebase project console.
      // 2. In the project settings, find your web app's configuration object.
      // 3. Copy the values from your Firebase project and paste them here.
      export const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
      };
      ```
    
    - **Firebase Authentication Providers:**
       In the [Firebase Console](https://console.firebase.google.com/), go to the **Authentication** section, click on the **Sign-in method** tab, and enable the **Email/Password**, **Google**, and **GitHub** providers. Make sure to add your development domain (usually `localhost`) to the list of authorized domains.

4.  **Run the development server:**
    The application runs on two concurrent processes: one for the Next.js frontend and one for the Genkit AI flows.

    - **Terminal 1: Start the Next.js app:**
      ```bash
      npm run dev
      ```
      This will start the web application, typically on `http://localhost:3000`.

    - **Terminal 2: Start the Genkit server:**
      ```bash
      npm run genkit:watch
      ```
      This starts the local Genkit development server, which the Next.js app will call for AI functionality.

5.  **Open the application:**
    Open your browser and navigate to `http://localhost:3000` to see the application in action.

## 🚀 Deployment

### Deploying to Vercel

1.  **Push Your Project to GitHub:**
    Make sure your local repository is pushed to a new repository on GitHub.

2.  **Import and Deploy on Vercel:**
    - From your Vercel dashboard, click "Add New..." > "Project".
    - Connect to **GitHub** and select the repository you just created.
    - Vercel will automatically detect that this is a Next.js project and configure the build settings for you.
    - Before deploying, you must add your `GEMINI_API_KEY` and all the Firebase config values (`apiKey`, `authDomain`, etc.) as environment variables in the Vercel UI under your project's "Settings" > "Environment Variables".

3.  **Deploy Site:**
    Click the "Deploy" button. Vercel will build and deploy your app. From now on, every time you `git push` to your `main` branch, Vercel will automatically redeploy your site.
