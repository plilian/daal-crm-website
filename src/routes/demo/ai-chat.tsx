import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/demo/components/app-shell";
import { Button } from "@/demo/components/ui/button";
import { Textarea } from "@/demo/components/ui/textarea";
import { useTable, formatMoney, STAGE_LABELS, type Stage } from "@/demo/lib/crm";
import { Bot, User, Send } from "lucide-react";
import { useAuth } from "@/demo/hooks/use-auth";

export const Route = createFileRoute("/demo/ai-chat")({
  head: () => ({
    meta: [
      { title: "چت با داده‌ها | DaalCRM" },
      {
        name: "description",
        content: "با هوش مصنوعی درباره مخاطبین، معاملات و عملکرد فروش گفتگو کنید.",
      },
      { property: "og:title", content: "چت با داده‌ها | DaalCRM" },
      { property: "og:description", content: "پرسش و پاسخ هوشمند روی داده‌های CRM." },
    ],
  }),
  component: AiChat,
});

type Msg = { role: "user" | "assistant"; content: string };
type AiProvider = "auto" | "ai_openai" | "ai_gemini" | "ai_compatible";

const SUGGESTIONS = [
  "خلاصه وضعیت فروش این ماه چیست؟",
  "کدام معاملات در خطر از دست رفتن هستند؟",
  "برای پیگیری سرنخ‌های جدید چه پیشنهادی داری؟",
];

function AiChat() {
  const { isDemo } = useAuth();
  const { data: contacts } = useTable<{ id: string; full_name: string }>("contacts");
  const { data: deals } = useTable<{ id: string; title: string; amount: number; stage: Stage }>(
    "deals",
  );
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [provider, setProvider] = useState<AiProvider>("auto");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading || isDemo) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const context = [
      `تعداد مخاطبین: ${contacts?.length ?? 0}`,
      `تعداد معاملات: ${deals?.length ?? 0}`,
      `مجموع ارزش معاملات: ${formatMoney((deals ?? []).reduce((s, d) => s + (d.amount ?? 0), 0))}`,
      "معاملات:",
      ...(deals ?? [])
        .slice(0, 30)
        .map(
          (d) => `- ${d.title} | ${formatMoney(d.amount)} | ${STAGE_LABELS[d.stage] ?? d.stage}`,
        ),
    ].join("\n");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          context,
          provider: provider === "auto" ? undefined : provider,
        }),
      });
      const data = (await res.json()) as { content?: string; error?: string };
      setMessages([
        ...next,
        { role: "assistant", content: data.content ?? data.error ?? "خطایی رخ داد." },
      ]);
    } catch {
      setMessages([...next, { role: "assistant", content: "ارتباط با سرور برقرار نشد." }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div>
      <PageHeader
        title="چت با داده‌ها"
        description="سوال بپرسید، هوش مصنوعی روی داده‌های CRM شما پاسخ می‌دهد"
      />

      <div className="surface-panel flex h-[65vh] flex-col p-0">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <span className="text-xs text-muted-foreground">موتور پاسخ‌گویی</span>
          <select
            value={provider}
            onChange={(event) => setProvider(event.target.value as AiProvider)}
            disabled={isDemo}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
            aria-label="موتور پاسخ‌گویی"
          >
            <option value="auto">انتخاب خودکار</option>
            <option value="ai_openai">OpenAI</option>
            <option value="ai_gemini">Google Gemini</option>
            <option value="ai_compatible">OpenAI-compatible / Local AI</option>
          </select>
        </div>
        <div ref={boxRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <Bot className="size-10 text-primary" />
              <p className="text-sm text-muted-foreground">
                {isDemo
                  ? "این بخش در دموی عمومی فقط برای مشاهده ساختار محصول نمایش داده می‌شود."
                  : "یکی از پیشنهادها را انتخاب کنید یا سوال خودتان را بنویسید."}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    disabled={isDemo}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-1 shrink-0 rounded-full bg-muted p-1.5">
                  {m.role === "user" ? (
                    <User className="size-4" />
                  ) : (
                    <Bot className="size-4 text-primary" />
                  )}
                </div>
                <div
                  className={
                    m.role === "user"
                      ? "rounded-2xl bg-primary px-4 py-2 text-sm text-primary-foreground"
                      : "whitespace-pre-wrap text-sm leading-7 text-foreground"
                  }
                >
                  {m.content}
                </div>
              </div>
            ))
          )}
          {loading ? (
            <p className="animate-pulse text-sm text-muted-foreground">در حال فکر کردن…</p>
          ) : null}
        </div>

        <form
          className="flex items-end gap-2 border-t border-border p-4"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Textarea
            ref={inputRef}
            value={input}
            disabled={isDemo}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder={isDemo ? "چت در دموی عمومی غیرفعال است" : "سوالت را بنویس…"}
            className="min-h-11 resize-none"
          />
          <Button type="submit" size="icon" disabled={loading || isDemo} aria-label="ارسال">
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
