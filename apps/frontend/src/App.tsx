import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './i18n/config'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

// Layout component for the main application
function MainLayout() {
  const { t } = useTranslation()
  
  return (
    <main className="container-custom min-h-screen py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-indigo-600 mb-4">
          🎉 {t('common.appName')}
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          {t('common.tagline')}
        </p>
        
        <SignedOut>
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
            <div className="space-y-4">
              <a 
                href="/sign-in"
                className="btn-primary block w-full text-center"
              >
                {t('auth.signIn')}
              </a>
              <a 
                href="/sign-up"
                className="btn-primary block w-full text-center bg-green-500 hover:bg-green-600"
              >
                {t('auth.createAccount')}
              </a>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="max-w-md mx-auto">
            <button className="btn-primary">
              {t('dashboard.manageParties')}
            </button>
          </div>
        </SignedIn>
      </div>
    </main>
  )
}

// Auth components with consistent styling
function AuthPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}

export function App() {
  const { t } = useTranslation()
  
  return (
    <ClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
      localization={{
        socialButtonsBlockButton: "{{provider}}",
        formButtonPrimary: t('auth.continue'),
        signIn: {
          start: {
            title: t('auth.signIn'),
            subtitle: t('auth.toContinueTo', { app: 'PartyPilot' }),
            actionText: t('auth.noAccount'),
            actionLink: t('auth.createAccount')
          }
        },
        signUp: {
          start: {
            title: t('auth.createAccount'),
            subtitle: t('auth.toContinueTo', { app: 'PartyPilot' }),
            actionText: t('auth.haveAccount'),
            actionLink: t('auth.signIn')
          }
        }
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />} />
          
          <Route 
            path="/sign-in/*" 
            element={
              <AuthPage>
                <SignIn 
                  routing="path"
                  path="/sign-in"
                  signUpUrl="/sign-up"
                  afterSignInUrl="/"
                />
              </AuthPage>
            } 
          />
          
          <Route 
            path="/sign-up/*" 
            element={
              <AuthPage>
                <SignUp 
                  routing="path"
                  path="/sign-up"
                  signInUrl="/sign-in"
                  afterSignUpUrl="/"
                />
              </AuthPage>
            } 
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <SignedIn>
                <div>Dashboard (Coming Soon)</div>
              </SignedIn>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  )
} 