import { FormEvent, ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function Page({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {action}
      </div>
      {children}
    </div>
  );
}

function Notice({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {error}
    </p>
  );
}

const buttonClass =
  "rounded-md bg-[#1E3A8A] px-3 py-2 text-sm font-medium text-white hover:bg-[#1e40af]";
const quietClass =
  "rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50";

export function InboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const response = await fetch("/api/admin/inbox");
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Could not load the inbox");
      return;
    }
    setMessages(data.messages || []);
    setSelected((current: any) => data.messages?.find((item: any) => item.id === current?.id) || data.messages?.[0] || null);
  };

  useEffect(() => {
    load().catch(() => setError("Could not load the inbox"));
  }, []);

  const mark = async (id: string, is_read: boolean) => {
    await fetch("/api/admin/inbox", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_read }),
    });
    await load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/inbox?id=${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <Page title="Inbox">
      <Notice error={error} />
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <ul className="divide-y rounded-lg border border-slate-200 bg-white">
          {messages.map(message => (
            <li key={message.id}>
              <button
                className={`w-full px-3 py-3 text-left text-sm ${selected?.id === message.id ? "bg-slate-50" : ""}`}
                onClick={() => {
                  setSelected(message);
                  if (!message.is_read) mark(message.id, true);
                }}
              >
                <span className="font-medium text-slate-900">{message.name}</span>
                <span className="block text-slate-500">{message.subject || message.interest}</span>
              </button>
            </li>
          ))}
          {messages.length === 0 && <li className="px-3 py-6 text-sm text-slate-500">No messages yet.</li>}
        </ul>
        {selected && (
          <article className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold">{selected.subject || selected.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{selected.email}</p>
            <p className="mt-4 whitespace-pre-wrap text-sm text-slate-800">
              {selected.message || selected.paper_scope}
            </p>
            <div className="mt-4 flex gap-2">
              <button className={quietClass} onClick={() => mark(selected.id, !selected.is_read)}>
                {selected.is_read ? "Mark unread" : "Mark read"}
              </button>
              <button className={quietClass} onClick={() => remove(selected.id)}>
                Delete
              </button>
            </div>
          </article>
        )}
      </div>
    </Page>
  );
}

export function ArticlesPage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/articles")
      .then(response => response.json())
      .then(data => setArticles(data.articles || []))
      .catch(() => setError("Could not load articles"));
  }, []);

  return (
    <Page
      title="Articles"
      action={
        <button className={buttonClass} onClick={() => navigate("/articles/new")}>
          New article
        </button>
      }
    >
      <Notice error={error} />
      <ul className="divide-y rounded-lg border border-slate-200 bg-white">
        {articles.map(article => (
          <li key={article.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <button className="text-left" onClick={() => navigate(`/articles/${article.id}`)}>
              <span className="font-medium text-slate-900">{article.title}</span>
              <span className="ml-2 text-sm text-slate-500">{article.status}</span>
            </button>
          </li>
        ))}
        {articles.length === 0 && <li className="px-4 py-6 text-sm text-slate-500">No articles yet.</li>}
      </ul>
    </Page>
  );
}

export function ArticleEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    author: "",
    category: "",
    tags: "",
    featured_image_url: "",
    meta_description: "",
    status: "draft",
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/articles/${id}`)
      .then(response => response.json())
      .then(data => {
        const article = data.article;
        if (!article) return;
        setForm({
          title: article.title || "",
          slug: article.slug || "",
          content: article.content || "",
          author: article.author || "",
          category: article.category || "",
          tags: Array.isArray(article.tags) ? article.tags.join(", ") : "",
          featured_image_url: article.featured_image_url || "",
          meta_description: article.meta_description || "",
          status: article.status || "draft",
        });
      })
      .catch(() => setError("Could not load the article"));
  }, [id]);

  const set = (key: string, value: string) => setForm(current => ({ ...current, [key]: value }));

  const save = async (event?: FormEvent) => {
    event?.preventDefault();
    setSaving(true);
    setError(null);
    const tags = form.tags.split(",").map(tag => tag.trim()).filter(Boolean);
    const payload = { ...form, tags, featuredImage: form.featured_image_url };
    const response = await fetch(id ? `/api/articles/${id}` : "/api/articles", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) {
      setError(data.error || "Could not save the article");
      return;
    }
    const nextId = data.article?.id || data.id || id;
    if (!id && nextId) navigate(`/articles/${nextId}`);
  };

  const publish = async () => {
    if (!id) return;
    await save();
    const response = await fetch(`/api/articles/${id}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Could not publish");
      return;
    }
    setForm(current => ({ ...current, status: "published" }));
  };

  const optimize = async () => {
    if (!id) return;
    const response = await fetch(`/api/articles/${id}/optimize-seo`, { method: "POST" });
    if (!response.ok) setError("Could not optimize SEO");
  };

  return (
    <Page title={id ? "Edit article" : "New article"}>
      <Notice error={error} />
      <form className="space-y-4 rounded-lg border border-slate-200 bg-white p-5" onSubmit={save}>
        <label className="block text-sm">
          Title
          <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={form.title} onChange={event => set("title", event.target.value)} required />
        </label>
        <label className="block text-sm">
          Slug
          <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={form.slug} onChange={event => set("slug", event.target.value)} required />
        </label>
        <label className="block text-sm">
          Content
          <textarea className="mt-1 min-h-64 w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm" value={form.content} onChange={event => set("content", event.target.value)} required />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            Author
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={form.author} onChange={event => set("author", event.target.value)} />
          </label>
          <label className="block text-sm">
            Category
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={form.category} onChange={event => set("category", event.target.value)} />
          </label>
          <label className="block text-sm">
            Tags
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={form.tags} onChange={event => set("tags", event.target.value)} />
          </label>
          <label className="block text-sm">
            Featured image URL
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={form.featured_image_url} onChange={event => set("featured_image_url", event.target.value)} />
          </label>
        </div>
        <label className="block text-sm">
          Meta description
          <textarea className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={form.meta_description} onChange={event => set("meta_description", event.target.value)} />
        </label>
        <div className="flex flex-wrap gap-2">
          <button className={buttonClass} disabled={saving} type="submit">Save</button>
          {id && <button className={quietClass} type="button" onClick={optimize}>Optimize SEO</button>}
          {id && <button className={quietClass} type="button" onClick={publish}>Publish</button>}
        </div>
      </form>
    </Page>
  );
}

export function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(response => response.json())
      .then(data => setUsers(data.users || []))
      .catch(() => setError("Could not load users"));
  }, []);

  return (
    <Page title="Users">
      <Notice error={error} />
      <table className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Signed up</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{[user.first_name, user.last_name].filter(Boolean).join(" ") || "—"}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.created_at ? new Date(user.created_at).toLocaleString() : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Page>
  );
}

export function DocumentsPage({ kind }: { kind: "research" | "rag" }) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const load = () => {
    fetch(`/api/admin/documents?type=${kind}`)
      .then(response => response.json())
      .then(data => setDocuments(data.documents || []))
      .catch(() => setError("Could not load documents"));
  };

  useEffect(load, [kind]);

  const upload = async (event: FormEvent) => {
    event.preventDefault();
    const body = new FormData();
    body.set("type", kind);
    body.set("title", title);
    body.set("description", description);
    if (kind === "rag") body.set("content", content);
    if (file) body.set("file", file);
    const response = await fetch("/api/admin/documents", { method: "POST", body });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Could not add the document");
      return;
    }
    setTitle("");
    setDescription("");
    setContent("");
    setFile(null);
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/documents?id=${id}&type=${kind}`, { method: "DELETE" });
    load();
  };

  return (
    <Page title={kind === "research" ? "Research" : "Knowledge"}>
      <Notice error={error} />
      <form className="mb-6 space-y-3 rounded-lg border border-slate-200 bg-white p-5" onSubmit={upload}>
        <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Title" value={title} onChange={event => setTitle(event.target.value)} required />
        <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Description" value={description} onChange={event => setDescription(event.target.value)} />
        {kind === "rag" && (
          <textarea className="min-h-32 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Content for the chatbot" value={content} onChange={event => setContent(event.target.value)} required />
        )}
        <input type="file" onChange={event => setFile(event.target.files?.[0] || null)} />
        <button className={buttonClass} type="submit">Add document</button>
      </form>
      <ul className="divide-y rounded-lg border border-slate-200 bg-white">
        {documents.map(document => (
          <li key={document.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span>{document.title}</span>
            <button className={quietClass} onClick={() => remove(document.id)}>Delete</button>
          </li>
        ))}
        {documents.length === 0 && <li className="px-4 py-6 text-slate-500">No documents yet.</li>}
      </ul>
    </Page>
  );
}
