import { useListContext, useTranslate } from "ra-core";
import { Link } from "react-router";

import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Company } from "../types";
import { CompanyAvatar } from "./CompanyAvatar";

export const CompanyListContent = () => {
  const translate = useTranslate();
  const { data, error, isPending } = useListContext<Company>();

  if (isPending) return null;
  if (error) return null;

  return (
    <div className="md:divide-y">
      {data.map((company) => (
        <CompanyRow key={company.id} company={company} />
      ))}
      {data.length === 0 && (
        <div className="p-4 text-muted-foreground">
          {translate("resources.companies.empty.title", {
            _: "No organisations found",
          })}
        </div>
      )}
    </div>
  );
};

const CompanyRow = ({ company }: { company: Company }) => {
  const translate = useTranslate();
  const { companySectors } = useConfigurationContext();
  const sector = companySectors.find((item) => item.value === company.sector);
  const contacts = company.nb_contacts ?? 0;
  const engagements = company.nb_deals ?? 0;

  return (
    <Link
      to={`/companies/${company.id}/show`}
      className="flex flex-row items-center gap-4 px-4 py-3 hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl"
    >
      <CompanyAvatar record={company} />
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{company.name}</div>
        {sector?.label || company.city ? (
          <div className="text-sm text-muted-foreground truncate">
            {[sector?.label, company.city].filter(Boolean).join(" · ")}
          </div>
        ) : null}
      </div>
      <div className="text-right text-sm text-muted-foreground">
        <div>
          {translate("resources.companies.nb_contacts", {
            smart_count: contacts,
          })}
        </div>
        {engagements > 0 ? (
          <div>
            {translate("resources.companies.nb_deals", {
              smart_count: engagements,
            })}
          </div>
        ) : null}
      </div>
    </Link>
  );
};
