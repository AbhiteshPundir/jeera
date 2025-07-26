"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthContextType } from "../types/index"
import api from "../services/api"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...")
        const response = await api.get("/users/profile")
        setUser(response.data)
      } catch (error) {
        console.log("Auth check failed:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log("Attempting login...")
      const res = await api.post('/users/login', { email, password });
      console.log("Login successful:", res.data)
      setUser(res.data);
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      console.log("Attempting registration...")
      const res = await api.post("/users/register", { name, email, password })
      console.log("Registration successful:", res.data)
      setUser(res.data)
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      console.log("Attempting logout...")
      await api.post("/users/logout")
      console.log("Logout successful")
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
      // Even if logout fails, clear the user state
      setUser(null)
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
