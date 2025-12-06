"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User } from "@/types";

/**
 * Simple type-guard for runtime validation of an unknown value as User.
 * Adjust checks to match the minimal shape you require (id/email etc).
 */
function isValidUser(value: unknown): value is User {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  // ensure it has at least an id or email string (adapt if needed)
  return typeof v.id === "string" || typeof v.email === "string";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  // Initialize user from localStorage or initialUser
  const getInitialUser = (): User | null => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser) as unknown;
          if (isValidUser(parsed)) return parsed;
          return null;
        } catch {
          return null;
        }
      }
    }
    return initialUser ?? null;
  };

  const [user, setUserState] = useState<User | null>(getInitialUser);
  const [isLoading, setIsLoading] = useState(true);

  // Sync localStorage with initialUser on mount if needed
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (!storedUser && initialUser) {
        localStorage.setItem("user", JSON.stringify(initialUser));
        setUserState(initialUser);
      } else if (storedUser && !initialUser) {
        // If we have localStorage but no initialUser, leave it as is (user persisted)
        // If you want to clear on mount if initialUser absent, uncomment:
        // localStorage.removeItem("user");
        // setUserState(null);
      }
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (userData: User) => {
    // Update local state and storage immediately for snappy UI
    setUserState(userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
    }

    // Sync with server session
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userData }),
      });

      if (!res.ok) {
        // revert if server failed
        setUserState(null);
        if (typeof window !== "undefined") localStorage.removeItem("user");
        throw new Error("Failed to login on server");
      }
    } catch (err) {
      console.error("Failed to sync user with server:", err);
      // already reverted above
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    // Optimistic local clear
    setUserState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }

    // Clear server session (best-effort)
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Failed to logout from server:", err);
    }
  }, []);

  const updateUser = useCallback(
    async (userData: Partial<User>) => {
      if (!user) {
        throw new Error("Cannot update user: not logged in");
      }

      // Update local state using functional update to avoid stale closures
      setUserState((prevUser) => {
        if (!prevUser) return null;
        const updatedUser = { ...prevUser, ...userData };
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        return updatedUser;
      });

      // Send only the partial update to server (server expects Partial<User>)
      try {
        await fetch("/api/auth/user", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });
      } catch (err) {
        console.error("Failed to sync user update with server:", err);
        // We keep the local optimistic update; you may decide to revert on failure.
      }
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
