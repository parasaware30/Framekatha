import { SiteLayout } from "@/components/SiteLayout";
import { Check, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function PricingPage() {
  const plans = [
    {
      name: "Silver Package",
      price: "₹65,000",
      desc: "Ideal for 1-day intimate wedding or pre-wedding celebration.",
      features: [
        "1 Senior Traditional Photographer",
        "1 Cinematic Videographer",
        "300+ Color Edited Photos",
        "3-5 min Teaser Video",
        "Digital High-Res Album"
      ],
      popular: false,
    },
    {
      name: "Gold Package",
      price: "₹1,25,000",
      desc: "Our most popular 2-day complete wedding coverage package.",
      features: [
        "2 Senior Candid Photographers",
        "2 Cinematographers + 4K Drone Operator",
        "600+ Edit Masterclass Photos",
        "15 min Full Cinema Film + 3 min Teaser",
        "2 Premium Hardcover Canvera Albums",
        "Raw footage on 1TB SSD"
      ],
      popular: true,
    },
    {
      name: "Platinum Royal",
      price: "₹2,50,000",
      desc: "Uncompromised 3-day luxury destination wedding production.",
      features: [
        "Full 5-Member Crew (Candid, Traditional, Cinema)",
        "FPV & 4K Aerial Drone Coverage",
        "Same-Day Edit Teaser for Reception",
        "Unlimited Edit Raw & Color Graded Shots",
        "3 Velvet Custom Hardcover Albums",
        "Pre-Wedding Shoot at Destination included"
      ],
      popular: false,
    }
  ];

  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold font-display">Transparent <span className="gradient-text">Pricing</span></h1>
          <p className="text-slate-400 mt-2 text-sm">Choose the perfect photography package for your special occasion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map(p => (
            <div
              key={p.name}
              className={`glass-strong rounded-3xl p-8 flex flex-col relative transition-all duration-300 ${
                p.popular ? "border-2 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.25)]" : "border border-white/10"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-[10px] font-extrabold uppercase tracking-widest text-white flex items-center gap-1">
                  <Sparkles className="size-3" /> Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold font-display">{p.name}</h3>
              <p className="text-xs text-slate-400 mt-2 min-h-[32px]">{p.desc}</p>
              <div className="my-6">
                <span className="text-4xl font-extrabold gradient-text font-display">{p.price}</span>
                <span className="text-xs text-slate-400 ml-1">/ event</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 mb-8 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="size-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/booking" className={p.popular ? "btn-neon w-full text-center" : "btn-ghost-neon w-full text-center"}>
                Book This Package
              </Link>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
