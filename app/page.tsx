import type { Metadata } from "next";
import { ManagedZenPageRenderer } from "./managed-page-renderer";
import { hasRenderableManagedZenPage } from "./managed-pages";
import {
  getManagedZenHome,
  listManagedZenNavigation,
} from "./managed-pages.server";
import { getManagedZenResources, getZenHomepageResources } from "./managed-resources.server";
import ZenHub from "./zen-hub";
import { getZenSiteControl } from "./site-control.server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getZenSiteControl();
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: seo.canonical },
    openGraph: {
      type: "website",
      url: seo.canonical,
      title: seo.title,
      description: seo.description,
      images: [{ url: seo.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
    },
  };
}

export default async function Home() {
  const [managedHome, managedNavigation, siteControl] = await Promise.all([
    getManagedZenHome(),
    listManagedZenNavigation(),
    getZenSiteControl(),
  ]);

  if (hasRenderableManagedZenPage(managedHome)) {
    const resources = await getManagedZenResources(managedHome);
    return (
      <ManagedZenPageRenderer
        page={managedHome}
        navigation={managedNavigation}
        resources={resources}
      />
    );
  }

  const homepageResources = await getZenHomepageResources(siteControl.homepage);
  return (
    <ZenHub
      managedNavigation={managedNavigation}
      siteControl={siteControl}
      resources={homepageResources}
    />
  );
}
