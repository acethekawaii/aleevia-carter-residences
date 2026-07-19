import Image from "next/image";

import { cn } from "@/lib/utils";

type CoverImageProps = {
  src: string | null | undefined;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/**
 * A post cover that always fills its (positioned) parent. When no image is
 * stored, it falls back to a warm emerald panel with the brass monogram, so a
 * post without a photo still reads as intentional rather than broken.
 */
export function CoverImage({
  src,
  alt,
  sizes,
  className,
  priority,
}: CoverImageProps) {
  if (!src) {
    return (
      <div
        aria-hidden
        className={cn(
          "flex h-full w-full items-center justify-center bg-emerald",
          className,
        )}
      >
        <span className="font-heading text-2xl font-light uppercase tracking-monogram text-gold">
          AC
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
