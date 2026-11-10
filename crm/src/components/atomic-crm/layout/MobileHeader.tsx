import { GlobalSearchButton } from "../search/GlobalSearchButton";

// The search lives here rather than in each screen: there is no Cmd+K on a
// phone, so this header is the only place reachable from every mobile page.
const MobileHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 h-14 w-full flex justify-between items-center border-b border-slate-200 bg-white px-4">
      {children}
      <GlobalSearchButton variant="icon" />
    </header>
  );
};

export default MobileHeader;
