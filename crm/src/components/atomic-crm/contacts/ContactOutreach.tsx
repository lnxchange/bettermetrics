import { useLocaleState, useRecordContext, useTranslate } from "ra-core";

import { formatLocalizedDate, formatRelativeDate } from "../misc/RelativeDate";
import type { Contact } from "../types";

export const outreachStatuses = [
  "identified",
  "researched",
  "drafted",
  "in-outlook",
  "sent",
  "replied",
  "engaged",
  "declined",
  "no-response",
  "holding",
] as const;

export const outreachStatusLabel = (
  status: string,
  translate: (key: string, options?: { _: string }) => string,
) =>
  translate(`resources.contacts.outreach_status.${status}`, {
    _: status,
  });

export const ContactOutreachInfo = () => {
  const record = useRecordContext<Contact>();
  const translate = useTranslate();
  const [locale = "en"] = useLocaleState();

  if (!record) return null;

  const none = translate("resources.contacts.background.status_none");
  const status = record.outreach_status
    ? outreachStatusLabel(record.outreach_status, translate)
    : none;

  return (
    <div className="space-y-1 text-sm">
      <div>
        <span className="text-muted-foreground">
          {translate("resources.contacts.fields.outreach_status")}
        </span>{" "}
        {status}
      </div>
      <div>
        <span className="text-muted-foreground">
          {translate("resources.contacts.fields.first_contacted_at")}
        </span>{" "}
        {record.first_contacted_at
          ? formatLocalizedDate(record.first_contacted_at, locale)
          : none}
      </div>
      <div>
        <span className="text-muted-foreground">
          {translate("resources.contacts.fields.last_contacted_at")}
        </span>{" "}
        {record.last_contacted_at
          ? formatLocalizedDate(record.last_contacted_at, locale)
          : none}
      </div>
    </div>
  );
};

export const ContactOutreachSummary = ({ contact }: { contact: Contact }) => {
  const translate = useTranslate();
  const [locale = "en"] = useLocaleState();

  if (!contact.outreach_status && !contact.last_contacted_at) return null;

  return (
    <div className="text-right ml-4">
      {contact.outreach_status ? (
        <div className="text-sm">
          {outreachStatusLabel(contact.outreach_status, translate)}
        </div>
      ) : null}
      {contact.last_contacted_at ? (
        <div
          className="text-sm text-muted-foreground"
          title={contact.last_contacted_at}
        >
          {translate("resources.contacts.fields.last_contacted_at")}{" "}
          {formatRelativeDate(contact.last_contacted_at, locale)}
        </div>
      ) : null}
    </div>
  );
};
