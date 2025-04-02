'use client'

import { createContext, useContext, useEffect, useState } from 'react'
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
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

      console.log('Profile data fetched:', profileData)
      return profileData
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      return null
    }
  }

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(async ({ data: { session } }) => {
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
            const metadata = {
              role: profileData.role,
              full_name: profileData.full_name,
              college: profileData.college
            }
            setUserMetadata(metadata)
          }
        }
      } else {
        setUserMetadata(null)
      }
      
      setLoading(false)
    })

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
            const metadata = {
              role: profileData.role,
              full_name: profileData.full_name,
              college: profileData.college
            }
            setUserMetadata(metadata)
          }
        }
      } else {
        setUserMetadata(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
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
        const metadata = {
          role: profileData.role,
          full_name: profileData.full_name,
          college: profileData.college
        }
        setUserMetadata(metadata)
        return metadata
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