import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children, setError }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session - Use Promise chain
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)
        }
        setLoading(false)
      })

    // Listen for auth changes - NEVER ASYNC callback
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)  // Fire-and-forget, NO AWAIT
        } else {
          setUser(null)
          setUserProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserProfile = (userId) => {
    supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()?.then(({ data, error }) => {
        if (error) {
          console.log('Error fetching user profile:', error?.message)
          return
        }
        setUserProfile(data)
      })
  }

  const signUp = async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name || '',
            role: userData?.role || 'user'
          }
        }
      })
      
      if (error) {
        setError?.(error?.message)
        return { error: error?.message };
      }
      
      return { data }
    } catch (error) {
      const errorMessage = 'Failed to create account. Please try again.'
      setError?.(errorMessage)
      return { error: errorMessage }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setError?.(error?.message)
        return { error: error?.message };
      }
      
      return { data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        const errorMessage = 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
        setError?.(errorMessage)
        return { error: errorMessage }
      }
      
      const errorMessage = 'Failed to sign in. Please try again.'
      setError?.(errorMessage)
      return { error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase?.auth?.signOut()
      if (error) {
        setError?.(error?.message)
        return { error: error?.message };
      }
      
      setUser(null)
      setUserProfile(null)
      return { data: 'Signed out successfully' }
    } catch (error) {
      const errorMessage = 'Failed to sign out. Please try again.'
      setError?.(errorMessage)
      return { error: errorMessage }
    }
  }

  const signInWithOAuth = async (provider) => {
    try {
      const { data, error } = await supabase?.auth?.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/events`
        }
      })
      
      if (error) {
        setError?.(error?.message)
        return { error: error?.message };
      }
      
      return { data }
    } catch (error) {
      const errorMessage = `Failed to sign in with ${provider}. Please try again.`
      setError?.(errorMessage)
      return { error: errorMessage }
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) {
        throw new Error('No user logged in')
      }

      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single()

      if (error) {
        setError?.(error?.message)
        return { error: error?.message };
      }

      setUserProfile(data)
      return { data }
    } catch (error) {
      const errorMessage = 'Failed to update profile. Please try again.'
      setError?.(errorMessage)
      return { error: errorMessage }
    }
  }

  const uploadProfileImage = async (file) => {
    try {
      if (!user) {
        throw new Error('No user logged in')
      }

      const fileExt = file?.name?.split('.')?.pop()
      const fileName = `${user?.id}/profile.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase?.storage?.from('user-profiles')?.upload(fileName, file, { upsert: true })

      if (uploadError) {
        setError?.(uploadError?.message)
        return { error: uploadError?.message };
      }

      const { data: urlData } = supabase?.storage?.from('user-profiles')?.getPublicUrl(fileName)

      // Update profile with new image URL
      const { data: profileData, error: profileError } = await supabase?.from('user_profiles')?.update({ profile_image_url: urlData?.publicUrl })?.eq('id', user?.id)?.select()?.single()

      if (profileError) {
        setError?.(profileError?.message)
        return { error: profileError?.message };
      }

      setUserProfile(profileData)
      return { data: urlData?.publicUrl };
    } catch (error) {
      const errorMessage = 'Failed to upload profile image. Please try again.'
      setError?.(errorMessage)
      return { error: errorMessage }
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithOAuth,
    updateProfile,
    uploadProfileImage
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}