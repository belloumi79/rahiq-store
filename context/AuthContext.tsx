import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

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

const getSupabaseClient = (): SupabaseClient | null => {
    try {
        const url = (import.meta as any).env?.VITE_SUPABASE_URL;
        const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
        if (!url || !key) return null;
        return createClient(url, key);
    } catch {
        return null;
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const supabase = getSupabaseClient();
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

        const supabase = getSupabaseClient();
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
            const supabase = getSupabaseClient();
            if (supabase) await supabase.auth.signOut();
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            setIsAdmin(false);
            setUser(null);
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
