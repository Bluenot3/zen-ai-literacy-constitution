import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ManagedZenPageRenderer } from "../managed-page-renderer";
import {
  getManagedZenPage,
  listManagedZenNavigation,
} from "../managed-pages.server";
import { getManagedZenResources } from "../managed-resources.server";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getManagedZenPage((await params).slug);
  if (!page) {
    return {
      title: "Page not found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: page.title,
    description: page.description || undefined,
  };
}

export default async function ManagedZenWorldPage({ params }: PageProps) {
  const { slug } = await params;
  const [page, navigation] = await Promise.all([
    getManagedZenPage(slug),
    listManagedZenNavigation(),
  ]);

  if (!page) notFound();
  const resources = await getManagedZenResources(page);

  return <ManagedZenPageRenderer page={page} navigation={navigation} resources={resources} />;
}
