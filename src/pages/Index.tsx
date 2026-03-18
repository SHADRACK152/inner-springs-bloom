import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import HeroSlider from "@/components/HeroSlider";
import PillarCards from "@/components/PillarCards";
import SocialProof from "@/components/SocialProof";
import CTASection from "@/components/CTASection";
import { Link } from "react-router-dom";
import aboutTeam from "@/assets/about-team.jpg";

const Index = () => (
  <>
    <Navbar />
    <main className="pt-16 md:pt-20">
      <HeroSlider />

      <PillarCards />

      {/* Why Inner Springs */}
      <section className="section-spacing bg-card">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-display text-sm font-semibold text-accent uppercase tracking-wider mb-3">Why Inner Springs Africa?</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">Globally Certified. Ethically Grounded. Results Driven.</h2>
              <p className="font-body text-muted-foreground text-balance mb-6">
                Our multidisciplinary team is internationally credentialed and locally licensed — including ICF-certified coaches, counselors and psychologists regulated by the Kenya Counsellors and Psychologists Board, and professionals certified by ISP, TVET, and NITA.
              </p>
              <p className="font-body text-muted-foreground text-balance mb-8">
                We serve NGOs, MSMEs, faith-based communities, and schools with expert, ethical, and impact-focused support you can trust.
              </p>
              <Link to="/about" className="btn-primary inline-block">Learn About Us</Link>
            </div>
            <div>
              <img src={aboutTeam} alt="Inner Springs Africa team in Nairobi" className="image-frame w-full h-auto rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      <SocialProof />
      <CTASection />
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default Index;
