"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { MapPin, Building2, ShoppingBag, Cross, GraduationCap, Church, Clock } from "lucide-react";
interface NearbyPlace {
  name: string;
  distance: string;
  time: string;
}
interface Category {
  title: string;
  icon: React.ReactNode;
  places: NearbyPlace[];
}
const categories: Category[] = [
  {
    title: "Supermarkets",
    icon: <ShoppingBag className="w-4 h-4" />,
    places: [
      { name: "Puregold Libertad", distance: "0.9 km", time: "4 mins" },
      { name: "H.A Grocery Store", distance: "1.0 km", time: "5 mins" },
      { name: "Metro Supermarket", distance: "1.5 km", time: "7 mins" },
      { name: "Liana's Supermarket — Taft", distance: "1.8 km", time: "8 mins" },
    ],
  },
  {
    title: "Commercial",
    icon: <Building2 className="w-4 h-4" />,
    places: [
      { name: "Victory Pasay Mall", distance: "1.1 km", time: "6 mins" },
      { name: "Metropoint Mall", distance: "1.9 km", time: "9 mins" },
      { name: "SM Mall of Asia", distance: "4.5 km", time: "15 mins" },
      { name: "S Maison", distance: "5.0 km", time: "22 mins" },
    ],
  },
  {
    title: "Hospitals",
    icon: <Cross className="w-4 h-4" />,
    places: [
      { name: "Metro Pasay Hospital & Medical Center", distance: "0.7 km", time: "4 mins" },
      { name: "Pasay City General Hospital", distance: "1.3 km", time: "7 mins" },
      { name: "Adventist Medical Center Manila", distance: "2.1 km", time: "9 mins" },
      { name: "San Juan De Dios Hospital", distance: "2.5 km", time: "12 mins" },
    ],
  },
  {
    title: "Schools",
    icon: <GraduationCap className="w-4 h-4" />,
    places: [
      { name: "Juan Sumulong Elementary School", distance: "0.5 km", time: "3 mins" },
      { name: "Pasay City East High School", distance: "0.9 km", time: "5 mins" },
      { name: "Padre Zamora Elementary School", distance: "1.1 km", time: "6 mins" },
      { name: "Arellano University — Jose Abad Santos", distance: "2.3 km", time: "11 mins" },

    ],
  },
  {
    title: "Churches",
    icon: <Church className="w-4 h-4" />,
    places: [
      { name: "Bible Baptist Church of Pasay", distance: "0.4 km", time: "2 mins" },
      { name: "Jesus Christ Pasay Blessing Church", distance: "0.6 km", time: "3 mins" },
      { name: "San Roque De Pasay Church", distance: "0.8 km", time: "4 mins" },
      { name: "Baclaran Church", distance: "5.5 km", time: "17 mins" },
    ],
  },
];
export function LocationSection() {
  return (
    <section className="bg-background py-28 md:py-40 border-t border-zinc-200">
      <div className="main-container">
        <div className="space-y-16 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-20">
          {/* Left — Map + Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <p className="text-[0.7rem] tracking-[0.3em] uppercase text-muted-foreground font-medium mb-4">
              Location
            </p>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-[3.2rem] font-semibold tracking-tight text-foreground leading-[1.1] mb-8">
              Come Home Here
            </h2>
            {/* Location Map Graphic - Glassmorphism */}
            <div className="relative w-full aspect-[4/3] rounded-xl lg:rounded-2xl overflow-hidden mb-10 border border-white/30 shadow-xl shadow-[#8A9082]/20 bg-[#8A9082]/85 backdrop-blur-xl">
              {/* Glass lighting effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20 pointer-events-none" />
              
              <Image
                src="/assets/map.png"
                alt="Aleevia Carter Residences neighborhood map"
                width={1200}
                height={900}
                priority
                className="w-full h-full object-cover sm:object-contain object-center drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)] opacity-95 relative z-10"
              />
            </div>
            <div className="space-y-5 text-muted-foreground leading-relaxed text-base">
              <p className="text-justify">
                Aleevia Carter Residences is strategically situated along the Rodriguez corridor, one of Pasay City&rsquo;s most vital urban pockets. Positioned at the nexus of the metropolis&rsquo; primary transit lifelines and major thoroughfares, the residence offers a level of connectivity that effortlessly bridges the gap between the city&rsquo;s key business districts and the international gateway.
              </p>
              <p className="text-justify">
                By offering a front-row seat to the best of the city&rsquo;s world-class shopping, dining, and cultural landmarks, Aleevia Carter Residences provides a rare vantage point where convenience is the standard and the entire metro is your backyard.
              </p>
            </div>
          </motion.div>
          {/* Right — Nearby Landmarks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-2 mb-8">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-heading text-xl md:text-3xl font-semibold tracking-tight text-foreground">
                Close to the City, Closer to Home
              </h3>
            </div>
            <div className="space-y-8">
              {categories.map((cat) => (
                <div key={cat.title}>
                  {/* Category Header */}
                  <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 mb-4">
                    <span className="text-muted-foreground">{cat.icon}</span>
                    <h4 className="text-xs tracking-[0.2em] uppercase font-semibold text-foreground">
                      {cat.title}
                    </h4>
                  </div>
                  {/* Places List */}
                  <div className="space-y-2.5">
                    {cat.places.map((place) => (
                      <div
                        key={place.name}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <span className="text-foreground truncate flex-1">
                          {place.name}
                        </span>
                        <div className="flex items-center gap-4 sm:gap-5 text-muted-foreground shrink-0">
                          <span className="w-14 sm:w-16 text-right tabular-nums whitespace-nowrap">{place.distance}</span>
                          <span className="flex items-center justify-start gap-2 w-16 sm:w-20 tabular-nums whitespace-nowrap">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            {place.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}