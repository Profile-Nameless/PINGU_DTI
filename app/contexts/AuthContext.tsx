'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase'
import type { UserMetadata } from '../utils/supabase'

interface AuthContextType {
  user: User | null
  userMetadata: UserMetadata | null
  loading: boolean
  signUp: (email: string, password: string, metadata: UserMetadata) => Promise<void>
  signIn: (email: string, password: string) => Promise<UserMetadata | undefined>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Cache for user profiles to avoid repeated database calls
const profileCache = new Map<string, { data: UserMetadata | null, timestamp: number }>()
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(false)
  const sessionCheckedRef = useRef(false)

  // Function to fetch user profile data with caching
  const fetchUserProfile = async (userId: string) => {
    try {
      // Check cache first
      const cachedProfile = profileCache.get(userId)
      const now = Date.now()
      
      if (cachedProfile && (now - cachedProfile.timestamp) < CACHE_EXPIRY) {
        console.log('Using cached profile for user:', userId)
        return cachedProfile.data
      }
      
      console.log('Fetching profile for user:', userId)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        return null
      }

      // Create metadata object
      const metadata = profileData ? {
        role: profileData.role,
        full_name: profileData.full_name,
        college: profileData.college
      } : null
      
      // Update cache
      profileCache.set(userId, { data: metadata, timestamp: now })
      
      console.log('Profile data fetched:', profileData)
      return metadata
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      return null
    }
  }

  useEffect(() => {
    mountedRef.current = true
    
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      if (sessionCheckedRef.current) return
      sessionCheckedRef.current = true
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Try to get metadata from session first
          const sessionMetadata = session.user.user_metadata as UserMetadata
          if (sessionMetadata?.role) {
            setUserMetadata(sessionMetadata)
          } else {
            // If no role in session metadata, fetch from profiles table
            const profileData = await fetchUserProfile(session.user.id)
            if (profileData) {
              setUserMetadata(profileData)
            }
          }
        } else {
          setUserMetadata(null)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        if (mountedRef.current) {
          setLoading(false)
        }
      }
    }
    
    initializeAuth()

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mountedRef.current) return
      
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Try to get metadata from session first
        const sessionMetadata = session.user.user_metadata as UserMetadata
        if (sessionMetadata?.role) {
          setUserMetadata(sessionMetadata)
        } else {
          // If no role in session metadata, fetch from profiles table
          const profileData = await fetchUserProfile(session.user.id)
          if (profileData) {
            setUserMetadata(profileData)
          }
        }
      } else {
        setUserMetadata(null)
      }
      
      if (mountedRef.current) {
        setLoading(false)
      }
    })

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, metadata: UserMetadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    if (error) throw error

    // Create profile in profiles table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            full_name: metadata.full_name,
            role: metadata.role,
            college: metadata.college
          }
        ])

      if (profileError) {
        console.error('Error creating profile:', profileError)
        return
      }

      // Update user metadata with profile data
      setUserMetadata(metadata)
      
      // Update cache
      profileCache.set(data.user.id, { 
        data: metadata, 
        timestamp: Date.now() 
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error

      // Fetch user profile data from profiles table
      if (data.user) {
        console.log('User ID:', data.user.id)
        
        const profileData = await fetchUserProfile(data.user.id)
        
        if (!profileData) {
          throw new Error('Failed to fetch user profile')
        }

        // Update user metadata with profile data
        setUserMetadata(profileData)
        return profileData
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setUserMetadata(null)
    
    // Clear cache on sign out
    profileCache.clear()
  }

  return (
    <AuthContext.Provider value={{ user, userMetadata, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 