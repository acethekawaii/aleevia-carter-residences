"use client";
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
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
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
            {/* Embedded Google Map */}
            <div className="relative w-full aspect-[4/3] bg-zinc-100 overflow-hidden mb-10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.8!2d120.9974!3d14.5378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9e3b3d3d3d3%3A0x0!2sPasay%2C+Metro+Manila!5e0!3m2!1sen!2sph!4v1710000000000!5m2!1sen!2sph"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Aleevia Carter Residences location map"
                className="absolute inset-0"
              />
            </div>
            <div className="space-y-5 text-muted-foreground leading-relaxed text-base">
              <p>
                Aleevia Carter Residences is strategically situated along the Rodriguez corridor, one of Pasay City&rsquo;s most vital urban pockets. Positioned at the nexus of the metropolis&rsquo; primary transit lifelines and major thoroughfares, the residence offers a level of connectivity that effortlessly bridges the gap between the city&rsquo;s key business districts and the international gateway.
              </p>
              <p>
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
              <h3 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
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
                        <div className="flex items-center gap-4 text-muted-foreground shrink-0">
                          <span className="w-16 text-right tabular-nums">{place.distance}</span>
                          <span className="flex items-center gap-1 w-16 text-right tabular-nums">
                            <Clock className="w-3 h-3" />
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