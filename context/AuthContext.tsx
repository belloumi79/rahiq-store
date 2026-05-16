import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import supabase from '../lib/supabase';

export interface AuthUser {
    id: string;
    email?: string;
    name: string;
    $createdAt: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isAdmin: boolean;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ADMIN_EMAIL = 'houdaboughalleb591@gmail.com';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                if (!supabase) { setLoading(false); return; }
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const u = session.user;
                    const email = u.email || '';
                    const displayName = u.user_metadata?.full_name || email.split('@')[0] || 'Invité';
                    setUser({ id: u.id, email, name: displayName, $createdAt: u.created_at });
                    setIsAdmin(email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
                } else {
                    setUser(null);
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error("Auth check error", error);
                setUser(null);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkUser();

        if (!supabase) return;
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const u = session.user;
                const email = u.email || '';
                const displayName = u.user_metadata?.full_name || email.split('@')[0] || 'Invité';
                setUser({ id: u.id, email, name: displayName, $createdAt: u.created_at });
                setIsAdmin(email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        try {
            if (supabase) await supabase.auth.signOut();
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            setIsAdmin(false);
            setUser(null);
            localStorage.removeItem('rahiq-cart'); // Correct key
            window.dispatchEvent(new Event('cart_updated')); // Custom event
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) { throw new Error('useAuth must be used within an AuthProvider'); }
    return context;
};
