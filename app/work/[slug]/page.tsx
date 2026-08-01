import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPublication } from "../content.server";
import { SitePageRenderer } from "../site-page-renderer";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const publication = await getPublication((await params).slug);
  if (!publication) {
    return {
      title: "Page not found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title:
      publication.document.seo.title || publication.document.title,
    description:
      publication.document.seo.description ||
      publication.document.summary,
  };
}

export default async function PublishedWorkPage({ params }: PageProps) {
  const { slug } = await params;
  const publication = await getPublication(slug);

  if (!publication) {
    notFound();
  }

  return (
    <SitePageRenderer
      document={publication.document}
      slug={publication.slug}
      publishedAt={publication.publishedAt}
    />
  );
}
