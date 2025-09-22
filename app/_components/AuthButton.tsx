'use client';

import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDownIcon, UserIcon } from '@heroicons/react/24/outline';

export default function AuthButton() {
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden sm:block h-8 w-20 bg-slate-700/50 rounded-md animate-pulse" />
        <div className="h-8 w-24 bg-slate-700/50 rounded-md animate-pulse" />
      </div>
    );
  }
  
  return user ? (
    <div className="flex items-center gap-2 sm:gap-4 relative">
      {/* Desktop View */}
      <Link 
        href="/my-trips" 
        className="hidden sm:block text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-slate-800/50"
      >
        My Trips
      </Link>
      
      <div className="hidden sm:flex items-center gap-4">
        <p className="text-sm text-slate-400 max-w-[170px] truncate" title={user.displayName || ''}>
          Welcome, {user.displayName?.split(' ')[0]}
        </p>
        <Button 
          onClick={handleSignOut} 
          variant="outline" 
          className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400 transition-all duration-200 cursor-pointer px-4"
        >
          Sign Out
        </Button>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden relative">
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-1 p-2 text-slate-300 hover:bg-slate-800/50 cursor-pointer"
        >
          <UserIcon className="h-5 w-5" />
          <ChevronDownIcon className={`h-4 w-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </Button>
        
        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-50">
            <div className="p-3 border-b border-slate-700">
              <p className="text-sm text-slate-300 truncate">Welcome, {user.displayName?.split(' ')[0]}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            
            <Link 
              href="/my-trips" 
              className="block px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              My Trips
            </Link>
            
            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-slate-700 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  ) : (
    <Button 
      onClick={handleSignIn} 
      className="cursor-pointer bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 transition-all duration-200 shadow-lg shadow-cyan-500/20 text-sm sm:text-base"
    >
      Sign in with Google
    </Button>
  );
}