import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const articles = [
  { title: "Understanding Workplace Burnout: Signs & Solutions", category: "Mental Health", date: "March 2026", excerpt: "Learn to identify early signs of burnout and evidence-based strategies to restore balance and productivity in your workplace." },
  { title: "The Power of Coaching in Leadership Development", category: "Coaching", date: "February 2026", excerpt: "How executive coaching transforms leadership capabilities and drives organizational growth in the African business landscape." },
  { title: "Building Resilience in Youth: A Guide for Parents", category: "Youth Mental Health", date: "January 2026", excerpt: "Practical tools and strategies for parents to support their children's emotional wellbeing and build lasting resilience." },
  { title: "Faith & Mental Health: Breaking the Stigma", category: "Faith-Based", date: "December 2025", excerpt: "Exploring the intersection of faith and mental health in African communities, and why seeking help is a sign of strength." },
  { title: "Sales Psychology: Ethical Influence in Business", category: "Training", date: "November 2025", excerpt: "Understanding consumer behavior and building authentic client relationships through ethical, consultative selling approaches." },
  { title: "Trauma-Informed Workplaces: A Framework", category: "Corporate Wellness", date: "October 2025", excerpt: "Creating psychologically safe work environments with practical trauma-informed policies and practices for organizations." },
];

const Resources = () => (
  <>
    <Navbar />
    <main className="pt-16 md:pt-20">
      <section className="section-spacing bg-muted">
        <div className="container-main text-center">
          <h1 className="text-primary mb-6">Resources & Insights</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg text-balance">
            Expert articles, guides, and insights on mental health, coaching, and professional development.
          </p>
        </div>
      </section>

      <section className="section-spacing bg-background">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <article key={i} className="card-surface bg-card rounded-lg overflow-hidden group cursor-pointer">
                <div className="h-2 bg-primary" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded">{article.category}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{article.date}</span>
                  </div>
                  <h3 className="text-foreground text-xl mb-3 group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="text-muted-foreground text-sm text-balance mb-4">{article.excerpt}</p>
                  <span className="text-primary text-sm font-medium inline-flex items-center gap-1 group-hover:underline">
                    Read More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-primary">
        <div className="container-main text-center">
          <h2 className="text-primary-foreground mb-4">Stay Updated</h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8 text-balance">
            Subscribe to our newsletter for the latest insights on mental health, coaching, and professional development.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-lg text-sm text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-accent" />
            <button className="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:brightness-110 transition">Subscribe</button>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default Resources;
