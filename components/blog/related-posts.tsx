import { PostCard } from "@/components/blog/post-card";
import { Reveal } from "@/components/ui/reveal";
import type { PostCard as PostCardType } from "@/lib/blog";

/**
 * "Continue reading" — up to three sibling stories below an article. Renders
 * nothing when there are no other posts; the page shows a Journal link instead.
 */
export function RelatedPosts({ posts }: { posts: PostCardType[] }) {
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="border-t border-border bg-secondary/25"
    >
      <div className="main-container py-16 md:py-20">
        <Reveal>
          <h2
            id="related-heading"
            className="font-heading text-h3 font-light text-foreground"
          >
            Continue reading
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.id} delay={index * 0.08}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
