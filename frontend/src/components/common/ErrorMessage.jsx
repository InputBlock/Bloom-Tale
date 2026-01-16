import { motion } from "framer-motion";
import { AlertCircle, XCircle, Wifi } from "lucide-react";

const ErrorMessage = ({ error, onClose }) => {
  if (!error) return null;

  const getIcon = (type) => {
    switch(type) {
      case 'network':
        return <Wifi className="w-5 h-5" />;
      case 'email':
      case 'password':
      case 'credentials':
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
          container: 'bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-white border border-blue-200/50',
          icon: 'text-blue-500',
          title: 'text-gray-800',
          message: 'text-gray-600',
          link: 'text-blue-600 hover:text-blue-700',
          bar: 'bg-gradient-to-r from-blue-400/40 via-blue-300/30 to-transparent'
        };
      case 'expired':
        return {
          container: 'bg-gradient-to-br from-amber-50/80 via-yellow-50/60 to-white border border-amber-200/50',
          icon: 'text-amber-500',
          title: 'text-gray-800',
          message: 'text-gray-600',
          link: 'text-amber-600 hover:text-amber-700',
          bar: 'bg-gradient-to-r from-amber-400/40 via-amber-300/30 to-transparent'
        };
      default:
        return {
          container: 'bg-gradient-to-br from-pink-50/70 via-rose-50/50 to-white border border-pink-200/40',
          icon: 'text-pink-500',
          title: 'text-gray-800',
          message: 'text-gray-600',
          link: 'text-pink-600 hover:text-pink-700',
          bar: 'bg-gradient-to-r from-pink-300/30 via-rose-300/20 to-transparent'
        };
    }
  };

  const styles = getStyles(error.type);

  return (
    <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`relative w-full p-4 rounded-2xl shadow-md ${styles.container}`}
      >
        {/* Animated shake effect for emphasis */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: [-3, 3, -3, 3, 0] }}
          transition={{ duration: 0.4 }}
          className="flex items-start gap-3"
        >
          <motion.div 
            className={`${styles.icon} mt-0.5 shrink-0 bg-white/50 rounded-full p-2`}
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            {getIcon(error.type)}
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <motion.h4 
              className={`text-sm font-semibold ${styles.title} mb-1.5`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              {error.title}
            </motion.h4>
            
            <motion.p 
              className={`text-sm ${styles.message} leading-relaxed`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {error.message}
            </motion.p>
            
            {error.action && (
              <motion.a
                href={error.action.link}
                className={`inline-block mt-2 text-sm font-medium ${styles.link} underline underline-offset-2`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {error.action.text} →
              </motion.a>
            )}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 hover:bg-gray-100 rounded-full p-1"
              aria-label="Close error message"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </motion.div>

        {/* Decorative animated line */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl ${styles.bar}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
        />
      </motion.div>
  );
};

export default ErrorMessage;
