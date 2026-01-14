import Header from "../components/common/Header"
import SubHeader from "../components/common/SubHeader"
import Hero from "../components/HomePage/Hero"
import BestsellingBlooms from "../components/HomePage/BestsellingBlooms"
import Footer from "../components/common/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#EDE8E0]">
      <Header />
      <SubHeader />
      <Hero />
      <BestsellingBlooms />
      <Footer />
    </div>
  )
}
