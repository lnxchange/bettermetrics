import { useGetList } from "ra-core";

import type { Contact, ContactNote, Deal } from "../types";
import { DashboardActivityLog } from "./DashboardActivityLog";
import { DashboardStepper } from "./DashboardStepper";
import { DealsChart } from "./DealsChart";
import { OutreachBoard, WebsiteEnquiries } from "./OutreachBoard";
import { TasksList } from "./TasksList";

export const Dashboard = () => {
  const {
    data: dataContact,
    total: totalContact,
    isPending: isPendingContact,
  } = useGetList<Contact>("contacts", {
    pagination: { page: 1, perPage: 1 },
  });

  const { total: totalContactNotes, isPending: isPendingContactNotes } =
    useGetList<ContactNote>("contact_notes", {
      pagination: { page: 1, perPage: 1 },
    });

  const { total: donationDeals, isPending: isPendingDonations } =
    useGetList<Deal>("deals", {
      pagination: { page: 1, perPage: 1 },
      filter: { "categories@cs": "{donation}" },
    });

  const isPending =
    isPendingContact || isPendingContactNotes || isPendingDonations;

  if (isPending) {
    return null;
  }

  if (!totalContact) {
    return <DashboardStepper step={1} />;
  }

  if (!totalContactNotes) {
    return <DashboardStepper step={2} contactId={dataContact?.[0]?.id} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-1">
      <div className="min-w-0 md:col-span-3">
        <div className="flex flex-col gap-4">
          <OutreachBoard />
          <WebsiteEnquiries />
        </div>
      </div>
      <div className="min-w-0 md:col-span-6">
        <div className="flex flex-col gap-6">
          {donationDeals ? <DealsChart /> : null}
          <DashboardActivityLog />
        </div>
      </div>

      <div className="min-w-0 md:col-span-3">
        <TasksList />
      </div>
    </div>
  );
};
