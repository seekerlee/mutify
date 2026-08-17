# Mutify

Mutify is a minimal Chrome extension that automatically mutes Spotify Web
Player advertisements and restores the sound when regular playback resumes.

Unlike extensions that skip or block advertisements, Mutify does not interfere
with Spotify's playback or network requests. It only controls the tab's mute
state.

## Features

- Automatically detects and mutes advertisements.
- Restores sound after an advertisement ends.
- Never unmutes a tab that the user muted manually.
- Can be enabled or disabled from the extension popup.
- Uses semantic player state instead of generated CSS class names or localized
  text.
- Requires no build step or runtime dependencies.

## Install

1. Download and extract the source archive.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Choose the extracted Mutify directory.

Chrome may block direct installation of CRX files that are not distributed
through the Chrome Web Store. Loading the extracted extension is the supported
development installation method.

## How it works

The content script observes Spotify's now-playing bar and combines multiple
semantic advertisement signals:

- `data-testadtype="ad-type-ad"`
- `data-context-item-type="ad"`
- the `ad-controls` component

The background service worker mutes the Spotify tab while an advertisement is
active. It only restores sound when Chrome reports that Mutify itself applied
the mute.

## Development

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose this project directory.
5. After changing the source, select **Reload** on the extension card.

The project uses plain JavaScript and Chrome Manifest V3, so no package install
or build command is required.

DOM samples used to develop the detector belong under
`llm-materials/snapshots/`. HTML snapshots are ignored by Git because they may
contain account or listening information.

## Permissions

- `tabs`: mute and unmute the active Spotify tab.
- `storage`: save the enabled setting.
- `https://open.spotify.com/*`: run advertisement detection only in Spotify Web
  Player.

## Limitations

Spotify may change its Web Player DOM. The detector deliberately combines
several semantic signals to reduce that risk, but a future Spotify update may
still require a selector update.
