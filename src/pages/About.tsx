import Layout from "@/components/Layout";
import { Mail, MapPin, Clock } from "lucide-react";

const About = () => (
  <Layout>
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-16 max-w-4xl">
      {/* About */}
      <section className="space-y-6">
        <h1 className="text-3xl font-display font-bold text-foreground">About Sineshare</h1>
        <p className="text-muted-foreground leading-relaxed">
          Sineshare is a camera rental service in Manila built for students, student filmmakers, and small creative teams who need reliable gear without overspending.
           </p>
           <p className="text-muted-foreground leading-relaxed">
I started Sineshare as a computer engineering student after seeing how difficult it was for students to access good camera equipment at fair rates. Most of the time, the options were either too expensive, hard to book, or unclear about what was actually included.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Our goal is simple: make camera rentals easier, more affordable, and more trustworthy for people creating school projects, short films, content, and passion projects around Manila.
        </p>
            <p className="text-muted-foreground leading-relaxed">
          Every item in our catalog is checked before release, clearly listed, and priced transparently. We also keep the process straightforward, from inquiry to pickup, so you know exactly what to expect.

          Whether you’re shooting your thesis, a class requirement, or your next creative project, Sineshare is here to help you get the gear you need without the usual hassle.
        </p>
      </section>

      {/* How it works */}
      <section className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-foreground">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Browse & Select", desc: "Explore our catalog, filter by category, and add the gear you need to your cart." },
            { step: "02", title: "Submit Inquiry", desc: "Fill out the booking form with your dates and contact details. We'll confirm availability." },
            { step: "03", title: "Pick Up & Shoot", desc: "Collect your gear on the pickup date. Return it when your shoot wraps." },
          ].map((s) => (
            <div key={s.step} className="p-6 rounded-lg border border-border/30 bg-card/50 space-y-3">
              <span className="text-2xl font-display font-bold text-primary/40">{s.step}</span>
              <h3 className="font-display font-semibold text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-foreground">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3 p-5 rounded-lg border border-border/50 bg-card">
            <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">Email</h4>
              <p className="text-sm text-muted-foreground">blue.r.bastasa@gmail.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-5 rounded-lg border border-border/50 bg-card">
            <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">Response Time</h4>
              <p className="text-sm text-muted-foreground">Within 1–24 hours</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-5 rounded-lg border border-border/50 bg-card">
            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">DLSU, Taft Avenue, Manila</h4>
              <p className="text-sm text-muted-foreground">Philippines</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </Layout>
);

export default About;
