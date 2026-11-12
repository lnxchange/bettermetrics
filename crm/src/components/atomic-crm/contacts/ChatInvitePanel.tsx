import { useEffect, useState } from "react";
import { useRecordContext } from "ra-core";

import type { Contact } from "../types";

type InviteState = {
  status: "not_sent" | "sent" | "redeemed" | "expired" | "revoked";
  email: string | null;
  url?: string;
};

const labels = {
  not_sent: "Not sent",
  sent: "Sent",
  redeemed: "Redeemed",
  expired: "Expired",
  revoked: "Revoked",
};

export function ChatInvitePanel() {
  const record = useRecordContext<Contact>();
  const [state, setState] = useState<InviteState | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    if (!record) return;
    fetch(`/api/admin/chat-invites?crmContactId=${encodeURIComponent(String(record.id))}`, {
      credentials: "same-origin",
    })
      .then(response => response.json())
      .then(data => {
        if (data?.status) setState({ status: data.status, email: data.email });
      })
      .catch(() => setError("Could not load the invitation"));
  };

  useEffect(load, [record?.id]);

  if (!record) return null;

  const act = async (action: "create" | "revoke" | "resend") => {
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/chat-invites", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crmContactId: String(record.id), action: action === "create" ? undefined : action }),
    });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setError(data.error || "Could not update the invitation");
      return;
    }
    setState({ status: data.status || (action === "revoke" ? "revoked" : "sent"), email: data.email || state?.email || null, url: data.url });
  };

  return (
    <div className="mt-4 border-t border-slate-200 pt-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Ask the AI</p>
      <p className="mt-1 text-sm text-slate-800">{state ? labels[state.status] : "Loading…"}</p>
      {state?.email ? <p className="text-xs text-slate-500">{state.email}</p> : null}
      {state?.url ? <p className="mt-1 break-all text-xs text-slate-600">{state.url}</p> : null}
      {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}
      <div className="mt-2 flex flex-wrap gap-2">
        <button className="text-sm text-[#1E3A8A] underline" type="button" disabled={busy} onClick={() => act(state?.status === "sent" ? "resend" : "create")}>
          {state?.status === "sent" || state?.status === "expired" || state?.status === "revoked" ? "Resend" : "Create chat invitation"}
        </button>
        {state && state.status !== "not_sent" && state.status !== "revoked" ? (
          <button className="text-sm text-red-700 underline" type="button" disabled={busy} onClick={() => act("revoke")}>
            Revoke
          </button>
        ) : null}
      </div>
    </div>
  );
}
