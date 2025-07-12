import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, User, ArrowRight, Loader2 } from 'lucide-react';
import useAuthServices from '../services/authServcies';


export default function LoginPage() {
     // Base URL for API - you can modify this based on your environment

   const {login,forgotPassword} = useAuthServices();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'forgot'
  const [forgotEmail, setForgotEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      showAlert('error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      showAlert('error', 'Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      showAlert('error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      showAlert('success', `Welcome back, ${result.user.name}!`);
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        window.location.href = '/dashboard'; // Replace with your dashboard route
      }, 1500);
      
    } catch (error) {
      showAlert('error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      showAlert('error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(forgotEmail)) {
      showAlert('error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await forgotPassword(forgotEmail);
      showAlert('success', result.message);
      setTimeout(() => setCurrentView('login'), 2000);
    } catch (error) {
      showAlert('error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const AlertComponent = ({ type, message }) => (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 max-w-sm ${
      type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : 
      'bg-green-50 border border-green-200 text-green-800'
    }`}>
      <div className="flex items-center space-x-2">
        {type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-indigo flex items-center justify-center p-4">
      {/* Alert */}
      {alert.show && <AlertComponent type={alert.type} message={alert.message} />}
      
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-0 left-0 w-72 h-72 bg-sage rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-coral rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-lavender rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-3000"></div>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-dark-neutral mb-2">
              {currentView === 'login' ? 'Welcome Back' : 'Forgot Password'}
            </h1>
            <p className="text-gray-600">
              {currentView === 'login' ? 'Sign in to your account' : 'Enter your email to reset password'}
            </p>
          </div>

          {/* Login Form */}
          {currentView === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/80"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/80"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentView('forgot')}
                  className="text-sm text-primary hover:text-secondary transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-xl font-medium hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Demo Note */}
              <div className="mt-6 p-4 bg-neutral rounded-xl border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials (for testing):</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>• admin@example.com / admin123</p>
                  <p>• user@example.com / user123</p>
                </div>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-primary hover:text-secondary font-medium transition-colors">
                  Sign up here
                </a>
              </p>
            </form>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="forgot-email"
                    name="forgot-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-white/80"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-xl font-medium hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('login')}
                className="w-full text-primary hover:text-secondary font-medium transition-colors"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}