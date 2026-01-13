"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Code2,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Star,
  Trophy,
  Brain,
  Target,
  LogsIcon,
  House,
  Lock,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

import type { Variants, Transition } from "framer-motion";

// Validation Schemas
const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const RegisterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof LoginSchema>;
type RegisterFormData = z.infer<typeof RegisterSchema>;

// Animation variants - memoized outside component
const fadeLeftTransition: Transition = { duration: 0.45, ease: "easeOut" };
const fadeRightTransition: Transition = { duration: 0.5, ease: "easeOut", delay: 0.05 };

const listStagger: Variants = {
  hidden: { opacity: 0, filter: "blur(6px)", y: 8 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemFade: Variants = {
  hidden: { opacity: 0, filter: "blur(6px)", y: 8 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const statsStagger: Variants = {
  hidden: { opacity: 0, filter: "blur(6px)", y: 6 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.35, ease: "easeOut", staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const statItem: Variants = {
  hidden: { opacity: 0, filter: "blur(6px)", y: 6 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const formVariants: Variants = {
  enter: { opacity: 0, x: 20, filter: "blur(4px)" },
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: -20, filter: "blur(4px)" },
};

// Static data
const floatingIcons = [
  { icon: Code2, delay: 0, duration: 3 },
  { icon: Zap, delay: 0.5, duration: 4 },
  { icon: Star, delay: 1, duration: 3.5 },
  { icon: Trophy, delay: 1.5, duration: 4.5 },
  { icon: Brain, delay: 2, duration: 3.8 },
  { icon: Target, delay: 2.5, duration: 4.2 },
];

const features = [
  { icon: LogsIcon, text: "Access to Problems", color: "text-emerald-400" },
  { icon: Zap, text: "Level up Skills", color: "text-violet-400" },
  { icon: Shield, text: "Customized problems", color: "text-orange-400" },
  { icon: Brain, text: "Reference Solutions", color: "text-pink-400" },
];

const stats = [
  { value: "200+", label: "Users" },
  { value: "30+", label: "Problems" },
  { value: "98%", label: "Success Rate" },
];

// Google SVG Icon component
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { login, registers, isLoading, isRegistered, isAuthenticated, error, clearError } = useAuthStore();

  // Handle Google OAuth errors from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    
    if (oauthError) {
      const errorMessages: Record<string, string> = {
        'access_denied': 'Google authentication was cancelled',
        'missing_parameters': 'Authentication failed: Missing parameters',
        'invalid_state': 'Authentication failed: Invalid request',
        'token_exchange_failed': 'Failed to authenticate with Google',
        'user_info_failed': 'Failed to retrieve user information',
        'authentication_failed': 'Authentication failed. Please try again',
        'server_error': 'Server error. Please try again later',
      };
      
      const message = errorMessages[oauthError] || 'Google authentication failed';
      toast.error(message);
      
      // Clean up URL
      router.replace('/auth');
    }
  }, [router]);

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  // Mouse tracking for background effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Show errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Form handlers
  const onLoginSubmit = useCallback(async (data: LoginFormData) => {
    try {
      await login(data);
      // toast.success("Welcome back!");
      router.push("/");
    } catch {
      // Error handled in store
    }
  }, [login, router]);

  const onRegisterSubmit = useCallback(async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await registers(registerData);
      toast.success("Account created successfully!");
      router.push("/");
    } catch {
      // Error handled in store
      toast.error("Registration failed. Please try again.");
    }
  }, [registers, router]);

  const toggleForm = useCallback(() => {
    setIsLogin((prev) => !prev);
    setShowPassword(false);
    setShowConfirmPassword(false);
    loginForm.reset();
    registerForm.reset();
  }, [loginForm, registerForm]);

  // Memoized floating icons
  const FloatingIcons = useMemo(() => (
    <>
      {floatingIcons.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div
            key={index}
            className="absolute text-white/10"
            style={{
              left: `${10 + index * 15}%`,
              top: `${20 + index * 10}%`,
              animation: `float ${item.duration}s ease-in-out infinite`,
              animationDelay: `${item.delay}s`,
            }}
          >
            <IconComponent className="w-8 h-8" />
          </div>
        );
      })}
    </>
  ), []);

  const isSubmitting = isLoading || isRegistered;

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* CSS for float animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div
          className="absolute w-96 h-96 bg-linear-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02}px`,
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className="absolute w-80 h-80 bg-linear-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            right: `${mousePosition.x * 0.015}px`,
            bottom: `${mousePosition.y * 0.015}px`,
            transform: "translate(50%, 50%)",
            animationDelay: "1s",
          }}
        />
        <div
          className="absolute w-64 h-64 bg-linear-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-3xl animate-pulse"
          style={{ left: "20%", top: "60%", animationDelay: "2s" }}
        />

        {/* Floating Icons */}
        {FloatingIcons}

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {/* Home Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 text-gray-300 flex items-center gap-1.5 group cursor-pointer bg-gray-900/80  p-2 rounded-sm hover:bg-gray-800/60  transition-colors"
        >
          <House className="text-neutral-300 transition-colors" size={18} />
          <span className="transition-all duration-200">Home</span>
        </Link>

        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Marketing Content */}
          <motion.div
            className="space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, x: -16, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={fadeLeftTransition}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 transition-all duration-300 ring-1 ring-violet-400/0 hover:ring-violet-400/25 hover:bg-violet-500/15 hover:border-violet-400/30 hover:shadow-[0_0_24px_4px_rgba(139,92,246,0.22)]">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-violet-300 text-sm font-medium">
                  {isLogin ? "Welcome Back" : "Get Started"}
                </span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="bg-linear-to-r from-white via-violet-200 to-emerald-200 bg-clip-text text-transparent">
                  Level Up DSA
                </span>
                <br />
                <span className="bg-linear-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
                  Like Never Before
                </span>
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Join the ultimate platform for Data Structures & Algorithms.
                Practice, compete, and land your dream job.
              </p>
            </div>

            {/* Features */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0"
              variants={listStagger}
              initial="hidden"
              animate="visible"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 rounded-sm"
                    variants={itemFade}
                  >
                    <div className="w-8 h-8 bg-gray-700/30 flex items-center justify-center rounded-sm">
                      <Icon className={`w-4 h-4 ${feature.color}`} />
                    </div>
                    <span className="text-gray-300 font-medium">{feature.text}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex justify-center lg:justify-start space-x-8"
              variants={statsStagger}
              initial="hidden"
              animate="visible"
            >
              {stats.map((stat, index) => (
                <motion.div key={index} className="text-center" variants={statItem}>
                  <div className="text-2xl font-bold bg-linear-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={fadeRightTransition}
          >
            <Card className="w-full max-w-md bg-gray-900/50 border-gray-700/50 backdrop-blur-sm shadow-2xl rounded-sm">
              <CardContent className="p-8">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {isLogin ? "Welcome Back" : "Join Love Leetcode"}
                  </h2>
                  <p className="text-gray-400">
                    {isLogin
                      ? "Sign in to continue your journey"
                      : "Start your problem solving journey today"}
                  </p>
                </div>

                {/* Google Auth Button */}
                <div className="mb-6">
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
                      window.location.href = `${apiUrl}/auth/google`;
                    }}
                    className="w-full bg-white hover:bg-gray-100 disabled:hover:bg-white text-gray-900 font-medium py-3 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-60 cursor-pointer"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </Button>
                </div>

                <div className="relative mb-6">
                  <Separator className="bg-gray-700" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-gray-900 px-3 text-gray-400 text-sm">or</span>
                  </div>
                </div>

                {/* Animated Form Container */}
                <AnimatePresence mode="wait">
                  {isLogin ? (
                    <motion.form
                      key="login"
                      variants={formVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                      className="space-y-4"
                    >
                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-gray-300">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="login-email"
                            type="email"
                            {...loginForm.register("email")}
                            placeholder="Enter your email"
                            className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500/20"
                          />
                        </div>
                        {loginForm.formState.errors.email && (
                          <p className="text-red-500 text-sm">
                            {loginForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <Label htmlFor="login-password" className="text-gray-300">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            {...loginForm.register("password")}
                            placeholder="Enter your password"
                            className="pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {loginForm.formState.errors.password && (
                          <p className="text-red-500 text-sm">
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      {/* Forgot Password Link */}
                      <div className="flex justify-end">
                        <Link
                          href="/forgot-password"
                          className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-linear-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700 text-white font-medium py-3 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Signing in...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>Sign In</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="register"
                      variants={formVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                      className="space-y-4"
                    >
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="register-name" className="text-gray-300">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="register-name"
                            type="text"
                            {...registerForm.register("name")}
                            placeholder="Enter your full name"
                            className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500/20"
                          />
                        </div>
                        {registerForm.formState.errors.name && (
                          <p className="text-red-500 text-sm">
                            {registerForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-gray-300">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="register-email"
                            type="email"
                            {...registerForm.register("email")}
                            placeholder="Enter your email"
                            className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500/20"
                          />
                        </div>
                        {registerForm.formState.errors.email && (
                          <p className="text-red-500 text-sm">
                            {registerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-gray-300">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            {...registerForm.register("password")}
                            placeholder="Create a password"
                            className="pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {registerForm.formState.errors.password && (
                          <p className="text-red-500 text-sm">
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <Label htmlFor="register-confirm-password" className="text-gray-300">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="register-confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            {...registerForm.register("confirmPassword")}
                            placeholder="Confirm your password"
                            className="pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500 focus:ring-violet-500/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {registerForm.formState.errors.confirmPassword && (
                          <p className="text-red-500 text-sm">
                            {registerForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-linear-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700 text-white font-medium py-3 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isRegistered ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Creating account...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span>Create Account</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Toggle Form */}
                <div className="mt-6 text-center">
                  <p className="text-gray-400">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                      type="button"
                      onClick={toggleForm}
                      className="text-violet-400 hover:text-violet-300 font-medium transition-colors cursor-pointer"
                    >
                      {isLogin ? "Sign up" : "Sign in"}
                    </button>
                  </p>
                </div>

                {/* Terms */}
                {!isLogin && (
                  <p className="mt-4 text-xs text-gray-500 text-center">
                    By creating an account, you agree to our{" "}
                    <Link href="/terms" className="text-violet-400 hover:text-violet-300">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-violet-400 hover:text-violet-300">
                      Privacy Policy
                    </Link>
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}