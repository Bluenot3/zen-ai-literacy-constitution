import type { Metadata } from "next";
import { ManagedZenPageRenderer } from "./managed-page-renderer";
import { hasRenderableManagedZenPage } from "./managed-pages";
import {
  getManagedZenHome,
  listManagedZenNavigation,
} from "./managed-pages.server";
import ZenHub from "./zen-hub";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "ZEN AI Co. | Intelligence Into Capability" },
  description:
    "The ZEN AI ecosystem gateway for build-first AI education, Arsenal-powered execution, and proof of real capability.",
};

export default async function Home() {
  const [managedHome, managedNavigation] = await Promise.all([
    getManagedZenHome(),
    listManagedZenNavigation(),
  ]);

  if (hasRenderableManagedZenPage(managedHome)) {
    return (
      <ManagedZenPageRenderer
        page={managedHome}
        navigation={managedNavigation}
      />
    );
  }

  return <ZenHub managedNavigation={managedNavigation} />;
}
