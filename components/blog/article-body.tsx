import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { createHeadingSlugger, stripLeadingH1 } from "@/lib/blog";

/** Flatten a hast node to its text content, for deriving heading ids. */
function nodeText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { type?: string; value?: unknown; children?: unknown[] };
  if (n.type === "text" && typeof n.value === "string") return n.value;
  if (Array.isArray(n.children)) return n.children.map(nodeText).join("");
  return "";
}

const LINK_CLASSES =
  "font-medium text-primary underline decoration-1 underline-offset-2 transition-colors hover:text-primary/70";

/**
 * Renders a post's raw Markdown as styled, on-brand prose.
 *
 * The pipeline sanitizes on render (rehype-raw parses any embedded HTML, then
 * rehype-sanitize strips anything unsafe) — the backend stores content
 * unsanitized, so this is the XSS boundary. Headings receive scroll-margin ids
 * that stay in sync with the table of contents via a shared slugger.
 */
export function ArticleBody({ content }: { content: string }) {
  const slug = createHeadingSlugger();

  const components: Components = {
    h1({ children }) {
      // Any in-body H1 (beyond the stripped title) is demoted to a section head.
      return (
        <h2 className="mt-16 scroll-mt-28 font-heading text-h3 font-light text-balance text-foreground">
          {children}
        </h2>
      );
    },
    h2({ node, children }) {
      return (
        <h2
          id={slug(nodeText(node))}
          className="mt-16 scroll-mt-28 font-heading text-h3 font-light text-balance text-foreground"
        >
          {children}
        </h2>
      );
    },
    h3({ node, children }) {
      return (
        <h3
          id={slug(nodeText(node))}
          className="mt-10 scroll-mt-28 font-heading text-h4 font-normal text-balance text-foreground"
        >
          {children}
        </h3>
      );
    },
    h4({ children }) {
      return (
        <h4 className="mt-8 font-heading text-lead font-medium text-foreground">
          {children}
        </h4>
      );
    },
    p({ children }) {
      return (
        <p className="mt-6 text-body leading-[1.75] text-foreground/85">
          {children}
        </p>
      );
    },
    a({ href, children }) {
      const url = href ?? "";
      if (url.startsWith("/")) {
        return (
          <Link href={url} className={LINK_CLASSES}>
            {children}
          </Link>
        );
      }
      if (url.startsWith("#")) {
        return (
          <a href={url} className={LINK_CLASSES}>
            {children}
          </a>
        );
      }
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASSES}
        >
          {children}
        </a>
      );
    },
    strong({ children }) {
      return (
        <strong className="font-semibold text-foreground">{children}</strong>
      );
    },
    em({ children }) {
      return <em className="italic">{children}</em>;
    },
    ul({ children }) {
      return (
        <ul className="mt-6 space-y-2.5 [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.7em] [&>li]:before:h-1.5 [&>li]:before:w-1.5 [&>li]:before:rounded-full [&>li]:before:bg-gold">
          {children}
        </ul>
      );
    },
    ol({ children }) {
      return (
        <ol className="mt-6 list-decimal space-y-2.5 pl-5 marker:font-medium marker:text-primary">
          {children}
        </ol>
      );
    },
    li({ children }) {
      return (
        <li className="text-body leading-[1.75] text-foreground/85">
          {children}
        </li>
      );
    },
    blockquote({ children }) {
      return (
        <blockquote className="my-10 rounded-md bg-secondary/60 px-6 py-6 md:px-8 [&>p]:mt-0 [&>p]:font-heading [&>p]:text-lead [&>p]:font-light [&>p]:italic [&>p]:leading-relaxed [&>p]:text-foreground [&>p+p]:mt-4">
          {children}
        </blockquote>
      );
    },
    hr() {
      return <hr className="my-12 border-t border-border" />;
    },
    img({ src, alt, title }) {
      if (typeof src !== "string") return null;
      return (
        <figure className="my-8">
          {/* Content images have unknown intrinsic dimensions; a lazy native
              <img> avoids the distortion fixed next/image sizing would cause. */}
          {/* biome-ignore lint/performance/noImgElement: markdown images have no known dimensions for next/image */}
          <img
            src={src}
            alt={alt ?? ""}
            loading="lazy"
            decoding="async"
            className="w-full rounded-md bg-muted"
          />
          {title && (
            <figcaption className="mt-3 text-caption text-muted-foreground">
              {title}
            </figcaption>
          )}
        </figure>
      );
    },
    code({ children }) {
      return (
        <code className="rounded-sm bg-secondary px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
          {children}
        </code>
      );
    },
    pre({ children }) {
      return (
        <pre className="my-8 overflow-x-auto rounded-md bg-emerald p-5 text-small text-emerald-foreground [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-[0.85em] [&>code]:text-emerald-foreground">
          {children}
        </pre>
      );
    },
    table({ children }) {
      return (
        <div className="my-8 overflow-x-auto">
          <table className="w-full border-collapse text-small">
            {children}
          </table>
        </div>
      );
    },
    th({ children }) {
      return (
        <th className="border-b border-border px-3 py-2 text-left font-medium text-foreground">
          {children}
        </th>
      );
    },
    td({ children }) {
      return (
        <td className="border-b border-border/60 px-3 py-2 align-top text-foreground/85">
          {children}
        </td>
      );
    },
  };

  return (
    <div className="[&>*:first-child]:mt-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {stripLeadingH1(content)}
      </ReactMarkdown>
    </div>
  );
}
