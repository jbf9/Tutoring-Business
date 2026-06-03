# 6–12 Tutoring by Janet Federici

A clean, responsive marketing site for your private 1:1 tutoring service. Built
with HTML, Tailwind CSS (via CDN — no build step), and vanilla JavaScript so it
hosts for free on GitHub Pages and is easy to tweak later.

```
6-12-tutoring/
├── index.html              ← structure (all the page content)
├── css/styles.css          ← design tokens, fonts, components, animations
├── js/main.js              ← menu, scroll reveals, form logic  ← put your Sheet URL here
├── google-apps-script.gs   ← the free Google Sheets backend for the form
└── assets/                 ← (create this) put your photo here as janet.jpg
```

---

## 1. Quick start — preview it locally

Just double-click `index.html`, or for best results run a tiny local server:

```bash
cd 6-12-tutoring
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## 2. Make it yours (where to edit what)

Everything you'll want to change is clearly marked in `index.html` with comments
like `<!-- EDITABLE -->` or `<!-- REPLACE -->`.

| You want to change… | Where |
|---|---|
| Your intro / bio text | **About** section, the `EDITABLE` paragraphs |
| Your education & experience | **About** section, the two `EDITABLE` lists |
| What each service includes + your qualifications | **Services** section, the `EDITABLE` text inside each card |
| Prices | The `service-price` lines in **Services** |
| Your photo | See step 3 below |
| Colors / fonts | `tailwind.config` block in `index.html` head, and `:root` in `css/styles.css` |
| Social links | **Footer** (LinkedIn & Facebook are already set to your profiles) |

### Adding your photo
1. Create a folder named `assets` next to `index.html`.
2. Drop your photo in as `assets/janet.jpg`.
3. In **About**, find the placeholder block (it says *"Your photo goes here"*) and
   replace that inner `<div>…</div>` with:
   ```html
   <img src="assets/janet.jpg" alt="Janet Federici" class="w-full h-full object-cover" />
   ```

---

## 3. Connect the contact form to Google Sheets (free, ~5 min)

The form works immediately in **demo mode** (it logs entries and downloads a
backup file), but to collect responses in a spreadsheet:

1. Go to [sheets.new](https://sheets.new) to create a blank Google Sheet.
2. **Extensions ▸ Apps Script.** Delete the sample code in the editor.
3. Open `google-apps-script.gs` from this project, copy **all** of it, and paste
   it into the Apps Script editor. Save.
4. Click **Deploy ▸ New deployment.** Choose type **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy** and authorize when prompted (Google will warn it's an
   "unverified" app — that's normal for your own script; continue).
6. Copy the **Web app URL** it shows you.
7. Open `js/main.js`, and paste that URL into the first line:
   ```js
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/XXXX/exec";
   ```

Done — every submission now appears as a new row in your Sheet. Tip: in Google
Sheets, **Tools ▸ Notification settings** can email you when a new row arrives.

> Prefer not to use Google? Any service that accepts a form POST works — e.g.
> [Formspree](https://formspree.io) or [SheetDB](https://sheetdb.io). Point
> `GOOGLE_SCRIPT_URL` at their endpoint instead. With no URL set, the form stays
> in demo mode so you never lose an inquiry while setting things up.

---

## 4. Publish on GitHub Pages

1. Create a new repository on GitHub (e.g. `6-12-tutoring`).
2. Upload the **contents** of this folder so that `index.html` sits at the root
   of the repo (not inside a subfolder).
   ```bash
   cd 6-12-tutoring
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/6-12-tutoring.git
   git push -u origin main
   ```
3. On GitHub: **Settings ▸ Pages.** Under "Build and deployment", set
   **Source: Deploy from a branch**, **Branch: `main` / `root`**, then **Save**.
4. Wait a minute, then visit `https://YOUR-USERNAME.github.io/6-12-tutoring/`.

That's it. To update the site later, edit the files and `git push` again.

---

## Notes
- **No build tools required.** Tailwind loads from its CDN, which is perfect for
  GitHub Pages. If you later want a faster production build, the same classes
  work with the Tailwind CLI.
- **Accessibility & responsiveness** are handled: keyboard-friendly form,
  reduced-motion support, and layouts tested for mobile, tablet, and desktop.
- Fonts: **Fraunces** (headings) and **Hanken Grotesk** (body), loaded from
  Google Fonts.
