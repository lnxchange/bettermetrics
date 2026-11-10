import { Inbox, Users } from "lucide-react";
import { useGetList, useTranslate } from "ra-core";
import { Link } from "react-router";
import { Card } from "@/components/ui/card";

import { Avatar } from "../contacts/Avatar";
import { ContactOutreachSummary } from "../contacts/ContactOutreach";
import { SimpleList } from "../simple-list/SimpleList";
import type { Contact, Tag } from "../types";

const contactName = (contact: Contact) =>
  `${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim();

export const OutreachBoard = () => {
  const translate = useTranslate();
  const { data, total, isPending } = useGetList<Contact>("contacts", {
    pagination: { page: 1, perPage: 8 },
    sort: { field: "last_contacted_at", order: "DESC" },
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <Users className="text-muted-foreground mr-3 h-6 w-6" />
        <h2 className="text-xl font-semibold text-muted-foreground">
          {translate("resources.contacts.outreach_board.title")}
        </h2>
      </div>
      <Card className="py-0">
        <SimpleList<Contact>
          linkType="show"
          data={data}
          total={total}
          isPending={isPending}
          resource="contacts"
          className="[&>li:first-child>a]:rounded-t-xl [&>li:last-child>a]:rounded-b-xl"
          primaryText={contactName}
          secondaryText={(contact) => <ContactOutreachSummary contact={contact} />}
          leftAvatar={(contact) => <Avatar record={contact} />}
          empty={
            <p className="p-4 text-sm">
              {translate("resources.contacts.outreach_board.empty")}
            </p>
          }
        />
      </Card>
    </div>
  );
};

export const WebsiteEnquiries = () => {
  const translate = useTranslate();
  const { data: tags } = useGetList<Tag>("tags", {
    pagination: { page: 1, perPage: 200 },
    sort: { field: "name", order: "ASC" },
  });
  const inbound = tags?.find((tag) => tag.name === "inbound");
  const { data, total, isPending } = useGetList<Contact>(
    "contacts",
    {
      pagination: { page: 1, perPage: 8 },
      sort: { field: "first_seen", order: "DESC" },
      filter: inbound ? { "tags@cs": `{${inbound.id}}` } : { id: -1 },
    },
    { enabled: Boolean(inbound) },
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <Inbox className="text-muted-foreground mr-3 h-6 w-6" />
        <h2 className="text-xl font-semibold text-muted-foreground">
          <Link to="/contacts">{translate("resources.contacts.enquiries.title")}</Link>
        </h2>
      </div>
      <Card className="py-0">
        <SimpleList<Contact>
          linkType="show"
          data={inbound ? data : []}
          total={inbound ? total : 0}
          isPending={Boolean(inbound) && isPending}
          resource="contacts"
          className="[&>li:first-child>a]:rounded-t-xl [&>li:last-child>a]:rounded-b-xl"
          primaryText={contactName}
          secondaryText={(contact) => contact.company_name || contact.source || ""}
          leftAvatar={(contact) => <Avatar record={contact} />}
          empty={
            <p className="p-4 text-sm">
              {translate("resources.contacts.enquiries.empty")}
            </p>
          }
        />
      </Card>
    </div>
  );
};
