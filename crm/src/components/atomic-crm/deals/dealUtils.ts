import { format } from "date-fns";

import type { DealStage, LabeledValue } from "../types";

export const DONATION_CATEGORY = "donation";

export const isDonationDeal = (categories?: string[] | null) =>
  Boolean(categories?.includes(DONATION_CATEGORY));

export const findDealLabel = (dealStages: DealStage[], dealValue: string) => {
  const dealStage = dealStages.find((stage) => stage.value === dealValue);
  return dealStage?.label;
};

export const formatDealCategories = (
  dealCategories: LabeledValue[],
  categories: string[] | null | undefined,
): string =>
  (categories ?? [])
    .map(
      (value) => dealCategories.find((c) => c.value === value)?.label ?? value,
    )
    .join(", ");

export function getRelativeTimeString(
  dateString: string,
  locale = "en",
): string {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diff = date.getTime() - today.getTime();
  const unitDiff = Math.round(diff / (1000 * 60 * 60 * 24));

  // Check if the date is more than one week old
  if (Math.abs(unitDiff) > 7) {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
    }).format(date);
  }

  // Intl.RelativeTimeFormat for dates within the last week
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  return ucFirst(rtf.format(unitDiff, "day"));
}

function ucFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const isoDatePrefix = /^(\d{4})-(\d{2})-(\d{2})/;

/**
 * Calendar day named by a date or timestamp, in the local timezone.
 * An empty value is no date. A timestamp uses the day written in the string,
 * so `2026-09-30T00:00:00.000Z` stays 30 September in every timezone.
 */
export function parseDealDate(value: string | null | undefined): Date | null {
  if (value == null) return null;
  const text = String(value).trim();
  if (!text) return null;
  const match = text.match(isoDatePrefix);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function formatISODateString(
  dateString: string | null | undefined,
): string | null {
  if (dateString == null || String(dateString).trim() === "") return null;
  const date = parseDealDate(dateString);
  if (!date) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }
  return format(date, "PP");
}
