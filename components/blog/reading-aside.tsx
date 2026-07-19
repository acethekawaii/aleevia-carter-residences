import { ArticleToc } from "@/components/blog/article-toc";
import { BookingCard } from "@/components/blog/booking-card";
import type { TocItem } from "@/lib/blog";

/**
 * Desktop reading rail: a sticky table of contents over a persistent booking
 * invitation. Hidden below lg, where the same booking card renders inline.
 */
export function ReadingAside({ toc }: { toc: TocItem[] }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 flex flex-col gap-8">
        <ArticleToc items={toc} />
        <BookingCard />
      </div>
    </aside>
  );
}
