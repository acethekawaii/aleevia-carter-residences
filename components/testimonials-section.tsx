"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
const YOUTUBE_VIDEO_ID = "Obaq2ddTYRs";
interface TestimonialItem {
  type: "video" | "text";
  videoId?: string;
  videoLabel?: string;
  videoTitle?: string;
  quote?: string;
  author: string;
  role: string;
}
const testimonials: TestimonialItem[] = [
  {
    type: "video",
    videoId: YOUTUBE_VIDEO_ID,
    videoLabel: "Homeowner Story",
    videoTitle: "Why We Chose Aleevia Carter",
    author: "Jonathan Pierce",
    role: "Early Resident",
  },
  {
    type: "text",
    quote:
      "A seamless blend of luxurious tranquility and modern convenience. It's not just a residence; it's a daily retreat. The attention to detail and intelligent use of space makes every corner feel purposeful.",
    author: "Samantha Hayes",
    role: "Early Resident"
  },
  {
    type: "video",
    videoId: YOUTUBE_VIDEO_ID,
    videoLabel: "Design Walkthrough",
    videoTitle: "A Closer Look Inside",
    author: "David Lim",
    role: "Interior Design Weekly",
  },
  {
    type: "text",
    quote:
      "The mezzanine layout is breathtaking. The natural light cascade transforms the living area into something extraordinary. This is architecture that truly understands how people live.",
    author: "Maria Santos",
    role: "Architectural Digest PH",
  }
];  

function VideoThumbnail({ videoId, label, title }: { videoId: string; label?: string; title?: string }) {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  if (playing) {
    return (
      <div className="relative w-full h-full bg-black">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title || "Video testimonial"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }
  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative w-full h-full group cursor-pointer bg-zinc-900"
      aria-label={`Play ${title || "video"}`}
    >
      {/* YouTube thumbnail */}
      <img
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt={title || "Video thumbnail"}
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
      />
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 flex items-center justify-center group-hover:bg-white transition-colors">
          <Play className="w-6 h-6 md:w-8 md:h-8 text-zinc-900 ml-1" fill="currentColor" />
        </div>
      </div>
      {/* Caption overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/80 to-transparent">
        {label && (
          <p className="text-[0.65rem] tracking-[0.25em] uppercase text-white/60 font-medium mb-1">
            {label}
          </p>
        )}
        {title && (
          <p className="text-white font-heading text-lg md:text-xl font-semibold tracking-tight">
            {title}
          </p>
        )}
      </div>
    </button>
  );
}

export function TestimonialsSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);
  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api, onSelect]);
  function scrollPrev() { api?.scrollPrev(); }
  function scrollNext() { api?.scrollNext(); }
  return (
    <section className="bg-background py-28 md:py-40 border-t border-zinc-200">
      <div className="main-container">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-14 md:mb-20">
          <div>
            <p className="text-[0.7rem] tracking-[0.3em] uppercase text-muted-foreground font-medium mb-4">
              Testimonials
            </p>
            <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
              A Legacy of Excellence
            </h2>
          </div>
          {/* Navigation arrows */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 transition-colors"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-4 h-4 text-foreground" />
            </button>
            <button
              onClick={scrollNext}
              className="w-10 h-10 border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 transition-colors"
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-width carousel */}
      <div className="main-container">
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {testimonials.map((item, idx) => (
              <CarouselItem
                key={idx}
                className="pl-4 md:pl-6 basis-[85%] md:basis-[70%] lg:basis-[55%]"
              >
                {item.type === "video" ? (
                  /* VIDEO TESTIMONIAL */
                  <div className="flex flex-col">
                    <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                      <VideoThumbnail
                        videoId={item.videoId!}
                        label={item.videoLabel}
                        title={item.videoTitle}
                      />
                    </div>
                    <div className="mt-5">
                      <p className="text-sm font-semibold tracking-[0.1em] uppercase text-foreground">
                        {item.author}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.role}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* TEXT TESTIMONIAL */
                  <div className="flex flex-col justify-between h-full bg-zinc-50 border border-zinc-200 p-8 md:p-10 lg:p-12">
                    <div>
                      <p className="text-4xl md:text-5xl font-heading font-bold text-zinc-200 leading-none select-none mb-6">
                        &ldquo;
                      </p>
                      <p className="font-heading text-lg md:text-xl lg:text-2xl font-medium text-foreground leading-relaxed tracking-tight">
                        {item.quote}
                      </p>
                    </div>
                    <div className="mt-10 pt-6 border-t border-zinc-200">
                      <p className="text-sm font-semibold tracking-[0.1em] uppercase text-foreground">
                        {item.author}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.role}
                      </p>
                    </div>
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* Mobile navigation */}
        <div className="flex md:hidden items-center justify-center gap-4 mt-8">
          <button
            onClick={scrollPrev}
            className="w-10 h-10 border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 transition-colors"
            aria-label="Previous testimonial"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            {testimonials.map((_, idx) => (
              <span
                key={idx}
                className={`transition-all duration-300 block ${
                  idx === current
                    ? "w-6 h-1.5 bg-foreground"
                    : "w-1.5 h-1.5 bg-zinc-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={scrollNext}
            className="w-10 h-10 border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 transition-colors"
            aria-label="Next testimonial"
          >
            <ArrowRight className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
}