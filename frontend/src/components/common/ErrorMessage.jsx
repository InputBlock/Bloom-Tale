import { motion } from "framer-motion";
import { AlertCircle, XCircle, Wifi, Lock, Mail, Server, Clock, ShieldAlert } from "lucide-react";

const ErrorMessage = ({ error, onClose }) => {
  console.log('ErrorMessage rendered with error:', error);
  if (!error) return null;

  const getIcon = (type) => {
    switch(type) {
      case 'network':
        return <Wifi className="w-5 h-5" />;
      case 'email':
        return <Mail className="w-5 h-5" />;
      case 'password':
      case 'credentials':
        return <Lock className="w-5 h-5" />;
      case 'server':
        return <Server className="w-5 h-5" />;
      case 'session-expired':
        return <Clock className="w-5 h-5" />;
      case 'notfound':
        return <ShieldAlert className="w-5 h-5" />;
      case 'otp':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <XCircle className="w-5 h-5" />;
    }
  };

  const getStyles = (type) => {
    switch(type) {
      case 'network':
        return {
          container: 'bg-gradient-to-br from-blue-50 via-sky-50/80 to-white/90 border-2 border-blue-200/60 backdrop-blur-sm',
          icon: 'text-blue-600',
          iconBg: 'bg-blue-100/80',
          title: 'text-gray-900',
          message: 'text-gray-700',
          link: 'text-blue-700 hover:text-blue-800',
          bar: 'bg-gradient-to-r from-blue-500/50 via-sky-400/40 to-transparent',
          glow: 'shadow-lg shadow-blue-200/50'
        };
      case 'session-expired':
        return {
          container: 'bg-gradient-to-br from-amber-50 via-yellow-50/80 to-white/90 border-2 border-amber-200/60 backdrop-blur-sm',
          icon: 'text-amber-600',
          iconBg: 'bg-amber-100/80',
          title: 'text-gray-900',
          message: 'text-gray-700',
          link: 'text-amber-700 hover:text-amber-800',
          bar: 'bg-gradient-to-r from-amber-500/50 via-yellow-400/40 to-transparent',
          glow: 'shadow-lg shadow-amber-200/50'
        };
      case 'server':
        return {
          container: 'bg-gradient-to-br from-orange-50 via-red-50/80 to-white/90 border-2 border-orange-200/60 backdrop-blur-sm',
          icon: 'text-orange-600',
          iconBg: 'bg-orange-100/80',
          title: 'text-gray-900',
          message: 'text-gray-700',
          link: 'text-orange-700 hover:text-orange-800',
          bar: 'bg-gradient-to-r from-orange-500/50 via-red-400/40 to-transparent',
          glow: 'shadow-lg shadow-orange-200/50'
        };
      case 'notfound':
        return {
          container: 'bg-gradient-to-br from-purple-50 via-pink-50/80 to-white/90 border-2 border-purple-200/60 backdrop-blur-sm',
          icon: 'text-purple-600',
          iconBg: 'bg-purple-100/80',
          title: 'text-gray-900',
          message: 'text-gray-700',
          link: 'text-purple-700 hover:text-purple-800',
          bar: 'bg-gradient-to-r from-purple-500/50 via-pink-400/40 to-transparent',
          glow: 'shadow-lg shadow-purple-200/50'
        };
      case 'credentials':
      case 'password':
        return {
          container: 'bg-gradient-to-br from-rose-50 via-pink-50/80 to-white/90 border-2 border-rose-300/60 backdrop-blur-sm',
          icon: 'text-rose-600',
          iconBg: 'bg-rose-100/80',
          title: 'text-gray-900',
          message: 'text-gray-700',
          link: 'text-rose-700 hover:text-rose-800',
          bar: 'bg-gradient-to-r from-rose-500/50 via-pink-400/40 to-transparent',
          glow: 'shadow-lg shadow-rose-200/50'
        };
      case 'email':
        return {
          container: 'bg-gradient-to-br from-teal-50 via-cyan-50/80 to-white/90 border-2 border-teal-200/60 backdrop-blur-sm',
          icon: 'text-teal-600',
          iconBg: 'bg-teal-100/80',
          title: 'text-gray-900',
          message: 'text-gray-700',
          link: 'text-teal-700 hover:text-teal-800',
          bar: 'bg-gradient-to-r from-teal-500/50 via-cyan-400/40 to-transparent',
          glow: 'shadow-lg shadow-teal-200/50'
        };
      default:
        return {
          container: 'bg-gradient-to-br from-pink-50 via-rose-50/80 to-white/90 border-2 border-pink-300/60 backdrop-blur-sm',
          icon: 'text-pink-600',
          iconBg: 'bg-pink-100/80',
          title: 'text-gray-900',
          message: 'text-gray-700',
          link: 'text-pink-700 hover:text-pink-800',
          bar: 'bg-gradient-to-r from-pink-500/50 via-rose-400/40 to-transparent',
          glow: 'shadow-lg shadow-pink-200/50'
        };
    }
  };

  const styles = getStyles(error.type);

  return (
    <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.4, 0, 0.2, 1],
          scale: { type: "spring", stiffness: 300, damping: 20 }
        }}
        className={`relative w-full p-4 rounded-xl ${styles.container} ${styles.glow} overflow-hidden`}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/30 rounded-full blur-2xl" />
        </div>

        {/* Animated shake effect for emphasis */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: [-4, 4, -4, 4, 0] }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative flex items-start gap-3"
        >
          <motion.div 
            className={`${styles.icon} mt-0.5 shrink-0 ${styles.iconBg} rounded-xl p-2.5 shadow-sm`}
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ 
              delay: 0.1, 
              type: "spring", 
              stiffness: 260,
              damping: 15
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {getIcon(error.type)}
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <motion.h4 
              className={`text-sm font-bold ${styles.title} mb-1.5 tracking-tight`}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              {error.title}
            </motion.h4>
            
            <motion.p 
              className={`text-sm ${styles.message} leading-relaxed font-medium`}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {error.message}
            </motion.p>
            
            {error.action && (
              <motion.a
                href={error.action.link}
                className={`inline-flex items-center gap-1 mt-3 text-sm font-semibold ${styles.link} hover:underline underline-offset-2 transition-all`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ x: 3 }}
              >
                {error.action.text}
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.a>
            )}
          </div>

          {onClose && (
            <motion.button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-all shrink-0 hover:bg-white/80 rounded-lg p-1.5 active:scale-95"
              aria-label="Close error message"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <XCircle className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>

        {/* Decorative animated line with shimmer effect */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-1.5 rounded-b-xl ${styles.bar}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
        />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute bottom-0 left-0 h-1.5 w-32 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-b-xl"
          animate={{ x: ['-100%', '400%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </motion.div>
  );
};

export default ErrorMessage;
