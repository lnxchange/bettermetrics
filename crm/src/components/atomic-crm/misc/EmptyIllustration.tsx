export type EmptyKind =
  | "contacts"
  | "companies"
  | "deals"
  | "inbox"
  | "articles"
  | "users"
  | "documents";

const labels: Record<EmptyKind, string> = {
  contacts: "No contacts yet",
  companies: "No companies yet",
  deals: "No deals yet",
  inbox: "No messages yet",
  articles: "No articles yet",
  users: "No users yet",
  documents: "No documents yet",
};

export function EmptyIllustration({ kind }: { kind: EmptyKind }) {
  return (
    <svg
      width="220"
      height="148"
      viewBox="0 0 220 148"
      fill="none"
      role="img"
      aria-label={labels[kind]}
      className="h-36 w-auto"
    >
      <rect x="26" y="10" width="168" height="128" rx="28" fill="#F8FAFC" />
      <rect
        x="26.5"
        y="10.5"
        width="167"
        height="127"
        rx="27.5"
        stroke="#E2E8F0"
      />
      {kind === "contacts" && <Contacts />}
      {kind === "companies" && <Companies />}
      {kind === "deals" && <Deals />}
      {kind === "inbox" && <Inbox />}
      {kind === "articles" && <Articles />}
      {kind === "users" && <Users />}
      {kind === "documents" && <Documents />}
    </svg>
  );
}

function Contacts() {
  return (
    <g>
      <circle cx="86" cy="62" r="16" fill="#1E3A8A" />
      <circle cx="118" cy="58" r="16" fill="#0D9488" />
      <circle cx="150" cy="66" r="14" fill="#93C5FD" />
      <rect x="62" y="88" width="96" height="28" rx="14" fill="#1E3A8A" opacity="0.12" />
      <rect x="74" y="98" width="48" height="6" rx="3" fill="#1E3A8A" />
      <rect x="128" y="98" width="18" height="6" rx="3" fill="#0D9488" />
    </g>
  );
}

function Companies() {
  return (
    <g>
      <rect x="78" y="42" width="64" height="72" rx="6" fill="#1E3A8A" />
      <rect x="62" y="70" width="28" height="44" rx="4" fill="#0D9488" />
      <rect x="130" y="58" width="28" height="56" rx="4" fill="#93C5FD" />
      <rect x="88" y="54" width="10" height="8" rx="1" fill="white" />
      <rect x="104" y="54" width="10" height="8" rx="1" fill="white" />
      <rect x="120" y="54" width="10" height="8" rx="1" fill="white" />
      <rect x="88" y="70" width="10" height="8" rx="1" fill="white" />
      <rect x="104" y="70" width="10" height="8" rx="1" fill="white" />
      <rect x="120" y="70" width="10" height="8" rx="1" fill="white" />
      <rect x="100" y="94" width="16" height="20" rx="2" fill="#F8FAFC" />
    </g>
  );
}

function Deals() {
  return (
    <g>
      <rect x="58" y="46" width="52" height="64" rx="8" fill="white" stroke="#E2E8F0" />
      <rect x="110" y="38" width="52" height="72" rx="8" fill="#1E3A8A" />
      <rect x="68" y="58" width="28" height="5" rx="2.5" fill="#CBD5E1" />
      <rect x="68" y="70" width="20" height="5" rx="2.5" fill="#CBD5E1" />
      <rect x="122" y="54" width="28" height="5" rx="2.5" fill="#93C5FD" />
      <rect x="122" y="66" width="20" height="5" rx="2.5" fill="#93C5FD" />
      <circle cx="136" cy="90" r="9" fill="#0D9488" />
      <path d="M132 90.2l2.6 2.6 5.2-5.4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Inbox() {
  return (
    <g>
      <rect x="62" y="48" width="96" height="64" rx="10" fill="#1E3A8A" />
      <path d="M62 62l48 28 48-28" stroke="#0D9488" strokeWidth="4" strokeLinejoin="round" />
      <path d="M62 100l32-22M158 100l-32-22" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Articles() {
  return (
    <g>
      <rect x="74" y="34" width="72" height="88" rx="8" fill="white" stroke="#E2E8F0" />
      <rect x="86" y="48" width="36" height="6" rx="3" fill="#1E3A8A" />
      <rect x="86" y="62" width="48" height="4" rx="2" fill="#CBD5E1" />
      <rect x="86" y="72" width="44" height="4" rx="2" fill="#CBD5E1" />
      <rect x="86" y="82" width="40" height="4" rx="2" fill="#CBD5E1" />
      <rect x="86" y="98" width="22" height="8" rx="4" fill="#0D9488" />
    </g>
  );
}

function Users() {
  return (
    <g>
      <circle cx="110" cy="62" r="18" fill="#1E3A8A" />
      <path d="M78 108c6-16 18-24 32-24s26 8 32 24" fill="#0D9488" />
      <circle cx="146" cy="96" r="12" fill="#1E3A8A" />
      <path d="M146 90.5v11M140.5 96h11" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  );
}

function Documents() {
  return (
    <g>
      <rect x="78" y="40" width="70" height="80" rx="8" fill="#DBEAFE" />
      <rect x="68" y="32" width="70" height="80" rx="8" fill="white" stroke="#E2E8F0" />
      <path d="M112 32v18h26" stroke="#0D9488" strokeWidth="3" strokeLinejoin="round" />
      <rect x="80" y="64" width="40" height="4" rx="2" fill="#1E3A8A" />
      <rect x="80" y="76" width="46" height="4" rx="2" fill="#CBD5E1" />
      <rect x="80" y="86" width="34" height="4" rx="2" fill="#CBD5E1" />
    </g>
  );
}
