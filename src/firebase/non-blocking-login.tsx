
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';

// Define a type for the toast function
type ToastFunction = (options: {
  variant?: 'default' | 'destructive';
  title: string;
  description: string;
}) => void;


/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance);
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, toast: ToastFunction): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then((userCredential) => {
        // Send email verification
        if (userCredential.user) {
            sendEmailVerification(userCredential.user);
        }
        // We can add a toast to inform the user
        toast({
            title: "Check your inbox",
            description: "A verification email has been sent to your email address.",
        });
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        toast({
          variant: 'destructive',
          title: 'Account Exists',
          description: 'An account with this email already exists. Please log in instead.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Sign-up Failed',
          description: error.message,
        });
      }
    });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string, toast: ToastFunction): void {
  signInWithEmailAndPassword(authInstance, email, password)
    .catch((error) => {
        let title = 'Login Failed';
        let description = 'An unknown error occurred. Please try again.';

        switch (error.code) {
            case 'auth/user-not-found':
                title = 'User Not Found';
                description = 'No account exists with this email address. Please sign up first.';
                break;
            case 'auth/wrong-password':
                title = 'Incorrect Password';
                description = 'The password you entered is incorrect. Please try again.';
                break;
            case 'auth/invalid-credential':
                title = 'Invalid Credentials';
                description = 'The email or password you entered is incorrect.';
                break;
             case 'auth/invalid-email':
                title = 'Invalid Email';
                description = 'The email address is not valid. Please check and try again.';
                break;
            default:
                description = error.message;
                break;
        }

        toast({
            variant: 'destructive',
            title: title,
            description: description,
        });
    });
}
