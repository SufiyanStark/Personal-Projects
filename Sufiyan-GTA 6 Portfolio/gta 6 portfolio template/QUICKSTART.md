# ⚡ QUICKSTART GUIDE — GTA 6 STYLE PORTFOLIO

Build your own high-performance, Vice City-themed cinematic scroll portfolio in 3 easy steps!

---

## 🏎️ Step 1: Add Your Images

Place your 4 personal assets into `assets/images/`:
- `image1.png` — Cutout photo of yourself (Hero Card)
- `image2.jpg` — Field photo or avatar (Career Card)
- `image3.png` — Screenshot for Project 1
- `image4.png` — Screenshot for Project 2

---

## 📝 Step 2: Update Your Info

Open `index.html` and replace the placeholder text:
- `YOUR NAME` -> Your full name
- `YOUR TITLE` -> Your professional role
- Update job bullets in **01 — CAREER**
- Update project descriptions in **02 — PROJECTS**
- Update tech stack tags in **03 — TECH STACK**
- Update contact links in **GET IN TOUCH**

---

## 🎬 Step 3 (Optional): Replace Background Videos

To use your own background videos:
1. Put Video 1 (e.g. city drive) into `assets/sequence/`
2. Put Video 2 (e.g. speed tunnel) into `assets/sequence2/`
3. Run the python extraction script:
   ```bash
   python scripts/extract_sequences.py
   ```
4. Update `SEQ1_COUNT` and `SEQ2_COUNT` in `main.js` to match your extracted frame counts!

---

## 💡 AI Prompting

You can copy any prompt from [PROMPTS.md](PROMPTS.md) and feed it into Google Antigravity, Claude, ChatGPT, or Cursor to automatically build and customize your portfolio for you!
