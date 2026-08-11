const RETIRED_SURFACE_PATTERN = /\bus\.zenai\.biz\b|\barena\b/i;

const searchableText = (value: unknown) => {
  if (typeof value === "string") return value;

  try {
    return JSON.stringify(value) ?? "";
  } catch {
    return "";
  }
};

export const containsRetiredZenSurface = (...values: unknown[]) =>
  values.some((value) => RETIRED_SURFACE_PATTERN.test(searchableText(value)));
