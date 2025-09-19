'use client';

import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';

export default function AuthButton() {
  const { user, loading } = useAuth();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error)
    {
      console.error("Error signing out", error);
    }
  };

  if (loading) {
    return <div className="h-10 w-24 bg-slate-700 rounded-md animate-pulse" />;
  }
  
  return user ? (
    <div className="flex items-center gap-4">
      <p className="text-sm text-slate-300">Welcome, {user.displayName?.split(' ')[0]}</p>
      <Button onClick={handleSignOut} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer">
        Sign Out
      </Button>
    </div>
  ) : (
    <Button onClick={handleSignIn} className='cursor-pointer'>
      Sign in with Google
    </Button>
  );
}