
# Green Wipe: Secure & Eco-Friendly Data Erasure

**Green Wipe** is a modern web application that provides verifiable, government-grade data sanitization to promote the safe reuse of electronics. By making data erasure secure and trustworthy, Green Wipe encourages a circular economy, reduces e-waste, and helps protect our planet.

This project was built with Next.js, Genkit, and Google's Gemini AI.

![Green Wipe Dashboard](https://storage.googleapis.com/firebase-studio-storage/project-builds/studio-projects/gmp-dev-416908/1716301323381/image.png)

## How It Works

1.  **Select & Wipe:** A user selects a file, drive, or device to be erased. An AI assistant, powered by Google's Gemini model, analyzes the target and suggests the optimal wiping procedure according to NIST SP 800-88 standards.
2.  **Track Your Impact:** As the wipe proceeds, the **"Green Score"** dashboard provides real-time updates on the positive environmental impact, quantifying metrics like e-waste diverted, CO₂ saved, and energy conserved.
3.  **Verify & Trust:** Upon successful erasure, a **Certificate of Data Erasure** is generated. This certificate is anchored to a (simulated) blockchain, creating a permanent, tamper-proof audit trail for compliance and peace of mind.

## Key Features

- **AI-Powered Wipe Suggestions:** Utilizes Genkit and Gemini to recommend the best data sanitization method (e.g., NIST Purge, DoD 5220.22-M).
- **Blockchain-Anchored Certificates:** Generates immutable, verifiable proof of data destruction.
- **Environmental Impact Dashboard:** Tracks and visualizes the positive environmental effects of reusing electronics.
- **Multi-Lingual Support:** The user interface can be translated into multiple languages in real-time using AI.
- **Support for Multiple Wipe Targets:** Securely erase individual files, entire hard drives, or remote devices.
- **Advanced Wipe Methods:** Includes support for industry-standard algorithms like the Gutmann method.
- **Modern, Responsive UI:** Built with Tailwind CSS and ShadCN UI for a clean and professional user experience on any device.

## Tech Stack

- **Frontend:**
  - **Next.js:** React framework for server-side rendering and API routes.
  - **React & TypeScript:** For building a type-safe, component-based UI.
  - **Tailwind CSS & ShadCN UI:** For modern styling and a comprehensive component library.
  - **Recharts:** For creating interactive and responsive charts.
  - **jsPDF:** For client-side PDF generation of certificates.
- **Backend & AI:**
  - **Next.js Server Actions:** For handling server-side logic and mutations.
  - **Genkit (by Google):** An open-source framework for building production-ready AI applications.
  - **Google AI (Gemini):** The underlying Large Language Model powering all AI features.

## Running Locally

To run this project on your local machine, follow these steps:

### Prerequisites

- **Node.js**: Version 18 or later.
- **VS Code** or your preferred code editor.

### Setup Instructions

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/green-wipe.git
    cd green-wipe
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**:
    -   Create a file named `.env` in the project root.
    -   Add your Gemini API key, which you can get from [Google AI Studio](https://aistudio.google.com/app/apikey).
        ```
        GEMINI_API_KEY=YOUR_API_KEY_HERE
        ```

4.  **Run the Servers**:
    -   This project requires two separate terminal sessions.
    -   **Terminal 1: Run the Next.js Web App**:
        ```bash
        npm run dev
        ```
        The application will be available at [http://localhost:9002](http://localhost:9002).

    -   **Terminal 2: Run the Genkit AI Flows**:
        ```bash
        npm run genkit:dev
        ```
        This command is essential for the AI features to work. The Genkit development UI will be available at [http://localhost:4000](http://localhost:4000).

Now you have both the web server and the AI server running. Open your browser to [http://localhost:9002](http://localhost:9002) to see Green Wipe live!
