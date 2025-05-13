import { Authenticated, Unauthenticated, useQuery } from 'convex/react';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { api } from '../convex/_generated/api';
import { ImageStream } from './ImageStream';
import { MyPhotos } from './MyPhotos';
import { SignInForm } from './SignInForm';
import { SignOutButton } from './SignOutButton';
import { UploadBox } from './UploadBox';

export default function App() {
  const [activeTab, setActiveTab] = useState<'stream' | 'photos'>('stream');
  const loggedInUser = useQuery(api.auth.loggedInUser);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                Instagram Clone
              </h1>
              <Authenticated>
                <nav className="hidden md:flex items-center gap-6">
                  <button
                    onClick={() => setActiveTab('stream')}
                    className={`flex items-center gap-2 transition-colors ${
                      activeTab === 'stream'
                        ? 'text-purple-600'
                        : 'text-gray-600 hover:text-purple-600'
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
                        ? 'text-purple-600'
                        : 'text-gray-600 hover:text-purple-600'
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
            <Authenticated>
              <div className="flex items-center gap-4">
                {loggedInUser && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
                      {loggedInUser.email?.[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-600 hidden md:inline">
                      {loggedInUser.email}
                    </span>
                  </div>
                )}
                <SignOutButton />
              </div>
            </Authenticated>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <div className="max-w-5xl mx-auto px-4 py-8">
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Authenticated>
        <div className="flex flex-col gap-8">
          <div className="md:hidden flex justify-center gap-6">
            <button
              onClick={() => setActiveTab('stream')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                activeTab === 'stream'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                activeTab === 'photos'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
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
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome to Instagram Clone</h2>
          <p className="text-gray-600 text-center mb-8">Sign in to start sharing your moments</p>
          <SignInForm />
        </div>
      </Unauthenticated>
    </div>
  );
}
