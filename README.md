# ResumeAI — AI Resume Builder & Analyzer SaaS

ResumeAI is a premium, full-featured SaaS platform designed to help candidates build professional resumes and optimize them for modern Applicant Tracking Systems (ATS) using advanced AI feedback.

## 🚀 Key Features

### 1. 📊 Interactive Dashboard
- **Analytics at a Glance:** Track total analyses, average ATS scores, and optimized versions generated.
- **Recent Activity:** Quick view and delete controls for your recent resume analyses.
- **Global Navigation:** Smooth drawer navigation sidebar on mobile, collapsible sticky sidebar on desktop.

### 2. 📝 AI-Powered Resume Builder
- **Multi-Step Wizard:** Step-by-step guidance covering:
  1. *Personal Details:* Contact details, professional summary, and links.
  2. *Work Experience:* Interactive list for adding/editing multiple job experiences.
  3. *Education:* Section for adding academic credentials and degrees.
  4. *Skills:* Tag-input system for technical and soft skills.
- **Live Preview:** Visual desktop/mobile view of your resume formatted in a clean, professional style.
- **Export to PDF:** Click-to-download PDF generated locally with **jsPDF**, using custom grid alignment, page numbers, and typographic scaling.

### 3. 🔍 ATS Resume Analyzer
- **Job Description Matcher:** Paste your resume and a target job description to get tailored compatibility feedback.
- **ATS Score Gauge:** High-quality circular visual gauge representing your overall matching percentage.
- **Insights Dashboard:**
  - *Missing Keywords:* Essential terms to inject into your resume to pass automated screens.
  - *Strengths & Weaknesses:* Detailed breakdowns of what your resume does well and where it lacks details.
- **Side-by-Side Comparison:** Compare original sentences alongside AI-suggested rewrites for maximum optimization.

### 4. 🔒 Authentication & Security
- **Firebase Auth Integration:** Secure authentication supporting:
  - Email/Password Signup & Login with client-side validation.
  - Google Sign-In.
- **Dynamic Fallback (Mock Mode):** If Firebase keys are not provided in environment variables, the system gracefully runs in a secure Mock developer mode so testing can be done without setting up infrastructure.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router & React Server Components)
- **Library:** React 18 & TypeScript
- **Styling:** Tailwind CSS (Custom glassmorphism & dark gradients)
- **Forms & Validation:** React Hook Form + Zod Schema Validation
- **Database / Auth:** Firebase Authentication
- **Export Engine:** [jsPDF](https://github.com/parallax/jsPDF)
- **Charts:** [Recharts](https://recharts.org/) (Responsive circular gauges)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** Lucide React

---

## ⚙️ Getting Started & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ahmed000248/Ai-Resume-Builder.git
cd Ai-Resume-Builder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory. You can copy the template from `.env.local.example`:
```bash
cp .env.local.example .env.local
```

Fill in your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```
> **Note:** If these are left blank, ResumeAI runs in a local **Mock Mode** using localStorage to mock authentication, allowing you to test out all dashboards instantly.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```text
├── app/                  # Next.js App Router (Layouts & Pages)
│   ├── dashboard/        # Dashboard layout, builder, analyzer, and history views
│   ├── login/            # Sign In view
│   ├── signup/           # Sign Up view
│   └── globals.css       # Custom global glassmorphism & scrollbar styles
├── components/           # Reusable UI & Layout Components
│   ├── analysis/         # Score gauges, keyword badges, and side-by-side rewrites
│   ├── auth/             # Login/Signup Form handling
│   ├── dashboard/        # Stats cards and recent activity tables
│   ├── layout/           # Sticky sidebar and navigation menus
│   ├── resume/           # Step progression, resume forms, and interactive PDF preview
│   └── ui/               # Modular elements (Buttons, Inputs, Cards, Skeletons)
├── context/              # React Context Providers (AuthContext)
├── hooks/                # Custom hooks (e.g., useProtectedRoute)
├── lib/                  # Helper utilities, API clients, PDF builders, and Firebase setups
│   ├── api/              # Simulated API endpoints (analyze, generate, history)
│   ├── firebase/         # Firebase SDK configuration and wrapper functions
│   ├── pdf/              # jsPDF custom document builder template
│   └── utils.ts          # Styling and date formatting helpers
└── types/                # TypeScript interfaces and type definitions
```
