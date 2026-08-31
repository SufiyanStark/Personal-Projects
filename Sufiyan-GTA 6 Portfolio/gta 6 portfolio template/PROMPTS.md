# 🌴 PROMPTS FOR AI ASSISTANTS

Use these ready-to-copy prompts with your AI assistant (Google Antigravity, Claude, ChatGPT, or Cursor) to customize and generate your own GTA 6 / Vice City style cinematic scroll portfolio!

---

## 🚀 Prompt 1: Full Portfolio Generator & Setup Prompt

Copy and paste this prompt when starting your portfolio build:

```text
Act as an expert Frontend Architect specializing in GSAP ScrollTrigger, HTML5 Canvas, and Vice City / GTA 6 aesthetic UIs.

I am building my cinematic scroll portfolio using this template codebase.

Here is my personal details and resume info:
- Name: [YOUR FULL NAME]
- Title / Role: [YOUR ROLE e.g. Senior Frontend Engineer]
- Location: [YOUR CITY, COUNTRY]
- Bio: [A 2-3 SENTENCE BIO ABOUT YOUR EXPERTISE]
- Career Highlights:
  1. [COMPANY 1] - [ROLE 1] ([DATES 1]): [KEY ACHIEVEMENT 1], [ACHIEVEMENT 2]
  2. [COMPANY 2] - [ROLE 2] ([DATES 2]): [KEY ACHIEVEMENT 1], [ACHIEVEMENT 2]
- Featured Projects:
  1. [PROJECT 1 NAME]: [1-SENTENCE DESCRIPTION], Tech Stack: [REACT, TS, TAILWIND]
  2. [PROJECT 2 NAME]: [1-SENTENCE DESCRIPTION], Tech Stack: [NODE.JS, PYTHON, AWS]
- Tech Stack: [LIST YOUR TOP 10-15 SKILLS/TOOLS]
- Contact Links: Email: [YOUR EMAIL], LinkedIn: [YOUR LINKEDIN], GitHub: [YOUR GITHUB]

Please update index.html with my resume info, ensure my placeholder images are wired up (image1.png for Hero cutout, image2.jpg for Recon photo, image3.png for Project 1, image4.png for Project 2), and verify that main.js handles the canvas scroll scrub cleanly!
```

---

## 🎬 Prompt 2: Background Video Sequence Replacement Prompt

Copy and paste this prompt when you add your own background videos:

```text
I have added 2 new videos for my portfolio background:
1. Video 1 placed inside assets/sequence/ (e.g., street drive video)
2. Video 2 placed inside assets/sequence2/ (e.g., laser speed tunnel continuation video)

Please run the python extraction script `python scripts/extract_sequences.py` to:
1. Trim the first 0.7 seconds from Video 1 and extract frames to assets/sequence/frame_XXXX.webp.
2. Trim the first 2.0 seconds from Video 2, extract 2s-7s transition, and repeat 7s-10s laser tunnel 4x into assets/sequence2/frame2_XXXX.webp.
3. Update SEQ1_COUNT and SEQ2_COUNT in main.js and index.html to match the exact frame count extracted!
```

---

## 🎨 Prompt 3: Customizing Colors & Styling

Copy and paste this prompt to change color themes:

```text
I want to customize the Vice City color scheme in style.css:
- Primary Glow Accent: Change from Cyan (#31e6ff) to [YOUR PREFERRED CYAN/NEON COLOR]
- Secondary Accent: Change from Vice Magenta (#ff2f9e) to [YOUR PREFERRED MAGENTA/PURPLE COLOR]
- Background Night Gradient: Customize CSS variables in style.css

Ensure all frosted glass panels, hover card glow borders, and custom neon crosshair cursor reflect the new color variables cleanly!
```

---

## 📸 Prompt 4: Wiring Up Custom Portrait & Project Screenshots

Copy and paste this prompt after placing your images in `assets/images/`:

```text
I have uploaded my custom images to assets/images/:
- image1.png: Transparent PNG cutout of myself for the Hero Operative Card
- image2.jpg: Field photo for Career Deploy Log
- image3.png: Screenshot for Project 1 (Warehouse CRM / App)
- image4.png: Screenshot for Project 2 (Mobile App / E-commerce)

Please update index.html to reference these files, ensure 3D card tilt animation is clamped to ±5 degrees, and verify responsive scaling for mobile screens.
```
