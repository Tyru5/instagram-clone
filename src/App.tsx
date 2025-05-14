import { Authenticated, Unauthenticated, useQuery } from 'convex/react';
import { useState } from 'react';
import { Toaster } from 'sonner';
import { api } from '../convex/_generated/api';
import { Header } from './components/header/header';
import { HeaderActions } from './components/header/header-actions';
import { AuroraText } from './components/magicui/aurora-text';
import { BlurFade } from './components/magicui/blur-fade';
import { BorderBeam } from './components/magicui/border-beam';
import { SparklesText } from './components/magicui/sparkles-text';
import { ImageStream } from './components/image/ImageStream';
import { ThemeProvider } from './lib/theme';
import { MyPhotos } from './MyPhotos';
import { SignInForm } from './components/auth/SignInForm';
import { UploadBox } from './UploadBox';

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

  const handleSetActiveTab = (tab: 'stream' | 'photos') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} handleSetActiveTab={handleSetActiveTab} />
      <main className="pt-16">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Content activeTab={activeTab} handleSetActiveTab={handleSetActiveTab} />
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
 * @param props.handleSetActiveTab - Function to set the active tab.
 * @returns The main content component.
 */
function Content({
  activeTab,
  handleSetActiveTab,
}: {
  activeTab: 'stream' | 'photos';
  handleSetActiveTab: (tab: 'stream' | 'photos') => void;
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary">
          this shouldn't happen...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Authenticated logic... */}
      <Authenticated>
        <div className="flex flex-col gap-8">
          <div className="flex justify-center gap-6 md:hidden">
            <HeaderActions activeTab={activeTab} handleSetActiveTab={handleSetActiveTab} />
          </div>
          <UploadBox />
          {activeTab === 'stream' ? <ImageStream /> : <MyPhotos />}
        </div>
      </Authenticated>

      {/* Unauthenticated logic... */}
      <Unauthenticated>
        <div className="flex min-h-[20vh] items-center justify-center">
          <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
            <SparklesText>
              <AuroraText>Photo__Stream</AuroraText>🪄
            </SparklesText>
          </h1>
        </div>
        <div className="flex min-h-[30vh] items-center justify-center">
          <div className="relative mx-auto flex max-w-md flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-xl dark:bg-gray-800/50 dark:shadow-2xl dark:shadow-purple-900/10">
            <p className="mb-8 text-center text-muted-foreground">
              Sign in to start sharing your moments
            </p>
            <SignInForm />
            <BorderBeam
              duration={6}
              size={400}
              className="from-transparent via-red-500 to-transparent"
            />
            <BorderBeam
              duration={6}
              delay={3}
              size={400}
              className="from-transparent via-blue-500 to-transparent"
            />
          </div>
        </div>
        <footer className="mt-12 flex flex-col items-center justify-center text-center">
          <BlurFade delay={1} inView>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              <AuroraText>Because everyone wants another instagram clone, right?</AuroraText>
            </h2>
          </BlurFade>
          <BlurFade delay={2} inView>
            <h3 className="mt-8 text-2xl font-bold tracking-tighter sm:text-3xl xl:text-4xl/none">
              <AuroraText>Said no one ever.</AuroraText>
            </h3>
          </BlurFade>
        </footer>
      </Unauthenticated>
    </div>
  );
}
