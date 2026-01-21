import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react"
import { Link } from "react-router-dom"

export default function Footer({ isComboSidebarOpen = false }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#3e4026] text-white transition-all duration-300">
      {/* Main Footer */}
      <div 
        className={`
          mx-auto px-4 sm:px-6 transition-all duration-300
          ${
            isComboSidebarOpen 
              ? 'md:mr-[360px] md:px-8 py-12 md:py-14' 
              : 'max-w-7xl md:px-12 py-16 md:py-20'
          }
        `}
      >
        <div 
          className={`
            grid gap-8 transition-all duration-300
            ${
              isComboSidebarOpen
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'
            }
          `}
        >
          {/* Brand Column */}
          <div className={`lg:col-span-1 ${isComboSidebarOpen ? 'xl:col-span-1' : ''}`}>
            <Link to="/home" className="inline-block mb-3">
              <img 
                src="/BloomTaleLogopng(500x350px).png" 
                alt="Bloom Tale" 
                className={`w-auto object-contain brightness-0 invert transition-all duration-300 ${
                  isComboSidebarOpen ? 'h-12 md:h-14' : 'h-16'
                }`}
              />
            </Link>
            <p className={`text-white/60 leading-relaxed mb-4 transition-all duration-300 ${
              isComboSidebarOpen ? 'text-xs md:text-sm' : 'text-sm'
            }`}>
              Crafting beautiful moments with nature's finest blooms since 2010. 
              Every arrangement tells your unique story.
            </p>
            {/* Social Icons */}
            <div className={`flex gap-2 transition-all duration-300 ${
              isComboSidebarOpen ? 'gap-2' : 'gap-3'
            }`}>
              <a 
                href="#" 
                className={`border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#3e4026] transition-all duration-300 ${
                  isComboSidebarOpen ? 'w-8 h-8' : 'w-10 h-10'
                }`}
                aria-label="Instagram"
              >
                <Instagram size={isComboSidebarOpen ? 16 : 18} />
              </a>
              <a 
                href="#" 
                className={`border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#3e4026] transition-all duration-300 ${
                  isComboSidebarOpen ? 'w-8 h-8' : 'w-10 h-10'
                }`}
                aria-label="Facebook"
              >
                <Facebook size={isComboSidebarOpen ? 16 : 18} />
              </a>
              <a 
                href="#" 
                className={`border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#3e4026] transition-all duration-300 ${
                  isComboSidebarOpen ? 'w-8 h-8' : 'w-10 h-10'
                }`}
                aria-label="Twitter"
              >
                <Twitter size={isComboSidebarOpen ? 16 : 18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`tracking-[0.3em] uppercase text-white/50 transition-all duration-300 ${
              isComboSidebarOpen ? 'text-[10px] mb-4' : 'text-[11px] mb-6'
            }`}>
              Quick Links
            </h3>
            <ul className={`transition-all duration-300 ${
              isComboSidebarOpen ? 'space-y-2' : 'space-y-3'
            }`}>
              <li>
                <Link to="/shop" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/about" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/services" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/cart" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/faq" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/track-order" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className={`tracking-[0.3em] uppercase text-white/50 transition-all duration-300 ${
              isComboSidebarOpen ? 'text-[10px] mb-4' : 'text-[11px] mb-6'
            }`}>
              Categories
            </h3>
            <ul className={`transition-all duration-300 ${
              isComboSidebarOpen ? 'space-y-2' : 'space-y-3'
            }`}>
              <li>
                <Link to="/shop?category=Birthday" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  Birthday
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Anniversary" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  Anniversary
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Forever Flowers" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  Forever Flowers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Candles" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  Candles
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Premium" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  Premium
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Corporate" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  Corporate
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Combos" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  Combos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`tracking-[0.3em] uppercase text-white/50 transition-all duration-300 ${
              isComboSidebarOpen ? 'text-[10px] mb-4' : 'text-[11px] mb-6'
            }`}>
              Contact Us
            </h3>
            <ul className={`transition-all duration-300 ${
              isComboSidebarOpen ? 'space-y-3' : 'space-y-4'
            }`}>
              <li className={`flex items-start transition-all duration-300 ${
                isComboSidebarOpen ? 'gap-2' : 'gap-3'
              }`}>
                <MapPin size={isComboSidebarOpen ? 16 : 18} className="text-white/50 mt-0.5 flex-shrink-0" />
                <span className={`text-white/70 transition-all duration-300 ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  123 Bloom Street, Flower District<br />
                  Mumbai, 400001
                </span>
              </li>
              <li className={`flex items-center transition-all duration-300 ${
                isComboSidebarOpen ? 'gap-2' : 'gap-3'
              }`}>
                <Phone size={isComboSidebarOpen ? 16 : 18} className="text-white/50 flex-shrink-0" />
                <a href="tel:+919876543210" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  +91 98765 43210
                </a>
              </li>
              <li className={`flex items-center transition-all duration-300 ${
                isComboSidebarOpen ? 'gap-2' : 'gap-3'
              }`}>
                <Mail size={isComboSidebarOpen ? 16 : 18} className="text-white/50 flex-shrink-0" />
                <a href="mailto:hello@bloomtale.com" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-sm'
                }`}>
                  hello@bloomtale.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div 
          className={`
            mx-auto px-4 sm:px-6 transition-all duration-300
            ${
              isComboSidebarOpen 
                ? 'md:mr-[360px] md:px-8 py-4' 
                : 'max-w-7xl md:px-12 py-6'
            }
          `}
        >
          <div className={`flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 transition-all duration-300 ${
            isComboSidebarOpen ? 'text-xs' : 'text-sm'
          }`}>
            <p>© {currentYear} Bloom Tale. All rights reserved.</p>
            <div className={`flex transition-all duration-300 ${
              isComboSidebarOpen ? 'gap-4' : 'gap-6'
            }`}>
              <Link to="/privacy" className="hover:text-white transition-colors">
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
