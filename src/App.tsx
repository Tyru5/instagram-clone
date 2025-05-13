import { Authenticated, Unauthenticated, useQuery } from 'convex/react';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { api } from '../convex/_generated/api';
import { ImageStream } from './ImageStream';
import { MyPhotos } from './MyPhotos';
import { SignInForm } from './SignInForm';
import { SignOutButton } from './SignOutButton';
import { UploadBox } from './UploadBox';
import { ThemeProvider, ThemeToggle } from './lib/theme';

/**
 * The main application component.
 * Wraps the application content with the ThemeProvider.
 */
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

/**
 * Renders the main application content, including the header and main area.
 * Manages the active tab state between 'stream' and 'photos'.
 * Displays navigation and user information in the header when authenticated.
 */
function AppContent() {
  const [activeTab, setActiveTab] = useState<'stream' | 'photos'>('stream');
  const loggedInUser = useQuery(api.auth.loggedInUser);

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <a
                href="https://tiru5.dev"
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-2xl font-bold text-transparent transition-transform hover:scale-105"
              >
                tiru5.dev
              </a>
              <Authenticated>
                <nav className="hidden items-center gap-6 md:flex">
                  <button
                    onClick={() => setActiveTab('stream')}
                    className={`flex items-center gap-2 transition-colors ${
                      activeTab === 'stream'
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span className="font-medium">Home</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('photos')}
                    className={`flex items-center gap-2 transition-colors ${
                      activeTab === 'photos'
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">My Photos</span>
                  </button>
                </nav>
              </Authenticated>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Authenticated>
                {loggedInUser && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-medium text-white">
                      {loggedInUser.email?.[0].toUpperCase()}
                    </div>
                    <span className="hidden text-sm text-muted-foreground md:inline">
                      {loggedInUser.email}
                    </span>
                  </div>
                )}
                <SignOutButton />
              </Authenticated>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Content activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

/**
 * Renders the main content of the application based on the authentication state and active tab.
 * Shows a loading spinner while fetching user data.
 * Displays either the authenticated view (with tabs for Stream/My Photos and upload)
 * or the unauthenticated view (with the sign-in form).
 *
 * @param props - The component props.
 * @param props.activeTab - The currently active tab ('stream' or 'photos').
 * @param props.setActiveTab - Function to set the active tab.
 * @returns The main content component.
 */
function Content({
  activeTab,
  setActiveTab,
}: {
  activeTab: 'stream' | 'photos';
  setActiveTab: (tab: 'stream' | 'photos') => void;
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Authenticated>
        <div className="flex flex-col gap-8">
          <div className="flex justify-center gap-6 md:hidden">
            <button
              onClick={() => setActiveTab('stream')}
              className={`rounded-full px-6 py-2.5 font-medium transition-all ${
                activeTab === 'stream'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/20'
                  : 'bg-background text-muted-foreground hover:bg-accent'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`rounded-full px-6 py-2.5 font-medium transition-all ${
                activeTab === 'photos'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/20'
                  : 'bg-background text-muted-foreground hover:bg-accent'
              }`}
            >
              My Photos
            </button>
          </div>
          <UploadBox />
          {activeTab === 'stream' ? <ImageStream /> : <MyPhotos />}
        </div>
      </Authenticated>
      <Unauthenticated>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800/50 dark:shadow-2xl dark:shadow-purple-900/10">
            {/* <h2 className="text-2xl font-bold text-center mb-6 text-foreground">Photo__Stream</h2> */}
            <h2 className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-2xl font-bold text-transparent">
              Photo__Stream🪄
            </h2>
            <p className="mb-8 text-center text-muted-foreground">
              Sign in to start sharing your moments
            </p>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
