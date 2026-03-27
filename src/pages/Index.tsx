import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Lightbulb, Mic, Film } from "lucide-react";

const categories = [
  { name: "Cameras", icon: Camera, count: 3, desc: "Full-frame bodies with cinema rigs" },
  { name: "Lenses", icon: Film, count: 11, desc: "Vintage and modern glass" },
  { name: "Lights", icon: Lightbulb, count: 6, desc: "Tungsten, LED, and COB lights" },
  { name: "Sound", icon: Mic, count: 5, desc: "Recorders, mics, and accessories" },
];

const Index = () => (
  <Layout>
    {/* Hero */}
<section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/images/hero_bg.PNG')" }}
  />
  <div className="absolute inset-0 bg-black/55" />
  <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(210_70%_55%/0.08),transparent_70%)]" />

      <div className="relative container mx-auto px-4 sm:px-6 text-center space-y-8">
        <div className="space-y-4 max-w-3xl mx-auto">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary animate-fade-in">
            Video and Audio Equipment Rental
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold tracking-tight text-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Gear that tells<br />
            <span className="text-gradient">your story</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Professional camera and film equipment for filmmakers, photographers, and creative productions. Browse, select, and book — simple as that.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button asChild size="lg" className="rounded-lg px-8 font-medium">
            <Link to="/catalog">
              Browse Catalog <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-lg px-8 font-medium border-border/50 text-foreground hover:bg-secondary">
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Categories */}
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-display font-bold text-foreground">Browse by Category</h2>
          <p className="text-muted-foreground">Find the right gear for your production</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/catalog?category=${cat.name}`}
              className="group p-6 rounded-lg border border-border/50 bg-card hover:border-primary/30 transition-all duration-300 card-glow hover:card-glow-hover"
            >
              <cat.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-display font-semibold text-foreground mb-1">{cat.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{cat.desc}</p>
              <span className="text-xs text-primary font-medium">{cat.count} items →</span>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Button asChild variant="outline" className="border-border/50 text-foreground hover:bg-secondary">
            <Link to="/catalog">View All Equipment</Link>
          </Button>
        </div>
      </div>
    </section>

    {/* Trust */}
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Curated Inventory", desc: "Every piece of gear is tested, maintained, and production-ready before it leaves our hands." },
            { title: "Transparent Pricing", desc: "Clear daily rates with no hidden fees. Replacement values listed upfront so you know exactly what you're renting." },
            { title: "Fast Turnaround", desc: "Submit an inquiry and hear back within 1–24 hours. We keep things moving so your production stays on schedule." },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-lg border border-border/30 bg-card/50 space-y-3">
              <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Index;
