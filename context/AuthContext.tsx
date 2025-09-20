'use client';

import { auth } from "@/lib/firebase";
import axios from "axios";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            setLoading(false);

            if (user) {
                const hasSynced = sessionStorage.getItem('user_synced');

                if(!hasSynced) {
                    try {
                        await axios.post('/api/users', {
                            uid: user.uid,
                            email: user.email,
                            name: user.displayName,
                        });
                        sessionStorage.setItem('user_synced', 'true');
                    } catch (error) {
                        console.error("Failed to sync user to MongoDB", error);
                    }
                }
            } else {
                sessionStorage.removeItem('user_synced');
            }
        });

        return () => unsubscribe();
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children};
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);