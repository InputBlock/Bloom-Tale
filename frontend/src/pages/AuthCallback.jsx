import { useEffect, useState, useRef, memo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Handwritten text component with character-by-character animation
const HandwrittenText = memo(({ text, delay = 0, className = "", style = {} }) => {
  const characters = text.split("");
  
  return (
    <motion.span 
      className={`inline-block ${className}`}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.15,
            delay: delay + index * 0.05,
            ease: "easeOut"
          }}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
});

// Welcome Message Component - displays after successful Google login
const WelcomeAnimation = memo(({ onComplete }) => {
  useEffect(() => {
    // Auto redirect after animation completes
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full min-h-screen bg-[#FAF6F0]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft gradient circles */}
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
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <HandwrittenText
            text="Welcome"
            delay={0.3}
            className="block"
            style={{ 
              fontFamily: "'Pacifico', cursive",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              color: "#e8909c",
              textShadow: "2px 2px 0px rgba(180, 100, 120, 0.25), 4px 4px 0px rgba(150, 80, 100, 0.1)",
              letterSpacing: "1px"
            }}
          />
        </motion.div>
        
        {/* Back to */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <HandwrittenText
            text="Back to"
            delay={1.0}
            className="block mt-1"
            style={{ 
              fontFamily: "'Pacifico', cursive",
              fontSize: "clamp(1.5rem, 4vw, 3.2rem)",
              color: "#e8909c",
              textShadow: "2px 2px 0px rgba(180, 100, 120, 0.25), 4px 4px 0px rgba(150, 80, 100, 0.1)",
              letterSpacing: "1px"
            }}
          />
        </motion.div>
        
        {/* BloomTale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <HandwrittenText
            text="BloomTale"
            delay={1.7}
            className="block mt-1"
            style={{ 
              fontFamily: "'Pacifico', cursive",
              fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
              color: "#e8909c",
              textShadow: "2px 2px 0px rgba(180, 100, 120, 0.25), 4px 4px 0px rgba(150, 80, 100, 0.1)",
              letterSpacing: "1px"
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
});

export default function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('processing') // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')
  const redirectUrlRef = useRef('/home')

  useEffect(() => {
    const token = searchParams.get('token')
    const userParam = searchParams.get('user')
    const error = searchParams.get('error')

    if (error) {
      setErrorMessage(error)
      setStatus('error')
      setTimeout(() => navigate('/login', { state: { error } }), 2000)
      return
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam))
        console.log('AuthCallback - parsed user:', user)
        
        // Store token and user in localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        // Get stored redirect URL or default to home
        redirectUrlRef.current = localStorage.getItem('authRedirect') || '/home'
        localStorage.removeItem('authRedirect') // Clean up
        
        // Show welcome animation
        setStatus('success')
      } catch (err) {
        console.error('Failed to parse user data:', err)
        setErrorMessage('Error parsing user data')
        setStatus('error')
        setTimeout(() => navigate('/login'), 2000)
      }
    } else {
      setErrorMessage('Missing token or user data')
      setStatus('error')
      setTimeout(() => navigate('/login'), 2000)
    }
  }, [searchParams, navigate])

  const handleWelcomeComplete = () => {
    navigate(redirectUrlRef.current)
  }

  // Show welcome animation on success
  if (status === 'success') {
    return (
      <AnimatePresence>
        <WelcomeAnimation onComplete={handleWelcomeComplete} />
      </AnimatePresence>
    )
  }

  // Show loading or error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0] p-4 sm:p-6">
      <div className="text-center">
        {status === 'processing' ? (
          <>
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#6B7C59] mx-auto mb-3 sm:mb-4"></div>
            <p className="text-sm sm:text-base text-gray-600">Processing...</p>
          </>
        ) : (
          <>
            <div className="text-red-500 mb-3 sm:mb-4">
              <svg className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-sm sm:text-base text-red-600">{errorMessage}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  )
}