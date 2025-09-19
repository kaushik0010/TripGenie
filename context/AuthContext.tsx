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
                try {
                    await axios.post('/api/users', {
                        uid: user.uid,
                        email: user.email,
                        name: user.displayName,
                    });
                } catch (error) {
                    console.error("Failed to sync user to MongoDB", error);
                }
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