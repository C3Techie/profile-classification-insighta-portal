# Insighta Labs+ Web Portal

The internal web dashboard for the Insighta Labs+ Profile Intelligence Platform.

## 🏗 System Architecture
Built with **Next.js 14 (App Router)** and Tailwind CSS. The portal serves as a secure, browser-based interface for analysts to manage identity intelligence. It shares the same Backend API as the Insighta CLI.

## 🔐 Authentication Flow
1.  **Authorization**: User is redirected to the Backend's GitHub OAuth initiation endpoint.
2.  **Callback**: Upon successful GitHub auth, the Backend sets **HTTP-only, SameSite:Strict cookies** on the user's browser.
3.  **Session**: The portal's middleware (`middleware.ts`) verifies the presence of these cookies before allowing access to internal routes.

## 🛡 Security & Role Enforcement
- **CSRF Protection**: Enforced via `SameSite: Strict` cookie policy and signed OAuth states.
- **HTTP-only Tokens**: Tokens are inaccessible to client-side JavaScript, preventing XSS-based token theft.
- **RBAC**: User roles (`admin` or `analyst`) are returned in the `/auth/me` call and enforced on the UI (e.g., hiding Delete buttons for analysts).

## 🚀 Getting Started

### 1. Environment Configuration
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### 2. Installation & Run
```bash
npm install
npm run dev
```

## 🛠 Pages
- **Login**: GitHub OAuth entry point.
- **Dashboard**: Real-time metrics and system trends.
- **Profiles List**: Paginated index with advanced filtering.
- **Profile Detail**: Deep-dive into specific identity attributes.
- **Natural Search**: NLP-powered query interface.
- **Account**: User profile and session management.
