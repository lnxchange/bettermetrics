import { FormEvent, useEffect, useMemo, useState } from "react";

const PROVIDERS = [
  { id: "anthropic", label: "Anthropic" },
  { id: "openai", label: "OpenAI" },
  { id: "google", label: "Google Gemini" },
  { id: "openrouter", label: "OpenRouter" },
] as const;

type ProviderId = (typeof PROVIDERS)[number]["id"];

type Settings = {
  paused: boolean;
  pausedMessage: string;
  providers: Record<string, boolean>;
  models: Record<string, string>;
  maxOutputTokens: number;
  treatiseContextMaxChars: number;
  maxMessages: number;
  maxConversationChars: number;
  questionsPerUserHour: number;
  questionsPerUserDay: number;
  questionsPerIpDay: number;
  guestChat: boolean;
  cache: Record<string, boolean>;
  anthropicCacheTtl: "5m" | "1h";
  noticeMarkdown: string;
};

type UsageRow = {
  user_id: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  cached_tokens: number | null;
  outcome: string;
};

type LogRow = {
  id: number;
  email: string;
  setting: string;
  created_at: string;
};

const buttonClass =
  "rounded-md bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white hover:bg-[#1e40af] disabled:opacity-50";
const fieldClass = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

export function AiChatPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [log, setLog] = useState<LogRow[]>([]);
  const [usage, setUsage] = useState<UsageRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/chat-settings", { credentials: "same-origin" })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          setError(data.error || "Could not load AI settings");
          return;
        }
        setSettings(data.settings);
        setLog(data.log || []);
        setUsage(data.usage || []);
      })
      .catch(() => setError("Could not load AI settings"));
  }, []);

  const summary = useMemo(() => summarize(usage), [usage]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError(null);
    setSaved("");
    const response = await fetch("/api/admin/chat-settings", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await response.json().catch(() => ({}));
    setSaving(false);
    if (!response.ok) {
      setError(data.error || "Could not save settings");
      return;
    }
    setSettings(data.settings);
    setSaved("Settings saved. Chat picks them up within 30 seconds. A typed model id is saved unverified.");
  };

  const set = (patch: Partial<Settings>) => {
    if (!settings) return;
    setSettings({ ...settings, ...patch });
  };

  return (
    <form className="mx-auto max-w-3xl space-y-8 p-6" onSubmit={save}>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">AI chat</h1>
        <p className="mt-1 text-sm text-slate-600">
          Changes apply to Ask the AI within half a minute. The CHAT_PAUSED environment variable still overrides this page.
        </p>
      </div>
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      {!settings && !error && <p className="text-sm text-slate-600">Loading AI settings…</p>}
      {settings && (
        <>
          <label className="flex items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={settings.paused}
              onChange={(event) => set({ paused: event.target.checked })}
            />
            Chat off. Readers see the message below and no model is called.
          </label>
          <label className="block text-sm text-slate-800">
            Message while chat is off
            <textarea
              className={fieldClass}
              value={settings.pausedMessage}
              onChange={(event) => set({ pausedMessage: event.target.value })}
            />
          </label>
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-slate-900">Providers and models</legend>
            <p className="text-sm text-slate-600">
              Turn a provider off to stop readers from using that key. A typed model id is stored with a warning that it was not checked against the provider.
            </p>
            {PROVIDERS.map((provider) => (
              <ProviderFields
                key={provider.id}
                id={provider.id}
                label={provider.label}
                settings={settings}
                onChange={set}
              />
            ))}
          </fieldset>
          <label className="block text-sm text-slate-800">
            Anthropic cache lifetime
            <select
              className={fieldClass}
              value={settings.anthropicCacheTtl}
              onChange={(event) => set({ anthropicCacheTtl: event.target.value === "1h" ? "1h" : "5m" })}
            >
              <option value="5m">Five minutes</option>
              <option value="1h">One hour (costs more to write)</option>
            </select>
          </label>
          <NumberField label="Answer length, maximum output tokens" value={settings.maxOutputTokens} onChange={(value) => set({ maxOutputTokens: value })} />
          <NumberField label="Treatise context cap, characters" value={settings.treatiseContextMaxChars} onChange={(value) => set({ treatiseContextMaxChars: value })} />
          <NumberField label="Maximum messages in a conversation" value={settings.maxMessages} onChange={(value) => set({ maxMessages: value })} />
          <NumberField label="Maximum characters in a conversation" value={settings.maxConversationChars} onChange={(value) => set({ maxConversationChars: value })} />
          <NumberField label="Questions per reader per hour" value={settings.questionsPerUserHour} onChange={(value) => set({ questionsPerUserHour: value })} />
          <NumberField label="Questions per reader per day" value={settings.questionsPerUserDay} onChange={(value) => set({ questionsPerUserDay: value })} />
          <NumberField label="Questions per IP address per day" value={settings.questionsPerIpDay} onChange={(value) => set({ questionsPerIpDay: value })} />
          <label className="flex items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={settings.guestChat}
              onChange={(event) => set({ guestChat: event.target.checked })}
            />
            Guest chat. Leave this off. There is no site key for guests to spend.
          </label>
          <label className="block text-sm text-slate-800">
            Bring-your-own-key notice (Markdown)
            <textarea
              className={`${fieldClass} min-h-40`}
              value={settings.noticeMarkdown}
              onChange={(event) => set({ noticeMarkdown: event.target.value })}
            />
          </label>
          <div className="rounded-md border border-slate-200 bg-white p-4 text-sm whitespace-pre-wrap text-slate-700">
            {settings.noticeMarkdown}
          </div>
          {saved && <p className="text-sm text-emerald-700">{saved}</p>}
          <button className={buttonClass} disabled={saving} type="submit">
            Save settings
          </button>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Last 30 days</h2>
            <p className="mt-2 text-sm text-slate-700">
              Questions answered: {summary.answered}. Refusals: {summary.refused}. Input tokens: {summary.input}. Output tokens: {summary.output}. Cached input tokens: {summary.cached}.
            </p>
            <h3 className="mt-4 text-sm font-medium text-slate-900">Most active readers</h3>
            <ul className="mt-1 text-sm text-slate-700">
              {summary.readers.map((reader) => (
                <li key={reader.id}>
                  {reader.id}: {reader.count}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-slate-900">Recent changes</h2>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {log.map((entry) => (
                <li key={entry.id}>
                  {entry.created_at} · {entry.email || "admin"} · {entry.setting}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </form>
  );
}

function ProviderFields({
  id,
  label,
  settings,
  onChange,
}: {
  id: ProviderId;
  label: string;
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[auto_1fr]">
      <label className="flex items-center gap-2 text-sm text-slate-800">
        <input
          type="checkbox"
          checked={settings.providers[id] !== false}
          onChange={(event) => onChange({ providers: { ...settings.providers, [id]: event.target.checked } })}
        />
        {label}
      </label>
      <input
        className="rounded-md border border-slate-300 px-3 py-2 font-mono text-sm"
        value={settings.models[id] || ""}
        onChange={(event) => onChange({ models: { ...settings.models, [id]: event.target.value } })}
      />
      <label className="flex items-center gap-2 text-sm text-slate-800 sm:col-span-2">
        <input
          type="checkbox"
          checked={settings.cache[id] !== false}
          onChange={(event) => onChange({ cache: { ...settings.cache, [id]: event.target.checked } })}
        />
        Cache this provider
      </label>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm text-slate-800">
      {label}
      <input
        className={fieldClass}
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function summarize(rows: UsageRow[]) {
  const readers = new Map<string, number>();
  let answered = 0;
  let refused = 0;
  let input = 0;
  let output = 0;
  let cached = 0;
  for (const row of rows) {
    if (row.outcome === "answered") answered += 1;
    else refused += 1;
    input += row.input_tokens || 0;
    output += row.output_tokens || 0;
    cached += row.cached_tokens || 0;
    if (row.user_id && row.outcome === "answered") {
      readers.set(row.user_id, (readers.get(row.user_id) || 0) + 1);
    }
  }
  return {
    answered,
    refused,
    input,
    output,
    cached,
    readers: Array.from(readers.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, count]) => ({ id, count })),
  };
}
