import { useLocaleState, useRecordContext, useTranslate } from "ra-core";

import { cn } from "@/lib/utils";
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
      <div>
        <span className="text-muted-foreground">
          {translate("resources.contacts.fields.list")}
        </span>{" "}
        {record.list
          ? translate(`resources.contacts.list_values.${record.list}`, {
              _: record.list,
            })
          : none}
      </div>
    </div>
  );
};

export const ContactOutreachSummary = ({
  contact,
  className,
}: {
  contact: Contact;
  className?: string;
}) => {
  const translate = useTranslate();
  const [locale = "en"] = useLocaleState();
  const listLabel = contact.list
    ? translate(`resources.contacts.list_values.${contact.list}`, {
        _: contact.list,
      })
    : null;
  const pending = contact.nb_tasks ?? 0;

  if (
    !contact.outreach_status &&
    !contact.last_contacted_at &&
    !listLabel &&
    pending === 0
  ) {
    return null;
  }

  return (
    <div className={cn("shrink-0 text-right leading-tight", className)}>
      {contact.outreach_status ? (
        <div className="text-sm">
          {outreachStatusLabel(contact.outreach_status, translate)}
        </div>
      ) : null}
      {listLabel ? (
        <div className="text-sm text-muted-foreground">{listLabel}</div>
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
      {pending > 0 ? (
        <div className="text-sm text-muted-foreground">
          {translate("crm.common.task_count", { smart_count: pending })}
        </div>
      ) : null}
    </div>
  );
};
