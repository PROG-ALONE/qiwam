# قِوام

منصة عربية لتعلّم علوم جسم الإنسان: الجسم من الداخل، والتشريح، والحركة، والتأهيل، والغذاء، وكرة القدم، وقصة حقيقية بدأت منها المنصة.

- الخطة الكاملة: [`PLAN.md`](PLAN.md)
- حالة المحتوى: [`CONTENT_STATUS.md`](CONTENT_STATUS.md)

## التشغيل محلياً

```bash
python3 -m http.server 8000
# ثم افتح http://localhost:8000
```

## الفحوصات قبل النشر

```bash
node tools/check-all.mjs            # فحص المحتوى، والملكية، والمراجع (يحتاج إنترنت)، واختبارات الوحدة
node tools/check-all.mjs --offline  # بلا إنترنت (يتخطى الاتصال بـ Crossref وNCBI)
QIWAM_EMAIL=بريدك node tools/verify-refs.mjs   # مع فحص الوصول المفتوح عبر Unpaywall
node tools/fetch-pdfs.mjs           # تنزيل ملفات PDF المسموح بإرفاقها فقط
```

## الاختبار

```bash
python3 tests/walk.py http://localhost:8000/ /tmp/shots     # المدخل كاملًا بقياس آيباد وهاتف وحاسوب
python3 tests/lesson.py http://localhost:8000/ /tmp/shots   # الدرس، والإحالة والرجوع، والمراجع، والاختبار بأنواعه العشرة
```

المحتوى تعليمي، ولا يغني عن الطبيب أو المعالج الطبيعي.
