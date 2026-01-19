import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ArrowRight } from "lucide-react"

export default function CorporateEvents() {
    const [isHovered, setIsHovered] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    const categories = [
        "Engagement programs",
        "Training & workshops",
        "Brand activations",
        "Product launches",
        "Annual day",
        "Gala dinner",
        "Award nights",
        "Corporate offsites",
        "ATL & BTL events"
    ]

    return (
        <>
            {/* Card View */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsExpanded(true)}
                className="relative group cursor-pointer overflow-hidden rounded-sm shadow-lg hover:shadow-2xl transition-all duration-500"
            >
                {/* Image */}
                <div className="relative h-64 sm:h-72 md:h-80 bg-gradient-to-br from-blue-50 to-cyan-100">
                    <div className="absolute inset-0">
                        <img
                            src="/corporate-services.jpg"
                            alt="Corporate Services"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Badge */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#3e4026] text-white px-2.5 py-1 sm:px-3 text-xs font-medium">
                        Professional
                    </div>
                </div>

                {/* Title Section */}
                <div className="bg-white p-6">
                    <h3
                        className="text-2xl text-[#3e4026] mb-2 flex items-center justify-between"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        Corporate
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </h3>
                    <p className="text-gray-600 text-sm">Professional excellence</p>
                </div>

                {/* Hover Overlay */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-[#3e4026]/95 text-white p-6 flex flex-col justify-center"
                        >
                            <h4 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Our Services
                            </h4>
                            <ul className="space-y-2">
                                {categories.slice(0, 4).map((category, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                        {category}
                                    </motion.li>
                                ))}
                                {categories.length > 4 && (
                                    <li className="text-sm text-white/80 mt-2">+ {categories.length - 4} more</li>
                                )}
                            </ul>
                            <p className="text-xs text-white/80 mt-4">Click to view details</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Expanded Modal */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsExpanded(false)}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-4xl text-[#3e4026] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                                            Corporate Events
                                        </h3>
                                        <p className="text-gray-600">Professional event management for your business</p>
                                    </div>
                                    <button
                                        onClick={() => setIsExpanded(false)}
                                        className="text-gray-500 hover:text-gray-700 text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {categories.map((category, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-all">
                                            <ArrowRight size={16} className="text-[#3e4026]" />
                                            <span className="text-gray-700">{category}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className="w-full bg-[#3e4026] text-white py-3 rounded-lg font-semibold hover:bg-[#2d2f1c] transition-colors"
                                    onClick={() => setIsExpanded(false)}
                                >
                                    Get Quote
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
