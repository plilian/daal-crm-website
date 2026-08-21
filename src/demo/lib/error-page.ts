export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>خطا در بارگذاری صفحه</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" />
    <style>
      body { font-family: Vazirmatn, system-ui, -apple-system, sans-serif; font-size: 15px; line-height: 1.8; background: #0b0f19; color: #e2e8f0; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; background: #111827; border: 1px solid #1f2937; border-radius: 1rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #94a3b8; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.5rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #8b5cf6; color: #fff; }
      .secondary { background: #1f2937; color: #e2e8f0; border-color: #374151; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>صفحه بارگذاری نشد</h1>
      <p>مشکلی از سمت سرور رخ داده است. می‌توانید صفحه را دوباره بارگذاری کنید یا به خانه برگردید.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">تلاش دوباره</button>
        <a class="secondary" href="/">بازگشت به خانه</a>
      </div>
    </div>
  </body>
</html>`;
}
