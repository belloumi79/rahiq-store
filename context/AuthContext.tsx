import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

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
const ADMIN_EMAIL = 'admin@rahiqstore.com';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) mapUser(session.user);
                else { setUser(null); setIsAdmin(false); }
            } catch (error) {
                console.error("Auth check error", error);
                setUser(null); setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) mapUser(session.user);
            else { setUser(null); setIsAdmin(false); }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const mapUser = (sbUser: User) => {
        const email = sbUser.email || '';
        const displayName = sbUser.user_metadata?.full_name || email.split('@')[0] || 'Invité';
        setUser({ id: sbUser.id, email, name: displayName, $createdAt: sbUser.created_at });
        setIsAdmin(email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    };

    const logout = async () => {
        try { await supabase.auth.signOut(); } catch (error) { console.error("Logout error", error); }
        finally { setIsAdmin(false); setUser(null); }
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