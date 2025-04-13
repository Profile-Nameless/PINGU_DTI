"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { toast } from "sonner"
import type { UserMetadata } from "../utils/supabase"
import { Checkbox } from "../components/ui/checkbox"

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional()
})

const signupSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["user", "organizer"]),
  college: z.string().min(2, "College name must be at least 2 characters")
})

type LoginFormValues = z.infer<typeof loginSchema>
type SignupFormValues = z.infer<typeof signupSchema>

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signUp, userMetadata } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  // Initialize forms
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  })

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "user",
      college: ""
    }
  })

  // Reset form when switching between login and signup
  useEffect(() => {
    if (isLogin) {
      loginForm.reset()
    } else {
      signupForm.reset()
    }
  }, [isLogin, loginForm, signupForm])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true)
      const metadata = await signIn(data.email, data.password)
      toast.success("Successfully logged in!")
      
      if (metadata?.role === "organizer") {
        router.push("/organizer")
      } else if (metadata?.role === "user") {
        router.push("/dashboard")
      } else {
        toast.error("Invalid user role")
      }
    } catch (error) {
      toast.error("Failed to log in. Please check your credentials.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSignupSubmit = async (data: SignupFormValues) => {
    try {
      setIsLoading(true)
      const metadata: UserMetadata = {
        role: data.role,
        full_name: data.name,
        college: data.college
      }
      await signUp(data.email, data.password, metadata)
      toast.success("Successfully signed up! Please check your email for verification.")
      
      // Wait for user metadata to be loaded
      const checkRole = () => {
        if (userMetadata?.role === "organizer") {
          router.push("/organizer")
        } else if (userMetadata?.role === "user") {
          router.push("/dashboard")
        } else {
          // If metadata is not loaded yet, try again in 500ms
          setTimeout(checkRole, 500)
        }
      }
      checkRole()
    } catch (error) {
      toast.error("Failed to sign up. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent)]" />
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={isMounted ? { opacity: 0, y: 20 } : false}
        animate={isMounted ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link href="/" className="block text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              PingU
            </span>
          </h1>
        </Link>

        {/* Auth Card */}
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 rounded-2xl p-8 shadow-lg border border-gray-200/50">
          {/* Tab Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-2 text-lg font-medium transition-colors relative
                ${isLogin ? "text-orange-500" : "text-gray-600 hover:text-gray-900"}
              `}
            >
              Login
              {isLogin && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-purple-600"
                />
              )}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-2 text-lg font-medium transition-colors relative
                ${!isLogin ? "text-orange-500" : "text-gray-600 hover:text-gray-900"}
              `}
            >
              Sign Up
              {!isLogin && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-purple-600"
                />
              )}
            </button>
          </div>

          {/* Forms */}
          {isLogin ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10 text-gray-900"
                          />
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                <div className="relative">
                  <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                    className="pl-10 text-gray-900"
                          />
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <FormField
                    control={loginForm.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-600">Remember me</span>
                      </div>
                    )}
                  />
                  <Link href="/forgot-password" className="text-sm text-orange-500 hover:text-orange-600">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Login
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-6">
                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter your full name"
                            className="pl-10 text-gray-900"
                          />
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
              <div className="relative">
                <Input
                            {...field}
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 text-gray-900"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
              <div className="relative">
                <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 text-gray-900"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
              </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="college"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College/University</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter your college name" 
                          className="text-gray-900"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I am a...</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option value="user">Student</option>
                          <option value="organizer">Event Organizer</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    required
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-orange-500 hover:text-orange-600">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-orange-500 hover:text-orange-600">
                    Privacy Policy
                  </Link>
                </span>
              </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 via-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
              <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
            </Button>
          </form>
            </Form>
          )}

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => toast.error("Social login coming soon!")}
                className="flex items-center justify-center gap-2 h-11 w-full rounded-lg border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button
                onClick={() => toast.error("Social login coming soon!")}
                className="flex items-center justify-center gap-2 h-11 w-full rounded-lg border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 