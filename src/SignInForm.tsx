import { useAuthActions } from '@convex-dev/auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<'signIn' | 'signUp'>('signIn');
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set('flow', flow);
          void signIn('password', formData).catch((_error) => {
            const toastTitle =
              flow === 'signIn'
                ? 'Could not sign in, did you mean to sign up?'
                : 'Could not sign up, did you mean to sign in?';
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <input className="input-field" type="email" name="email" placeholder="Email" required />
        <input
          className="input-field"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button className="auth-button" type="submit" disabled={submitting}>
          {flow === 'signIn' ? 'Sign in' : 'Sign up'}
        </button>
        <div className="text-center text-sm text-slate-600 dark:text-slate-400">
          <span>{flow === 'signIn' ? "Don't have an account? " : 'Already have an account? '}</span>
          <button
            type="button"
            className="cursor-pointer text-blue-500 dark:text-blue-400"
            onClick={() => setFlow(flow === 'signIn' ? 'signUp' : 'signIn')}
          >
            {flow === 'signIn' ? 'Sign up instead' : 'Sign in instead'}
          </button>
        </div>
      </form>
    </div>
  );
}
