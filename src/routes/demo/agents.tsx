import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/demo/components/crud-page";
import { Badge } from "@/demo/components/ui/badge";

export const Route = createFileRoute("/demo/agents")({
  head: () => ({
    meta: [
      { title: "ایجنت‌های هوش مصنوعی | DaalCRM" },
      {
        name: "description",
        content: "ساخت و مدیریت ایجنت‌های هوش مصنوعی با نقش، مدل و دستور اختصاصی.",
      },
      { property: "og:title", content: "ایجنت‌های هوش مصنوعی | DaalCRM" },
      { property: "og:description", content: "ساخت ایجنت هوش مصنوعی برای فروش و پشتیبانی." },
    ],
  }),
  component: Agents,
});

type Agent = {
  id: string;
  name: string;
  role: string | null;
  model: string;
  temperature: number;
  is_active: boolean;
};

function Agents() {
  return (
    <CrudPage<Agent>
      table="ai_agents"
      title="ایجنت‌های هوش مصنوعی"
      description="برای هر وظیفه یک ایجنت با شخصیت و دستور مخصوص خودش بسازید"
      addLabel="ایجنت جدید"
      fields={[
        { name: "name", label: "نام ایجنت", required: true, placeholder: "دستیار فروش" },
        { name: "role", label: "نقش", placeholder: "پیگیری سرنخ‌های جدید" },
        {
          name: "model",
          label: "مدل هوش مصنوعی",
          type: "select",
          options: [
            { value: "gemini-3.5-flash", label: "Gemini 3.5 Flash (سریع و اقتصادی)" },
            { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro (دقیق‌تر)" },
            { value: "gpt-5.1", label: "GPT-5.1 (تحلیل عمیق)" },
            { value: "gpt-5-mini", label: "GPT-5 mini (سریع و اقتصادی)" },
            { value: "gpt-oss-20b", label: "مدل محلی / OpenAI-compatible" },
          ],
        },
        { name: "temperature", label: "خلاقیت (۰ تا ۱)", type: "number" },
        {
          name: "system_prompt",
          label: "دستور سیستمی",
          type: "textarea",
          placeholder: "تو یک کارشناس فروش فارسی‌زبان هستی که...",
        },
      ]}
      columns={[
        { key: "name", label: "نام" },
        { key: "role", label: "نقش" },
        { key: "model", label: "مدل", render: (r) => <Badge variant="secondary">{r.model}</Badge> },
        { key: "temperature", label: "خلاقیت" },
        { key: "is_active", label: "وضعیت", render: (r) => (r.is_active ? "فعال" : "غیرفعال") },
      ]}
      emptyText="هنوز ایجنتی ساخته نشده است."
    />
  );
}
