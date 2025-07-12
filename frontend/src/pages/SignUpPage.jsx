import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Send,
  RefreshCw,
  UserPlus,
  ChevronDown,
  Check
} from 'lucide-react';

// Import your auth services
import { useState } from 'react';
import useAuthServices from '../services/authServcies';

const SignUpPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [completedSteps, setCompletedSteps] = useState([]);

  // Base URL for API - you can modify this based on your environment
 const {sendOTP,verifyOTP,registerUser}=useAuthServices();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dob: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  });

  const steps = [
    { id: 1, title: 'Personal Info', description: 'Basic information' },
    { id: 2, title: 'Security', description: 'Password setup' },
    { id: 3, title: 'Address', description: 'Location details' },
    { id: 4, title: 'Verification', description: 'Email verification' },
    { id: 5, title: 'Complete', description: 'Account created' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError('');
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.email) {
          setError('Please fill in all required fields');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        return true;
      
     
      case 2:
        if (!formData.password || !formData.confirmPassword) {
          setError('Please fill in all password fields');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          return false;
        }
        return true;
      
      case 3:
        // Address is optional, so always return true
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;
    
    setError('');
    setSuccess('');
    
    if (currentStep < 3) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }else if (currentStep === 3) {
  setLoading(true);
  try {
    const otpResponse = await sendOTP(formData.email);

    if (otpResponse.success) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(4); // Go to OTP Verification
      setSuccess('OTP sent! Please check your email.');
    } else {
      setError(otpResponse.message || 'Failed to send OTP');
    }
  } catch (error) {
    setError('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
}

  };

 const handleOTPVerification = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setLoading(true);

  try {
    const response = await verifyOTP(formData.email, otp);

    if (response.success) {
      // Now register user after OTP verified
      const registerResponse = await registerUser(formData);

      if (registerResponse.success) {
        setCompletedSteps([...completedSteps, 4]);
        setCurrentStep(5); // Or redirect to dashboard
        setSuccess('Account created and email verified successfully!');
      } else {
        setError(registerResponse.message || 'Registration failed after verification');
      }
    } else {
      setError(response.message || 'Invalid or expired OTP');
    }
  } catch (error) {
    setError('Something went wrong during verification.');
  } finally {
    setLoading(false);
  }
};

  const resendOTP = async () => {
    setLoading(true);
    try {
      const response = await sendOTP(formData.email);
      
      if (response.success) {
        setSuccess('OTP resent successfully!');
      } else {
        setError(response.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  // Step Progress Component
  const StepProgress = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-300 ${
              completedSteps.includes(step.id) 
                ? 'bg-success text-white' 
                : currentStep === step.id 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral text-dark-neutral'
            }`}>
              {completedSteps.includes(step.id) ? (
                <Check className="w-5 h-5" />
              ) : (
                step.id
              )}
            </div>
            <div className="ml-2 hidden sm:block">
              <div className={`text-sm font-medium ${
                currentStep === step.id ? 'text-primary' : 'text-dark-neutral'
              }`}>
                {step.title}
              </div>
              <div className="text-xs text-dark-neutral opacity-60">
                {step.description}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 ml-4 ${
                completedSteps.includes(step.id) ? 'bg-success' : 'bg-neutral'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Success Page
  if (currentStep === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo via-secondary to-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-coral/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-teal/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-white/20">
            <div className="mb-8">
              <div className="relative inline-block">
                <CheckCircle className="w-20 h-20 text-success mx-auto mb-4 animate-bounce" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-accent animate-spin" />
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
                Welcome Aboard! 🎉
              </h2>
              <p className="text-dark-neutral/70 text-lg">
                Your account has been created and verified successfully.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                Continue to Login
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-white hover:bg-neutral text-primary font-semibold py-4 px-6 rounded-2xl transition-all duration-300 border-2 border-primary hover:border-secondary"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // OTP Verification Page
  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo via-secondary to-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-coral/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-teal/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/20">
            <StepProgress />
            
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="bg-gradient-to-r from-accent to-coral p-4 rounded-2xl mb-4">
                  <Shield className="w-12 h-12 text-white mx-auto" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <div className="w-4 h-4 bg-success rounded-full animate-ping"></div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-dark-neutral mb-2">Verify Your Email</h2>
              <p className="text-dark-neutral/70">
                We've sent a 6-digit code to
                <span className="font-semibold text-primary block">{formData.email}</span>
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center animate-pulse">
                <AlertCircle className="w-5 h-5 text-error mr-3 flex-shrink-0" />
                <span className="text-error text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center">
                <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                <span className="text-success text-sm">{success}</span>
              </div>
            )}

            <form onSubmit={handleOTPVerification} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark-neutral mb-3">Enter Verification Code</label>
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-6 py-4 border-2 border-sage/30 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary text-center text-xl tracking-[0.5em] font-mono bg-white/80 backdrop-blur-sm transition-all duration-300"
                    placeholder="000000"
                    maxLength="6"
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none"></div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Verify Code
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <button
                onClick={resendOTP}
                disabled={loading}
                className="text-primary hover:text-secondary font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Resend Code
              </button>
              
              <button
                onClick={handlePrevious}
                className="text-dark-neutral/70 hover:text-dark-neutral font-medium transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Form
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Form Steps
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-sage/10 to-lavender/10 p-6 rounded-2xl border border-sage/20">
              <h3 className="text-xl font-semibold text-dark-neutral flex items-center mb-6">
                <div className="bg-gradient-to-r from-primary to-teal p-2 rounded-xl mr-3">
                  <User className="w-5 h-5 text-white" />
                </div>
                Personal Information
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-neutral mb-2">
                      First Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/80 backdrop-blur-sm transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-neutral mb-2">
                      Last Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/80 backdrop-blur-sm transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-neutral mb-2">
                    Email Address <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-primary" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-sage/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/80 backdrop-blur-sm transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-neutral mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-teal" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-sage/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/80 backdrop-blur-sm transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-neutral mb-2">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-accent" />
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border-2 border-sage/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/80 backdrop-blur-sm transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-neutral mb-2">Gender</label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/80 backdrop-blur-sm transition-all duration-300 appearance-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-peach/10 to-rose/10 p-6 rounded-2xl border border-peach/20">
              <h3 className="text-xl font-semibold text-dark-neutral flex items-center mb-6">
                <div className="bg-gradient-to-r from-secondary to-coral p-2 rounded-xl mr-3">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                Security Setup
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-neutral mb-2">
                    Password <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border-2 border-sage/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/80 backdrop-blur-sm transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-neutral mb-2">
                    Confirm Password <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border-2 border-sage/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/80 backdrop-blur-sm transition-all duration-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-primary transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal/10 to-mustard/10 p-6 rounded-2xl border border-teal/20">
              <h3 className="text-xl font-semibold text-dark-neutral flex items-center mb-6">
                <div className="bg-gradient-to-r from-teal to-mustard p-2 rounded-xl mr-3">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                Address Information (Optional)
              </h3>

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="Street Address"
                    className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/80 backdrop-blur-sm transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/80 backdrop-blur-sm transition-all duration-300"
                  />
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    placeholder="State/Province"
                    className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/80 backdrop-blur-sm transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="address.postalCode"
                    value={formData.address.postalCode}
                    onChange={handleInputChange}
                    placeholder="Postal Code"
                    className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/80 backdrop-blur-sm transition-all duration-300"
                  />
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    className="w-full px-4 py-3 border-2 border-sage/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white/80 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo via-secondary to-primary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-coral/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-teal/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-rose/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4 py-12">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-4xl w-full border border-white/20">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-2xl mb-4">
                <UserPlus className="w-12 h-12 text-white mx-auto" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-6 h-6 text-accent animate-spin" />
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
              Create Your Account
            </h2>
            <p className="text-dark-neutral/70 text-lg">Join our community and start your journey today</p>
          </div>

          <StepProgress />

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center animate-pulse">
              <AlertCircle className="w-5 h-5 text-error mr-3 flex-shrink-0" />
              <span className="text-error text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center">
              <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
              <span className="text-success text-sm">{success}</span>
            </div>
          )}

          <div className="space-y-8">
            {renderStepContent()}

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="flex-1 bg-white hover:bg-neutral text-primary font-semibold py-4 px-6import React, { useState } from 'react';
rounded-2xl transition-all duration-300 border-2 border-primary hover:border-secondary flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
                </button>
              )}
              
              <button
                onClick={handleNext}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    {currentStep === 3 ? 'Creating Account...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    {currentStep === 3 ? 'Create Account' : 'Next'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;