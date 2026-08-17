# LLM materials

Place Spotify Web Player DOM captures in `snapshots/`:

- `spotify-ad.html`: capture while an advertisement is playing.
- `spotify-content.html`: capture while music or a podcast is playing.

## Capture procedure

1. Open `https://open.spotify.com/` and start playback.
2. Open Chrome DevTools and select the **Elements** panel.
3. Select the root `<html>` element.
4. Right-click it and choose **Copy > Copy outerHTML**.
5. Paste the result into the corresponding snapshot file.
6. Repeat for both advertisement and normal playback states.

Before sharing or committing a capture, remove personal data such as account
names, email addresses, private playlist names, and URLs containing identifiers
or tokens. Raw HTML snapshots are ignored by Git by default.

Useful follow-up prompt:

> Compare the two DOM snapshots in `llm-materials/snapshots/`. Identify the
> smallest stable semantic signal that distinguishes an advertisement from
> normal playback. Prefer `data-testid`, accessibility attributes, and visible
> metadata over generated CSS class names. Implement the detector in
> `src/content.js` and add fixtures-based tests.
