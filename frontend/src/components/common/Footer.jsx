import { Facebook, Instagram, Twitter, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 mb-12 pb-12 border-b border-gray-300">
          {/* Left Section */}
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-gray-900 mb-3">Bloom Info</h3>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              Every flower tells a story. We craft emotional connections through nature's beautiful arrangements.
            </p>
          </div>

          {/* Right Section - Links */}
          <div className="grid grid-cols-2 gap-8 md:gap-12">
            {/* Explore */}
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-4 uppercase tracking-wide">Explore</h4>
              <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Subscription
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Collaboration
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Gallery
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-4 uppercase tracking-wide">Connect</h4>
              <p className="text-xs md:text-sm text-gray-700 mb-4">hello@bloomz.com</p>
              {/* Social Icons */}
              <div className="flex gap-4">
                <a href="#" className="text-gray-600 hover:text-gray-900 transition">
                  <Facebook size={18} />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition">
                  <Instagram size={18} />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition">
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-gray-600 gap-4">
          <p>© 2026 Bloomz. All rights reserved.</p>
          <div className="flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500" /> for flowers
          </div>
        </div>
      </div>
    </footer>
  )
}
