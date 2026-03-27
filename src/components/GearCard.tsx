import { Link } from "react-router-dom";
import { GearItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface GearCardProps {
  gear: GearItem;
}

const GearCard = ({ gear }: GearCardProps) => (
  <Link
    to={`/catalog/${gear.id}`}
    className="group block rounded-lg border border-border/50 bg-card overflow-hidden card-glow hover:card-glow-hover transition-all duration-300"
  >
    <div className="aspect-[4/3] bg-muted/30 overflow-hidden">
      <img
        src={gear.image_url}
        alt={gear.item_name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <div className="p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {gear.item_name}
        </h3>
        <Badge
          variant={gear.status === "Available" ? "default" : "secondary"}
          className={`text-[10px] shrink-0 ${gear.status === "Available" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : ""}`}
        >
          {gear.status}
        </Badge>
      </div>
      {gear.short_description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{gear.short_description}</p>
      )}
      <div className="flex items-center justify-between pt-1">
        {gear.daily_rate_php ? (
          <span className="text-sm font-display font-bold text-primary">
            ₱{gear.daily_rate_php.toLocaleString()}<span className="text-xs text-muted-foreground font-normal">/day</span>
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Bundled / Inquire</span>
        )}
        <span className="text-[10px] text-muted-foreground">{gear.category}</span>
      </div>
    </div>
  </Link>
);

export default GearCard;
