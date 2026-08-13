import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

function gitSha() {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return process.env.CF_PAGES_COMMIT_SHA ?? process.env.GITHUB_SHA ?? "UNKNOWN";
  }
}

const outputDirectory = resolve("public");
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(resolve(outputDirectory, "release.json"), `${JSON.stringify({
  sha: gitSha(),
  releaseId: process.env.CF_PAGES_DEPLOYMENT_ID ?? process.env.RELEASE_ID ?? null,
  environment: process.env.CF_PAGES_BRANCH ? "production" : process.env.NODE_ENV ?? "development",
  builtAt: new Date().toISOString(),
}, null, 2)}\n`, "utf8");
