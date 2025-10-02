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
- **Dynamic Content Translation:** The marketing homepage can be translated into multiple languages on the fly using AI.
- **Secure by Design:** Built with a focus on security, simulating best practices for data sanitization.
- **Powerful Offline Wiping:** Includes `greenwipe.exe`, a standalone tool for creating bootable USB drives to perform full system wipes, ensuring even primary boot drives can be sanitized securely.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI Library:** [React](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI:** [Firebase Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models.
- **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Charts:** [Recharts](https://recharts.org/)
- **Deployment:** [Vercel](https://greenwipe.vercel.app/)

LIVE LINK : https://greenwipe.vercel.app/

## 🔧 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later recommended)
- [npm](https://www.npmjs.com/) or a compatible package manager
- [Git](https://git-scm.com/) installed on your machine.

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
    Create a `.env.local` file in the root of your project and add your Google AI (Gemini) API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server:**
    The application runs on two concurrent processes: one for the Next.js frontend and one for the Genkit AI flows.

    - **Terminal 1: Start the Next.js app:**
      ```bash
      npm run dev
      ```
      This will start the web application, typically on `http://localhost:9002`.

    - **Terminal 2: Start the Genkit server:**
      ```bash
      npm run genkit:watch
      ```
      This starts the local Genkit development server, which the Next.js app will call for AI functionality.

5.  **Open the application:**
    Open your browser and navigate to `http://localhost:9002` to see the application in action.

## 🚀 Deployment to Netlify

Deploying this project is a two-step process: first, get your code into a GitHub repository, and second, connect that repository to Netlify.

### Step 1: Push Your Project to GitHub

You can't upload folders directly to GitHub's website. Instead, you use the `git` command-line tool.

1.  **Create a New Repository on GitHub:**
    Go to [GitHub](https://github.com/new) and create a new, **empty** repository. Do not initialize it with a README or .gitignore file. Give it a name like `green-wipe`.

2.  **Initialize Git in Your Project Folder:**
    Open your terminal, navigate to your project's root folder (`green-wipe`), and run the following commands.

    ```bash
    # Initialize a new git repository
    git init -b main

    # Add all your files to be tracked
    git add .

    # Create your first commit
    git commit -m "Initial commit"
    ```

3.  **Link and Push to GitHub:**
    Now, link your local repository to the one you created on GitHub. Replace `<your-github-username>` and `<your-repo-name>` with your actual details.

    ```bash
    # Link to the remote repository on GitHub
    git remote add origin https://github.com/<your-github-username>/<your-repo-name>.git

    # Push your code to GitHub
    git push -u origin main
    ```
    Your code is now on GitHub!

### Step 2: Deploy on Netlify

1.  **Sign up or Log in to Netlify:**
    Go to [Netlify](https://app.netlify.com/) and create an account or log in.

2.  **Import New Site from Git:**
    - From your Netlify dashboard, click "Add new site" > "Import an existing project".
    - Connect to **GitHub** as your provider.
    - Authorize Netlify to access your GitHub account.

3.  **Select Your Repository:**
    - Find and select the GitHub repository you just created (e.g., `green-wipe`).

4.  **Configure Build Settings:**
    - Netlify should automatically detect that this is a Next.js project and pre-fill the build settings. The settings should be:
      - **Build command:** `npm run build`
      - **Publish directory:** `.next`
    - Before deploying, you must add your `GEMINI_API_KEY` as an environment variable in the Netlify UI.
      - Go to "Site configuration" > "Environment variables".
      - Add a new variable with the key `GEMINI_API_KEY` and your key as the value.

5.  **Deploy Site:**
    - Click the "Deploy site" button. Netlify will start building and deploying your application. Once it's done, you'll get a live URL.

From now on, every time you `git push` new changes to your `main` branch on GitHub, Netlify will automatically redeploy your site with the updates.
