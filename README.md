# Pixel Pomo

A retro pixel-art Pomodoro timer built with plain HTML, CSS, and JavaScript. No build step or account needed.
<img width="2940" height="1654" alt="image" src="https://github.com/user-attachments/assets/a995f73c-c44f-4a3f-bc70-d8c09cc69c87" />

Deployed project : https://pixel-pomodoro-gold.vercel.app
access it here and start being productive ☝️🤓🪬

## Use it

Open `index.html` in a browser. Start a 25-minute focus session, then take a 5-minute break. After four completed focus sessions, the next break is 15 minutes. Switching modes or skipping a session does not award a completed focus session. The next timer starts paused, so you control when to begin.

Use **Space** to start/pause and **R** to reset when you are not typing into a control. The daily contribution graph and completed-session count are stored in your browser's `localStorage`. They remain on that browser/device; clearing site data removes them. The timer also resumes based on its saved deadline if you return while it was running.

## Deploy on GitHub Pages

1. Create a new GitHub repository and add `index.html`, `styles.css`, and `app.js` at its root. `README.md` can go there too.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**. Select the `main` branch and the **/(root)** folder, then save.
4. After GitHub publishes it, open `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

All file references are relative, so this works at a repository subpath. The Google-hosted fonts need an internet connection; system monospace fallbacks are provided.

## Notes on requested visual components

The supplied `<h />` and `<C />` snippets are placeholders, not usable configurations. The `@reactbits-starter` shadcn registry is not configured or publicly resolvable in this project. To keep this deliverable genuinely deployable as plain HTML/CSS/JS, the flickering Squares Terminal-style grid and interactive Pixel Sculpt-style pixel character are implemented locally in `app.js`, without a React dependency.
