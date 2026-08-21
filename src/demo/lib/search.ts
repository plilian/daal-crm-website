/**
 * نرمال‌سازی متن برای جستجوی فارسی — ارقام، ی/ک عربی، اعراب.
 */

const CHAR_MAP: Record<string, string> = {
  ي: "ی",
  ى: "ی",
  ئ: "ی",
  ك: "ک",
  أ: "ا",
  إ: "ا",
  آ: "ا",
  ٱ: "ا",
  ة: "ه",
  ؤ: "و",
};

/** ارقام فارسی/عربی → لاتین (برای مقایسهٔ یکسان) */
export function toLatinDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - "۰".charCodeAt(0)))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - "٠".charCodeAt(0)));
}

export function normalizeSearchText(input: string | null | undefined): string {
  let s = String(input ?? "")
    .trim()
    .toLowerCase();
  if (!s) return "";
  s = toLatinDigits(s);
  s = s.replace(/[يىئكأإآٱةؤ]/g, (ch) => CHAR_MAP[ch] ?? ch);
  // اعراب، tatweel، کاراکترهای جهت و عرض صفر
  s = s.replace(/[\u064B-\u065F\u0670\u0640\u200B-\u200F\u202A-\u202E\uFEFF]/g, "");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

function stringifySearchValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) return value.map(stringifySearchValue).join(" ");
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .map(stringifySearchValue)
      .join(" ");
  }
  return "";
}

/** آیا متن haystack شامل needle است؟ (پس از نرمال‌سازی) */
export function searchIncludes(haystack: unknown, needle: string): boolean {
  const n = normalizeSearchText(needle);
  if (!n) return true;
  return normalizeSearchText(stringifySearchValue(haystack)).includes(n);
}

const NESTED_RELATIONS = ["contacts", "staff", "services", "companies", "users"] as const;

/** آیا ردیف جدول با عبارت جستجو جور است؟ */
export function rowMatchesSearch(
  row: Record<string, unknown>,
  keys: string[],
  query: string,
): boolean {
  const n = normalizeSearchText(query);
  if (!n) return true;

  const chunks: unknown[] = [];
  for (const key of keys) {
    chunks.push(row[key]);
  }
  for (const rel of NESTED_RELATIONS) {
    if (rel in row) chunks.push(row[rel]);
  }
  return searchIncludes(chunks.join(" "), n);
}
