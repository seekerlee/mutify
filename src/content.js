let lastReportedAdState;
let enabled;
let detectionTimer;

function detectAdvertisement() {
  const nowPlayingBar = document.querySelector(
    '[data-testid="now-playing-bar"]'
  );

  if (!nowPlayingBar) {
    return false;
  }

  return (
    nowPlayingBar.getAttribute("data-testadtype") === "ad-type-ad" ||
    nowPlayingBar.querySelector('[data-context-item-type="ad"]') !== null ||
    nowPlayingBar.querySelector('[data-testid="ad-controls"]') !== null
  );
}

function reportAdState() {
  if (enabled === undefined) {
    return;
  }

  const isAd = enabled && detectAdvertisement();

  if (isAd === lastReportedAdState) {
    return;
  }

  lastReportedAdState = isAd;
  chrome.runtime.sendMessage({
    type: "spotify-ad-state",
    isAd
  });
}

function scheduleAdStateReport() {
  if (detectionTimer !== undefined) {
    return;
  }

  detectionTimer = setTimeout(() => {
    detectionTimer = undefined;
    reportAdState();
  }, 100);
}

const observer = new MutationObserver(scheduleAdStateReport);

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: [
    "data-testid",
    "data-testadtype",
    "data-context-item-type"
  ]
});

chrome.storage.local.get({ enabled: true }, (settings) => {
  enabled = settings.enabled;
  reportAdState();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local" || changes.enabled === undefined) {
    return;
  }

  enabled = changes.enabled.newValue;
  reportAdState();
});
