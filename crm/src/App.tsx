import { CRM } from "@/components/atomic-crm/root/CRM";
import {
  defaultCompanySectors,
  defaultCurrency,
  defaultDealCategories,
  defaultDealPipelineStatuses,
  defaultDealStages,
  defaultNoteStatuses,
  defaultTaskTypes,
  defaultTitle,
} from "@/components/atomic-crm/root/defaultConfiguration";

const App = () => (
  <CRM
    disableTelemetry
    title={defaultTitle}
    currency={defaultCurrency}
    companySectors={defaultCompanySectors}
    dealCategories={defaultDealCategories}
    dealPipelineStatuses={defaultDealPipelineStatuses}
    dealStages={defaultDealStages}
    noteStatuses={defaultNoteStatuses}
    taskTypes={defaultTaskTypes}
  />
);

export default App;
