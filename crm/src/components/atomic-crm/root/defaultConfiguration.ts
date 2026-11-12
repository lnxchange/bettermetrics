import type { ConfigurationContextValue } from "./ConfigurationContext";
// Import the logos as module assets so Vite resolves their URL relative to the
// JS chunk (import.meta.url), not the current route. A plain "./logos/..." path
// breaks on nested routes like /oauth/consent and under a deployment sub-path.
import darkModeLogo from "./logos/logo_atomic_crm_dark.svg";
import lightModeLogo from "./logos/logo_atomic_crm_light.svg";

export const defaultDarkModeLogo = darkModeLogo;
export const defaultLightModeLogo = lightModeLogo;

export const defaultCurrency = "AUD";

export const defaultTitle = "AIM";

export const defaultCompanySectors = [
  { value: "university", label: "University" },
  { value: "research-lab", label: "Research institution" },
  { value: "press", label: "Press" },
  { value: "think-tank", label: "Think tank" },
  { value: "public-institution", label: "Public institution" },
  { value: "independent", label: "Independent" },
];

// One board. The category says which ask this is. Stages from each ask sit
// together so a validation, promotion, and coverage deal can share the board.
export const defaultDealStages = [
  { value: "identified", label: "Identified" },
  { value: "invited", label: "Invited" },
  { value: "reading", label: "Reading" },
  { value: "responded", label: "Responded" },
  { value: "briefed", label: "Briefed" },
  { value: "interested", label: "Interested" },
  { value: "pitched", label: "Pitched" },
  { value: "endorsed", label: "Endorsed" },
  { value: "amplifying", label: "Amplifying" },
  { value: "published", label: "Published" },
  { value: "passed", label: "Passed" },
  { value: "declined", label: "Declined" },
];

export const defaultDealPipelineStatuses = [
  "endorsed",
  "amplifying",
  "published",
];

export const defaultDealCategories = [
  { value: "validation", label: "Validation" },
  { value: "promotion", label: "Promotion" },
  { value: "coverage", label: "Coverage" },
  { value: "donation", label: "Donation" },
];

export const defaultNoteStatuses = [
  { value: "not-contacted", label: "Not contacted", color: "#94a3b8" },
  { value: "in-conversation", label: "In conversation", color: "#7dbde8" },
  { value: "supportive", label: "Supportive", color: "#a4e87d" },
  { value: "declined", label: "Declined", color: "#e88b7d" },
];

export const defaultTaskTypes = [
  { value: "none", label: "None" },
  { value: "send-treatise", label: "Send treatise" },
  { value: "follow-up", label: "Follow up" },
  { value: "introduction", label: "Introduction" },
  { value: "pitch", label: "Pitch" },
  { value: "thank", label: "Thank" },
  { value: "log-response", label: "Log response" },
  { value: "email", label: "Email" },
  { value: "call", label: "Call" },
];

export const defaultConfiguration: ConfigurationContextValue = {
  companySectors: defaultCompanySectors,
  currency: defaultCurrency,
  dealCategories: defaultDealCategories,
  dealPipelineStatuses: defaultDealPipelineStatuses,
  dealStages: defaultDealStages,
  noteStatuses: defaultNoteStatuses,
  taskTypes: defaultTaskTypes,
  title: defaultTitle,
  darkModeLogo: defaultDarkModeLogo,
  lightModeLogo: defaultLightModeLogo,
};
