import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/50 bg-card/50">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground mb-3">SINESHARE</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Camera, lighting, audio, and production equipment rental for student filmmakers, photographers, and creative teams. Sineshare is run by a DLSU-Manila student, with gear curated for real school and indie shoots.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link to="/catalog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Gear</Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
            <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cart</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Contact</h4>
          <p className="text-sm text-muted-foreground">Reach out for inquiries and bookings.</p>
          <p className="text-sm text-primary mt-2">blue.r.bastasa@gmail.com or FB: "Bleu Bastasa" </p>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-border/50 text-center">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Sineshare. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
