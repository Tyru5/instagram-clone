import { useAuthActions } from '@convex-dev/auth/react';
import { useConvexAuth } from 'convex/react';

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      onClick={() => void signOut()}
    >
      Sign out
    </button>
  );
}
