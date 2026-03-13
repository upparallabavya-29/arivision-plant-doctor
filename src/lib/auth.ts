import { supabase } from "./supabaseClient";
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: "admin" | "user";
    lastLogin: string;
}

// Map Supabase User to our local User interface
export function mapSupabaseUser(user: SupabaseUser | null): User | null {
    if (!user) return null;

    // Extract metadata
    const name = user.user_metadata?.name || user.email?.split('@')[0] || "User";
    const avatar = user.user_metadata?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=random`;
    const role = user.user_metadata?.role || "user";

    return {
        id: user.id,
        email: user.email || "",
        name,
        avatar,
        role,
        lastLogin: user.last_sign_in_at || new Date().toISOString()
    };
}

export async function getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return mapSupabaseUser(session?.user ?? null);
}

export async function loginUser(email: string, password?: string): Promise<User> {
    if (!password) {
        throw new Error("Password is required for Supabase authentication.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error(error.message);
    }

    const user = mapSupabaseUser(data.user);
    if (!user) throw new Error("User mapping failed post-login");
    return user;
}

export async function registerUser(user: Omit<User, "id" | "lastLogin" | "role" | "avatar"> & { password?: string }): Promise<User> {
    if (!user.password) {
        throw new Error("Password is required for Supabase registration.");
    }

    const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
            data: {
                name: user.name,
                role: "user",
            }
        }
    });

    if (error) {
        throw new Error(error.message);
    }

    const newUser = mapSupabaseUser(data.user);
    if (!newUser) throw new Error("User mapping failed post-signup");
    return newUser;
}

export async function logoutUser() {
    await supabase.auth.signOut();
}

// Temporary mock for Admin Dashboard until a profiles table is implemented
export function getAllUsers(): User[] {
    return [];
}
