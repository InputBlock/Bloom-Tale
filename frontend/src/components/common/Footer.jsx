import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react"
import { Link } from "react-router-dom"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#3e4026] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/home" className="inline-block mb-3 sm:mb-4">
              <img 
                src="/BloomTaleLogopng(500x350px).png" 
                alt="Bloom Tale" 
                className="h-12 sm:h-14 md:h-16 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-4 sm:mb-6">
              Crafting beautiful moments with nature's finest blooms since 2010. 
              Every arrangement tells your unique story.
            </p>
            {/* Social Icons */}
            <div className="flex gap-2.5 sm:gap-3">
              <a 
                href="#" 
                className="w-11 h-11 sm:w-10 sm:h-10 border border-white/20 rounded-md flex items-center justify-center hover:bg-white hover:text-[#3e4026] active:scale-95 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={19} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a 
                href="#" 
                className="w-11 h-11 sm:w-10 sm:h-10 border border-white/20 rounded-md flex items-center justify-center hover:bg-white hover:text-[#3e4026] active:scale-95 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={19} className="sm:w-[18px] sm:h-[18px]" />
              </a>
              <a 
                href="#" 
                className="w-11 h-11 sm:w-10 sm:h-10 border border-white/20 rounded-md flex items-center justify-center hover:bg-white hover:text-[#3e4026] active:scale-95 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={19} className="sm:w-[18px] sm:h-[18px]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white/50 mb-4 sm:mb-6">
              Quick Links
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              <li>
                <Link to="/shop" className="text-sm sm:text-base text-white/70 hover:text-white transition-colors inline-block py-1">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm sm:text-base text-white/70 hover:text-white transition-colors inline-block py-1">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm sm:text-base text-white/70 hover:text-white transition-colors inline-block py-1">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm sm:text-base text-white/70 hover:text-white transition-colors inline-block py-1">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-sm sm:text-base text-white/70 hover:text-white transition-colors inline-block py-1">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white/50 mb-4 sm:mb-6">
              Categories
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              <li>
                <Link to="/shop?occasion=birthday" className="text-sm sm:text-base text-white/70 hover:text-white transition-colors inline-block py-1">
                  Birthday Flowers
                </Link>
              </li>
              <li>
                <Link to="/shop?occasion=anniversary" className="text-sm sm:text-base text-white/70 hover:text-white transition-colors inline-block py-1">
                  Anniversary
                </Link>
              </li>
              <li>
                <Link to="/shop?occasion=wedding" className="text-sm sm:text-base text-white/70 hover:text-white transition-colors inline-block py-1">
                  Wedding
                </Link>
              </li>
              <li>
                <Link to="/shop?occasion=sympathy" className="text-sm sm:text-base text-white/70 hover:text-white transition-colors inline-block py-1">
                  Sympathy
                </Link>
              </li>
              <li>
                <Link to="/shop?type=plants" className="text-sm sm:text-base text-white/70 hover:text-white transition-colors inline-block py-1">
                  Plants
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white/50 mb-4 sm:mb-6">
              Contact Us
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-white/50 mt-1 flex-shrink-0" />
                <span className="text-sm sm:text-base text-white/70">
                  123 Bloom Street, Flower District<br />
                  Mumbai, 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-white/50 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-sm sm:text-base text-white/70 hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-white/50 flex-shrink-0" />
                <a href="mailto:hello@bloomtale.com" className="text-sm sm:text-base text-white/70 hover:text-white transition-colors break-all">
                  hello@bloomtale.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-5 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/50">
            <p className="text-center md:text-left">© {currentYear} Bloom Tale. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors py-1">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors py-1">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
