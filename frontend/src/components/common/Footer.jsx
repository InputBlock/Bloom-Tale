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
              ? 'md:mr-[360px] md:px-8 py-8 md:py-14' 
              : 'max-w-7xl md:px-12 py-8 md:py-20'
          }
        `}
      >
        <div 
          className={`
            grid gap-6 md:gap-8 transition-all duration-300
            ${
              isComboSidebarOpen
                ? 'grid-cols-1 lg:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 md:gap-12'
            }
          `}
        >
          {/* Brand Column */}
          <div className={`${isComboSidebarOpen ? '' : ''}`}>
            <Link to="/home" className="inline-block mb-2">
              <img 
                src="/BloomTaleLogopng(500x350px).png" 
                alt="Bloom Tale" 
                className={`w-auto object-contain brightness-0 invert transition-all duration-300 ${
                  isComboSidebarOpen ? 'h-10 md:h-14' : 'h-12 md:h-16'
                }`}
              />
            </Link>
            <p className={`text-white/60 leading-relaxed mb-3 transition-all duration-300 ${
              isComboSidebarOpen ? 'text-xs md:text-sm' : 'text-xs md:text-sm'
            }`}>
              Crafting beautiful moments with nature's finest blooms since 2010. 
              Every arrangement tells your unique story.
            </p>
            {/* Social Icons */}
            <div className={`flex gap-2 transition-all duration-300 ${
              isComboSidebarOpen ? 'gap-2' : 'gap-2 md:gap-3'
            }`}>
              <a 
                href="https://www.instagram.com/bloomtale1?igsh=cGJmemNiNHk5N2tz" 
                target="_blank"
                rel="noopener noreferrer"
                className={`border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#3e4026] transition-all duration-300 ${
                  isComboSidebarOpen ? 'w-8 h-8' : 'w-9 h-9 md:w-10 md:h-10'
                }`}
                aria-label="Instagram"
              >
                <Instagram size={isComboSidebarOpen ? 16 : 16} />
              </a>
              <a 
                href="#" 
                className={`border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#3e4026] transition-all duration-300 ${
                  isComboSidebarOpen ? 'w-8 h-8' : 'w-9 h-9 md:w-10 md:h-10'
                }`}
                aria-label="Facebook"
              >
                <Facebook size={isComboSidebarOpen ? 16 : 16} />
              </a>
              <a 
                href="https://x.com/bloom_tale" 
                target="_blank"
                rel="noopener noreferrer"
                className={`border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#3e4026] transition-all duration-300 ${
                  isComboSidebarOpen ? 'w-8 h-8' : 'w-9 h-9 md:w-10 md:h-10'
                }`}
                aria-label="Twitter"
              >
                <Twitter size={isComboSidebarOpen ? 16 : 16} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="">
            <h3 className={`tracking-[0.3em] uppercase text-white/50 transition-all duration-300 ${
              isComboSidebarOpen ? 'text-[10px] mb-3' : 'text-[10px] md:text-[11px] mb-3 md:mb-6'
            }`}>
              Contact Us
            </h3>
            <ul className={`transition-all duration-300 ${
              isComboSidebarOpen ? 'space-y-2.5' : 'space-y-2.5 md:space-y-4'
            }`}>
              <li className={`flex items-start transition-all duration-300 ${
                isComboSidebarOpen ? 'gap-2' : 'gap-2 md:gap-3'
              }`}>
                <MapPin size={isComboSidebarOpen ? 16 : 16} className="text-white/50 mt-0.5 flex-shrink-0" />
                <span className={`text-white/70 transition-all duration-300 ${
                  isComboSidebarOpen ? 'text-xs' : 'text-xs md:text-sm'
                }`}>
                  123 Bloom Street, Flower District<br />
                  Mumbai, 400001
                </span>
              </li>
              <li className={`flex items-center transition-all duration-300 ${
                isComboSidebarOpen ? 'gap-2' : 'gap-2 md:gap-3'
              }`}>
                <Phone size={isComboSidebarOpen ? 16 : 16} className="text-white/50 flex-shrink-0" />
                <a href="tel:+919876543210" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-xs md:text-sm'
                }`}>
                  +91 90822 36396
                </a>
              </li>
              <li className={`flex items-center transition-all duration-300 ${
                isComboSidebarOpen ? 'gap-2' : 'gap-2 md:gap-3'
              }`}>
                <Mail size={isComboSidebarOpen ? 16 : 16} className="text-white/50 flex-shrink-0" />
                <a href="mailto:hello@bloomtale.com" className={`text-white/70 hover:text-white transition-colors ${
                  isComboSidebarOpen ? 'text-xs' : 'text-xs md:text-sm'
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
                ? 'md:mr-[360px] md:px-8 py-3' 
                : 'max-w-7xl md:px-12 py-4 md:py-6'
            }
          `}
        >
          <div className={`flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-white/50 transition-all duration-300 ${
            isComboSidebarOpen ? 'text-xs' : 'text-xs md:text-sm'
          }`}>
            <p>© {currentYear} Bloom Tale. All rights reserved.</p>
            <div className={`flex transition-all duration-300 ${
              isComboSidebarOpen ? 'gap-3' : 'gap-4 md:gap-6'
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
