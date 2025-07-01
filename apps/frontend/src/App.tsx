import { ClerkProvider, SignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TestId } from './types/test-ids'
import { CustomSignUp } from './components/CustomSignUp'
import './i18n/config'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

// Layout component for the main application
function MainLayout() {
  const { t } = useTranslation()
  
  return (
    <main className="container-custom min-h-screen py-16" data-testid={TestId.ContainerMain}>
      <div className="text-center" data-testid={TestId.ContainerWelcome}>
        <h1 className="text-5xl font-bold text-indigo-600 mb-4" data-testid={TestId.TextAppTitle}>
          🎉 {t('common.appName')}
        </h1>
        <p className="text-xl text-slate-600 mb-8" data-testid={TestId.TextAppTagline}>
          {t('common.tagline')}
        </p>
        
        <SignedOut>
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6" data-testid={TestId.ContainerAuthButtons}>
            <div className="space-y-4">
              <a 
                href="/sign-in"
                className="btn-primary block w-full text-center"
                data-testid={TestId.ButtonSignIn}
              >
                {t('auth.signIn')}
              </a>
              <a 
                href="/sign-up"
                className="btn-primary block w-full text-center bg-green-500 hover:bg-green-600"
                data-testid={TestId.ButtonSignUp}
              >
                {t('auth.createAccount')}
              </a>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="max-w-md mx-auto" data-testid={TestId.ContainerDashboard}>
            <button 
              className="btn-primary"
              data-testid={TestId.ButtonManageParties}
            >
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4" data-testid={TestId.ContainerAuth}>
      <div className="w-full max-w-md" data-testid={TestId.ContainerAuthForm}>
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
      navigate={(to) => {
        console.log('Navigating to:', to);
        const url = new URL(to, window.location.origin);
        window.location.href = url.toString();
      }}
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
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
          <Route path="/" element={
            <SignedIn>
              <MainLayout />
            </SignedIn>
          } />
          
          <Route 
            path="/sign-in/*" 
            element={
              <AuthPage>
                <SignIn 
                  routing="path"
                  path="/sign-in"
                  signUpUrl="/sign-up"
                  afterSignInUrl="/"
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500'
                    }
                  }}
                />
              </AuthPage>
            } 
          />
          
          <Route 
            path="/sign-up/*" 
            element={
              <AuthPage>
                <CustomSignUp />
              </AuthPage>
            } 
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <SignedIn>
                <div data-testid="page-dashboard">Dashboard (Coming Soon)</div>
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