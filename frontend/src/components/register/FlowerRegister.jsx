import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FlowerScene } from "../login/flowers";
import { showToast } from "../common/ToastContainer";
import ErrorMessage from "../common/ErrorMessage";

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
const validatePassword = (password) => {
  if (!password) return { isValid: false, message: '' };
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  return { isValid: true, message: 'Strong password!' };
};

// Parse and improve error messages
const getErrorMessage = (errorMsg) => {
  const msg = errorMsg.toLowerCase();
  
  if (msg.includes('already exists') || msg.includes('email already') || msg.includes('already registered')) {
    return {
      title: 'Account Already Exists',
      message: 'An account with this email already exists. Would you like to log in instead?',
      type: 'exists',
      action: { text: 'Go to Login', link: '/login' }
    };
  }
  
  if (msg.includes('invalid email') || (msg.includes('email') && msg.includes('invalid'))) {
    return {
      title: 'Invalid Email',
      message: 'Please enter a valid email address.',
      type: 'email'
    };
  }
  
  if (msg.includes('password') && (msg.includes('weak') || msg.includes('short') || msg.includes('requirements'))) {
    return {
      title: 'Weak Password',
      message: 'Password must be at least 8 characters with uppercase, lowercase, and numbers.',
      type: 'password'
    };
  }
  
  if (msg.includes('invalid otp') || msg.includes('wrong otp') || msg.includes('incorrect otp')) {
    return {
      title: 'Invalid OTP',
      message: 'The code you entered is incorrect. Please check and try again.',
      type: 'otp'
    };
  }
  
  if (msg.includes('expired otp') || msg.includes('otp expired')) {
    return {
      title: 'OTP Expired',
      message: 'Your verification code has expired. Please request a new one.',
      type: 'expired'
    };
  }
  
  if (msg.includes('network') || msg.includes('fetch')) {
    return {
      title: 'Connection Error',
      message: 'Unable to connect to the server. Please check your internet connection.',
      type: 'network'
    };
  }
  
  if (msg.includes('server error') || msg.includes('500')) {
    return {
      title: 'Server Error',
      message: 'Something went wrong on our end. Please try again in a moment.',
      type: 'server'
    };
  }
  
  return {
    title: 'Error',
    message: errorMsg || 'An unexpected error occurred. Please try again.',
    type: 'general'
  };
};

// Handwritten Letter-by-Letter Text Animation Component
const HandwrittenText = ({ text, delay = 0, className = "", style = {} }) => {
  return (
    <motion.span 
      className={className} 
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, rotateZ: -10 }}
          animate={{ opacity: 1, y: 0, rotateZ: 0 }}
          transition={{
            delay: delay + index * 0.06,
            duration: 0.3,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

// Welcome Animation for after successful registration
const WelcomeAnimation = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-pink-100/40 blur-2xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-rose-100/30 blur-2xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/3 w-24 h-24 rounded-full bg-pink-50/50 blur-xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        />
      </div>

      {/* Text Container */}
      <div className="relative text-center px-4 sm:px-6 md:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <HandwrittenText
            text="Welcome to"
            delay={0.3}
            className="block"
            style={{ 
              fontFamily: "'Pacifico', cursive",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              color: "#e8909c",
              textShadow: "2px 2px 0px rgba(180, 100, 120, 0.25), 4px 4px 0px rgba(150, 80, 100, 0.1)",
              letterSpacing: "1px"
            }}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <HandwrittenText
            text="BloomTale"
            delay={1.2}
            className="block mt-1"
            style={{ 
              fontFamily: "'Pacifico', cursive",
              fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)",
              color: "#e8909c",
              textShadow: "2px 2px 0px rgba(180, 100, 120, 0.25), 4px 4px 0px rgba(150, 80, 100, 0.1)",
              letterSpacing: "1px"
            }}
          />
        </motion.div>

        {/* Floating petals */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${15 + (i * 14)}%`,
              top: `${5 + (i % 3) * 25}%`,
            }}
            initial={{ opacity: 0, y: 0, rotate: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              y: [0, 80, 160],
              rotate: [0, 120, 240],
              x: [0, (i % 2 === 0 ? 20 : -20), 0]
            }}
            transition={{
              duration: 3.5,
              delay: 1 + i * 0.3,
              ease: "easeOut"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20">
              <ellipse cx="10" cy="10" rx="5" ry="9" fill="#ffb6c1" opacity="0.5" />
            </svg>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Flower-themed Register Page (matches login exactly)
export default function FlowerRegister() {
  const [step, setStep] = useState("credentials"); // "credentials" or "otp"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [registerState, setRegisterState] = useState("idle"); // idle, typing, error, success
  
  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  // Validate email on blur
  const handleEmailBlur = () => {
    setFocusedField(null);
    if (email && !isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // Clear email error on focus
  const handleEmailFocus = () => {
    setFocusedField("email");
    setEmailError('');
  };

  // Validate password strength in real-time
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (newPassword) {
      const validation = validatePassword(newPassword);
      setPasswordStrength(validation);
      if (!validation.isValid) {
        setPasswordError(validation.message);
      } else {
        setPasswordError('');
      }
    } else {
      setPasswordStrength(null);
      setPasswordError('');
    }
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    // Validate email format
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Validate password strength
    const passValidation = validatePassword(password);
    if (!passValidation.isValid) {
      setPasswordError(passValidation.message);
      return;
    }

    setLoading(true);
    setError(null);
    setEmailError('');
    setPasswordError('');
    setRegisterState("typing");

    try {
      const response = await fetch("/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || "Server error occurred" };
      }

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Success - move to OTP step
      setStep("otp");
      setShowPassword(false); // Reset password visibility so flowers open eyes
      setFocusedField("otp"); // Set focus to OTP for friendly expression
      showToast("A secret bloomed in your inbox! 🌷", "success");

    } catch (err) {
      console.error("Registration error:", err);
      const errorInfo = getErrorMessage(err.message);
      setError(errorInfo);
      setRegisterState("error");
      
      setTimeout(() => {
        setRegisterState("idle");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/verifyOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ otp: otpValue }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || "Server error occurred" };
      }

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      // Success!
      setRegisterState("success");
      showToast("Your garden account is blooming! 🌺", "success");

      setTimeout(() => {
        window.location.href = "/login";
      }, 4500);

    } catch (err) {
      console.error("OTP verification error:", err);
      const errorInfo = getErrorMessage(err.message);
      setError(errorInfo);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text || "Server error occurred" };
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      showToast("Fresh petals sent to your inbox! 🌺", "success");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

    } catch (err) {
      console.error("Resend OTP error:", err);
      const errorInfo = getErrorMessage(err.message);
      setError(errorInfo);
    } finally {
      setResending(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "/api/v1/google";
  };

  return (
    <div className="min-h-screen flex bg-[#f5f2ed]">
      {/* Left Side - Flower Scene */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <FlowerScene
          focusedField={focusedField}
          isPasswordVisible={showPassword}
          loginState={registerState}
          className="w-full"
        />
      </motion.div>

      {/* Right Side - Form OR Welcome Animation */}
      <motion.div 
        className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <AnimatePresence mode="wait">
          {registerState === "success" ? (
            /* Welcome Animation */
            <motion.div
              key="welcome"
              className="w-full h-full absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <WelcomeAnimation />
            </motion.div>
          ) : step === "credentials" ? (
            /* Credentials Form */
            <motion.div 
              key="credentials"
              className="w-full max-w-md"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Title */}
              <motion.div 
                className="text-center mb-6 sm:mb-8 md:mb-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 
                  className="text-2xl sm:text-3xl font-serif text-gray-800 mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Create Account
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  Join BloomTale today
                </p>
              </motion.div>

              {/* Form */}
              <motion.form 
                onSubmit={handleCredentialsSubmit} 
                className="space-y-4 sm:space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {/* Error Message - Professional UI */}
                <AnimatePresence mode="wait">
                  {error && (
                    <ErrorMessage 
                      error={error} 
                      onClose={() => setError(null)}
                    />
                  )}
                </AnimatePresence>

                {/* Email Field */}
                <div>
                  <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={handleEmailFocus}
                      onBlur={handleEmailBlur}
                      placeholder="Enter your email"
                      className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-white border rounded-sm focus:outline-none focus:ring-2 transition-all duration-300 shadow-sm ${
                        emailError 
                          ? 'border-red-300 focus:ring-red-100 focus:border-red-400' 
                          : 'border-gray-200 focus:ring-[#6B7C59]/20 focus:border-[#6B7C59]'
                      }`}
                      required
                      disabled={loading}
                    />
                  </div>
                  {emailError && (
                    <motion.p 
                      className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
                      {emailError}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-white border rounded-sm focus:outline-none focus:ring-2 transition-all duration-300 pr-11 sm:pr-12 shadow-sm ${
                        passwordError 
                          ? 'border-red-300 focus:ring-red-100 focus:border-red-400' 
                          : 'border-gray-200 focus:ring-[#6B7C59]/20 focus:border-[#6B7C59]'
                      }`}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 active:scale-95"
                      disabled={loading}
                    >
                      {showPassword ? <Eye size={18} className="sm:w-5 sm:h-5" /> : <EyeOff size={18} className="sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                  {passwordError && (
                    <motion.p 
                      className="mt-1.5 text-xs text-red-600 flex items-center gap-1"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
                      {passwordError}
                    </motion.p>
                  )}
                  {passwordStrength && passwordStrength.isValid && (
                    <motion.p 
                      className="mt-1.5 text-xs text-green-600 flex items-center gap-1"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="inline-block w-1 h-1 rounded-full bg-green-600"></span>
                      {passwordStrength.message}
                    </motion.p>
                  )}
                </div>

                {/* Send OTP Button */}
                <motion.button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm sm:text-base font-medium py-3 sm:py-3.5 rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending OTP...
                    </span>
                  ) : (
                    "Send OTP"
                  )}
                </motion.button>

                {/* Google Signup */}
                <motion.button
                  type="button"
                  onClick={handleGoogleSignup}
                  className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 text-sm sm:text-base font-medium py-3 sm:py-3.5 rounded-sm transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
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
                  Sign up with Google
                </motion.button>
              </motion.form>

              {/* Login Link */}
              <motion.p 
                className="text-center text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-[#6B7C59] hover:underline font-semibold active:scale-95"
                >
                  Log in
                </Link>
              </motion.p>
            </motion.div>
          ) : (
            /* OTP Form */
            <motion.div 
              key="otp"
              className="w-full max-w-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Title */}
              <motion.div 
                className="text-center mb-6 sm:mb-8 md:mb-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 
                  className="text-2xl sm:text-3xl font-serif text-gray-800 mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Verify Your Email
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  We've sent a verification code to<br />
                  <span className="font-medium text-gray-700">{email}</span>
                </p>
              </motion.div>

              {/* OTP Form */}
              <motion.form 
                onSubmit={handleOtpSubmit} 
                className="space-y-5 sm:space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {/* Error Message - Professional UI */}
                <AnimatePresence mode="wait">
                  {error && (
                    <ErrorMessage 
                      error={error} 
                      onClose={() => setError(null)}
                    />
                  )}
                </AnimatePresence>

                {/* OTP Input Boxes */}
                <div className="flex gap-2 sm:gap-3 justify-center">
                  {otp.map((digit, index) => (
                    <motion.input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onFocus={() => setFocusedField("otp")}
                      onBlur={() => setFocusedField(null)}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold bg-white border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#6B7C59]/20 focus:border-[#6B7C59] transition-all duration-300 shadow-sm"
                      disabled={loading}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                    />
                  ))}
                </div>

                {/* Resend OTP */}
                <div className="text-center">
                  <span className="text-gray-500 text-xs sm:text-sm">Didn't receive the code? </span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[#6B7C59] font-semibold text-xs sm:text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    disabled={resending || loading}
                  >
                    {resending ? "Sending..." : "Resend OTP"}
                  </button>
                </div>

                {/* Verify Button */}
                <motion.button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm sm:text-base font-medium py-3 sm:py-3.5 rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95"
                  disabled={loading || otp.join("").length !== 6}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Verifying...
                    </span>
                  ) : (
                    "Verify & Create Account"
                  )}
                </motion.button>

                {/* Back button */}
                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setOtp(["", "", "", "", "", ""]);
                    setError("");
                  }}
                  className="w-full text-gray-500 hover:text-gray-700 text-xs sm:text-sm font-medium transition-colors active:scale-95"
                  disabled={loading}
                >
                  ← Back to registration
                </button>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
