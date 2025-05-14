import { Authenticated } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useQuery } from 'convex/react';
import { ThemeToggle } from '../../lib/theme';
import { ReactElement } from 'react';
import { SignOutButton } from '../auth/SignOutButton';

type HeaderProps = {
  activeTab: 'stream' | 'photos';
  handleSetActiveTab: (tab: 'stream' | 'photos') => void;
};

export const Header = ({ activeTab, handleSetActiveTab }: HeaderProps): ReactElement => {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  return (
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
                  onClick={() => handleSetActiveTab('stream')}
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
                  onClick={() => handleSetActiveTab('photos')}
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
  );
};
