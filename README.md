# Password Strength Checker

A single-page frontend tool that delivers real-time password strength analysis with actionable suggestions and an accessible visual meter.

## Features

- Client-side scoring that favors length, character variety, and uniqueness while penalizing common words, sequential patterns, and repeated characters.
- Color-coded strength meter with descriptive labels (Very Weak → Very Strong).
- Live suggestions list that updates as the user types, explaining how to make the password stronger.
- Responsive design and accessible indicators for screen readers.

## Preview

Open `frontend/index.html` in any modern browser. No build step is required—just double-click the file or serve it with a static file server.

## Structure

```
frontend/
├── index.html  # the demo UI
├── styles.css  # layout, colors, and typography
└── app.js      # scoring logic and DOM updates
```
