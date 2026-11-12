import { useState } from "react";
import {
  Form,
  useCreate,
  useDelete,
  useGetList,
  useRecordContext,
  useTranslate,
} from "ra-core";
import { Link } from "react-router";
import { ReferenceField } from "@/components/admin/reference-field";
import { ReferenceInput } from "@/components/admin/reference-input";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { Button } from "@/components/ui/button";

import { contactOptionText } from "../misc/ContactOption";
import type { Contact } from "../types";

type ContactLink = {
  id: number;
  contact_id: number;
  related_id: number;
};

const contactName = (contact: Contact) =>
  `${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim();

const LinkedName = () => {
  const record = useRecordContext<Contact>();
  if (!record) return null;
  return <>{contactName(record)}</>;
};

export const ContactRelationships = () => {
  const record = useRecordContext<Contact>();
  const translate = useTranslate();
  if (!record) return null;

  return (
    <div className="space-y-3 text-sm">
      <div>
        <div className="text-muted-foreground">
          {translate("resources.contacts.fields.introduced_by")}
        </div>
        {record.introduced_by ? (
          <ReferenceField
            source="introduced_by"
            reference="contacts"
            link="show"
          >
            <LinkedName />
          </ReferenceField>
        ) : (
          <div>{translate("resources.contacts.background.status_none")}</div>
        )}
      </div>
      <IntroducedList contactId={record.id} />
      <RelatedList contactId={Number(record.id)} />
    </div>
  );
};

const IntroducedList = ({ contactId }: { contactId: Contact["id"] }) => {
  const translate = useTranslate();
  const { data } = useGetList<Contact>("contacts", {
    pagination: { page: 1, perPage: 20 },
    sort: { field: "last_name", order: "ASC" },
    filter: { introduced_by: contactId },
  });
  if (!data?.length) return null;
  return (
    <div>
      <div className="text-muted-foreground">
        {translate("resources.contacts.fields.introduced")}
      </div>
      <ul className="mt-1 space-y-1">
        {data.map((contact) => (
          <li key={contact.id}>
            <Link className="underline" to={`/contacts/${contact.id}/show`}>
              {contactName(contact)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RelatedList = ({ contactId }: { contactId: number }) => {
  const translate = useTranslate();
  const { data: fromHere, refetch: refetchFrom } = useGetList<ContactLink>(
    "contact_links",
    {
      pagination: { page: 1, perPage: 50 },
      filter: { contact_id: contactId },
    },
  );
  const { data: toHere, refetch: refetchTo } = useGetList<ContactLink>(
    "contact_links",
    {
      pagination: { page: 1, perPage: 50 },
      filter: { related_id: contactId },
    },
  );
  const [create] = useCreate();
  const [remove] = useDelete();
  const [adding, setAdding] = useState(false);

  const others = new Map<number, number[]>();
  const remember = (otherId: number, linkId: number) => {
    const ids = others.get(otherId) ?? [];
    ids.push(linkId);
    others.set(otherId, ids);
  };
  for (const link of fromHere ?? []) remember(Number(link.related_id), link.id);
  for (const link of toHere ?? []) remember(Number(link.contact_id), link.id);

  const refresh = () => {
    refetchFrom();
    refetchTo();
  };

  const addRelated = (relatedId: number) => {
    if (!relatedId || relatedId === contactId || others.has(relatedId)) return;
    create(
      "contact_links",
      { data: { contact_id: contactId, related_id: relatedId } },
      {
        onSuccess: () => {
          create(
            "contact_links",
            { data: { contact_id: relatedId, related_id: contactId } },
            { onSuccess: refresh },
          );
        },
      },
    );
    setAdding(false);
  };

  const unlink = (linkIds: number[]) => {
    const [first, ...rest] = linkIds;
    if (!first) return;
    remove("contact_links", { id: first }, {
      onSuccess: () => {
        if (rest.length) unlink(rest);
        else refresh();
      },
    });
  };

  return (
    <div>
      <div className="text-muted-foreground">
        {translate("resources.contacts.fields.related_contacts")}
      </div>
      <ul className="mt-1 space-y-1">
        {[...others.entries()].map(([otherId, linkIds]) => (
          <li key={otherId} className="flex items-center gap-2">
            <Link className="underline" to={`/contacts/${otherId}/show`}>
              <RelatedName id={otherId} />
            </Link>
            <button
              type="button"
              className="text-muted-foreground"
              onClick={() => unlink(linkIds)}
            >
              {translate("ra.action.remove")}
            </button>
          </li>
        ))}
      </ul>
      {adding ? (
        <Form
          onSubmit={(values: { related_id?: number }) => {
            if (values.related_id) addRelated(Number(values.related_id));
          }}
        >
          <ReferenceInput
            source="related_id"
            reference="contacts"
            filter={{ "id@neq": contactId }}
          >
            <AutocompleteInput
              optionText={contactOptionText}
              helperText={false}
              label="resources.contacts.fields.related_contacts"
            />
          </ReferenceInput>
          <Button type="submit" size="sm" className="mt-2">
            {translate("ra.action.add")}
          </Button>
        </Form>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => setAdding(true)}
        >
          {translate("resources.contacts.action.add_related")}
        </Button>
      )}
    </div>
  );
};

const RelatedName = ({ id }: { id: number }) => {
  const { data } = useGetList<Contact>("contacts", {
    pagination: { page: 1, perPage: 1 },
    filter: { id },
  });
  const contact = data?.[0];
  return <>{contact ? contactName(contact) : `#${id}`}</>;
};
