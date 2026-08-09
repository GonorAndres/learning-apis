export const MAIN_NAV_LINKS = [
  { id: "start-here", key: "startHere", color: "text-accent-blue" },
  { id: "what-is-api", key: "concept", color: "text-accent-blue" },
  { id: "try-it", key: "playground", color: "text-accent-emerald" },
  { id: "why-care", key: "analysis", color: "text-accent-amber" },
  { id: "build-own", key: "build", color: "text-accent-indigo" },
] as const;

export const ADVANCED_NAV_LINKS = [
  { id: "race", key: "labRace", color: "text-accent-blue" },
  { id: "chaos", key: "labChaos", color: "text-red-400" },
  { id: "debugger", key: "labDebug", color: "text-accent-indigo" },
  { id: "heartbeat", key: "labHealth", color: "text-accent-emerald" },
  { id: "reverse", key: "labReverse", color: "text-accent-amber" },
  { id: "xray", key: "labXray", color: "text-accent-indigo" },
  { id: "mashup", key: "labMashup", color: "text-accent-emerald" },
  { id: "whatif", key: "labWhatif", color: "text-accent-amber" },
  { id: "contract", key: "labContract", color: "text-accent-blue" },
] as const;

export const MAIN_SECTION_IDS = ["hero", ...MAIN_NAV_LINKS.map((link) => link.id)];
export const ADVANCED_SECTION_IDS = ADVANCED_NAV_LINKS.map((link) => link.id);
