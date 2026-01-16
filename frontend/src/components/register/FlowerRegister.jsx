import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FlowerScene } from "../login/flowers";
import { showToast } from "../common/ToastContainer";

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
      <div className="relative text-center px-8 z-10">
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
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [registerState, setRegisterState] = useState("idle"); // idle, typing, error, success
  
  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError("");
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
      setError(err.message || "Something went wrong");
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
    setError("");

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
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setError("");

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
      setError(err.message || "Something went wrong");
    } finally {
      setResending(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "/api/v1/auth/google";
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
        className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden"
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
                className="text-center mb-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 
                  className="text-3xl font-serif text-gray-800 mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Create Account
                </h1>
                <p className="text-sm text-gray-500">
                  Join BloomTale today
                </p>
              </motion.div>

              {/* Form */}
              <motion.form 
                onSubmit={handleCredentialsSubmit} 
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {/* Error Message */}
                {error && (
                  <motion.div 
                    className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B7C59]/20 focus:border-[#6B7C59] transition-all duration-300 shadow-sm"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B7C59]/20 focus:border-[#6B7C59] transition-all duration-300 pr-12 shadow-sm"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      disabled={loading}
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>

                {/* Send OTP Button */}
                <motion.button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
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
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-medium py-3.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                className="text-center text-sm text-gray-500 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-[#6B7C59] hover:underline font-semibold"
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
                className="text-center mb-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 
                  className="text-3xl font-serif text-gray-800 mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Verify Your Email
                </h1>
                <p className="text-sm text-gray-500">
                  We've sent a verification code to<br />
                  <span className="font-medium text-gray-700">{email}</span>
                </p>
              </motion.div>

              {/* OTP Form */}
              <motion.form 
                onSubmit={handleOtpSubmit} 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {/* Error Message */}
                {error && (
                  <motion.div 
                    className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}

                {/* OTP Input Boxes */}
                <div className="flex gap-3 justify-center">
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
                      className="w-12 h-14 text-center text-xl font-semibold bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B7C59]/20 focus:border-[#6B7C59] transition-all duration-300 shadow-sm"
                      disabled={loading}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                    />
                  ))}
                </div>

                {/* Resend OTP */}
                <div className="text-center">
                  <span className="text-gray-500 text-sm">Didn't receive the code? </span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[#6B7C59] font-semibold text-sm hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={resending || loading}
                  >
                    {resending ? "Sending..." : "Resend OTP"}
                  </button>
                </div>

                {/* Verify Button */}
                <motion.button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
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
                  className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
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
