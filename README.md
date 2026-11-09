# Nexrox Games

A small, responsive browser-game directory built with plain HTML, CSS, and JavaScript. Game entries are stored in `games.json`; the page displays them as cards and opens each game's URL in a sandboxed iframe.

## Run locally

Because the page loads `games.json` with `fetch`, serve this directory over HTTP instead of opening `index.html` directly. For example:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Add a game

Add an object to the array in `games.json`:

```json
{
  "title": "Example game",
  "category": "Arcade",
  "description": "A short game description.",
  "icon": "🎮",
  "color": ["#493b78", "#252b46"],
  "iframe": "https://your-authorized-game-host.example/game"
}
```

Use a game URL you own or have permission to embed. The host must allow framing; sites that send restrictive `X-Frame-Options` or Content Security Policy headers cannot be embedded. `iframe` is the game URL, which the app loads into a sandboxed HTML iframe.
