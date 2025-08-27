'use client';

import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  AuthError,
} from 'firebase/auth';
import { 
  Star, 
  Eye, 
  EyeOff, 
  Loader2, 
  Mail, 
  Lock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    // Check if Firebase auth is ready
    if (auth) {
      setIsFirebaseReady(true);
    } else {
      // Wait a bit for Firebase to initialize
      const timer = setTimeout(() => {
        if (auth) {
          setIsFirebaseReady(true);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Check for verification message in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const message = urlParams.get('message');
      if (message) {
        setError(message);
        // Clear the message from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!auth) {
      setError('Authentication system is initializing. Please try again in a moment.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Send verification email
        try {
          await sendEmailVerification(user);
          console.log('User created successfully:', user.uid, 'Email verified:', user.emailVerified);
          setSuccessMessage('Account created successfully! Please check your email to verify your account before signing in.');
          setIsRedirecting(false);
          // Don't redirect - user needs to verify email first
        } catch (emailError) {
          console.error('Failed to send verification email:', emailError);
          setError('Account created but verification email failed to send. Please try signing in later.');
        }
      } else {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          // Check if email is verified
          if (!user.emailVerified) {
            setError('Please verify your email address before signing in. Check your inbox for a verification link.');
            // Send verification email again if needed
            try {
              await sendEmailVerification(user);
              setError('Please verify your email address before signing in. A new verification email has been sent.');
            } catch (emailError) {
              console.error('Failed to send verification email:', emailError);
            }
            return;
          }
          
          setSuccessMessage('Welcome back! Signing you in...');
          setIsRedirecting(true);
          // Redirect to dashboard after successful signin
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        } catch (signInError: any) {
          console.error('Sign-in error details:', signInError);
          
          // Handle specific sign-in errors
          if (signInError.code === 'auth/user-not-found') {
            setError('No account found with this email. Please sign up instead.');
          } else if (signInError.code === 'auth/wrong-password') {
            setError('Incorrect password. Please try again.');
          } else if (signInError.code === 'auth/invalid-credential') {
            setError('Invalid email or password. Please check your credentials and try again.');
          } else if (signInError.code === 'auth/too-many-requests') {
            setError('Too many failed attempts. Please try again later.');
          } else if (signInError.code === 'auth/user-disabled') {
            setError('This account has been disabled. Please contact support.');
          } else if (signInError.code === 'auth/network-request-failed') {
            setError('Network error. Please check your internet connection and try again.');
          } else {
            setError(`Sign-in error: ${signInError.message || 'Unknown error occurred'}`);
          }
          return;
        }
      }
    } catch (authError: any) {
      console.error('Authentication error:', authError);
      let errorMessage = 'An error occurred. Please try again.';
      
      if (authError.code === 'auth/email-already-in-use' && isSignUp) {
        errorMessage = 'An account with this email already exists. Please sign in instead or use a different email address.';
      } else if (authError.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters long.';
      } else if (authError.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (authError.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (authError.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (authError.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (authError.code === 'auth/internal-error') {
        errorMessage = 'Internal server error. Please try again in a moment.';
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setSuccessMessage(null);
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!auth) {
      setError('Authentication system is initializing. Please try again in a moment.');
      return;
    }
    
    if (!passwordResetEmail.trim()) {
      setError('Please enter your email address.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await sendPasswordResetEmail(auth, passwordResetEmail);
      setSuccessMessage('Password reset email sent! Check your inbox for instructions.');
      setPasswordResetEmail('');
      setTimeout(() => {
        setShowPasswordReset(false);
        setSuccessMessage(null);
      }, 3000);
    } catch (authError: any) {
      let errorMessage = 'An error occurred. Please try again.';
      
      if (authError.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (authError.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (authError.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isFirebaseReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 animate-pulse">Initializing Authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md">
        {/* Back to Home - Hidden on mobile to prevent duplication */}
        <Link 
          href="/" 
          className="hidden md:inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        {/* Mobile Back Button - Subtle and positioned better */}
        <Link 
          href="/" 
          className="md:hidden absolute top-4 left-4 p-2 text-gray-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Create Your Account' : 'Welcome Back'}
              </h1>
              <p className="text-gray-600">
                {isSignUp 
                  ? 'Start building your business reputation today' 
                  : 'Sign in to your account to continue'
                }
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="bg-success-50 border border-success-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-success-700 text-sm">{successMessage}</p>
                      {isRedirecting && (
                        <div className="mt-2 flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-success-600 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-success-600 text-xs">Redirecting to dashboard...</p>
                        </div>
                      )}
                      {!isRedirecting && isSignUp && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-blue-700 text-xs mb-2">
                            📧 Check your email for a verification link. Click the link to verify your account, then come back to sign in.
                          </p>
                          <button
                            type="button"
                            onClick={async () => {
                              if (auth?.currentUser) {
                                try {
                                  await sendEmailVerification(auth.currentUser);
                                  setSuccessMessage('Verification email sent again! Check your inbox.');
                                } catch (error) {
                                  setError('Failed to send verification email. Please try again.');
                                }
                              }
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            Resend verification email
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearMessages();
                    }}
                    placeholder="you@business.com"
                    className="input-field pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearMessages();
                    }}
                    placeholder="••••••••"
                    className="input-field pr-12 pl-10"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {isSignUp && (
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
                )}
                {!isSignUp && (
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => setShowPasswordReset(true)}
                      className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                      disabled={isSubmitting}
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-red-700 text-sm">{error}</p>
                        {error.includes('already exists') && (
                          <div className="mt-2 flex space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEmail('');
                                setPassword('');
                                setError(null);
                              }}
                              className="text-xs text-red-600 hover:text-red-800 underline"
                            >
                              Clear Form
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setError(null);
                                setEmail('');
                                setPassword('');
                                // Use a more direct approach
                                const newSignUpState = false;
                                setIsSignUp(newSignUpState);
                                // Also trigger a form reset
                                const form = document.querySelector('form');
                                if (form) form.reset();
                              }}
                              className="text-xs text-red-600 hover:text-red-800 underline"
                            >
                              Switch to Sign In
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full group inline-flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </button>
            </form>

            {/* Password Reset Form */}
            {showPasswordReset && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset Your Password</h3>
                    <p className="text-sm text-gray-600">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>
                  
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div>
                      <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="reset-email"
                          type="email"
                          value={passwordResetEmail}
                          onChange={(e) => setPasswordResetEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="Enter your email address"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 btn-primary"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Send Reset Link'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPasswordReset(false)}
                        className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Toggle Mode */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={toggleMode}
                  className="text-primary-600 hover:text-primary-700 font-medium ml-1 transition-colors"
                  disabled={isSubmitting}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              className="w-full btn-secondary group inline-flex items-center justify-center"
              disabled={isSubmitting}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Terms */}
            {isSignUp && (
              <p className="text-xs text-gray-500 text-center mt-6">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="text-primary-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>
              </p>
            )}
          </div>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Trusted by 500+ businesses nationwide
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-gray-600">
                <div className="font-semibold text-primary-600">50K+</div>
                <div>Reviews Generated</div>
              </div>
              <div className="text-gray-600">
                <div className="font-semibold text-primary-600">95%</div>
                <div>Success Rate</div>
              </div>
              <div className="text-gray-600">
                <div className="font-semibold text-primary-600">3x</div>
                <div>Review Increase</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
