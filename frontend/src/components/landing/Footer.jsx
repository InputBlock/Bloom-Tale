import { motion } from "framer-motion";
import { Heart, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative py-16 mt-auto">
      {/* Top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-display font-semibold text-foreground mb-4">
              Bloom<span className="text-primary">Tale</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every flower tells a story. We craft emotional connections through 
              nature's most beautiful expressions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-foreground mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              {["Shop All", "Couples", "Corporate", "Celebration", "Gifting"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-foreground mb-4">
              Connect
            </h4>
            <div className="flex gap-3 mb-4">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-foreground" />
                </motion.a>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              hello@bloomtale.com
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 BloomTale. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-accent fill-accent" /> for every story
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
