const desiredAdStates = new Map();
const updatingTabs = new Set();

function isMutedByMutify(tab) {
  return (
    tab.mutedInfo?.reason === "extension" &&
    tab.mutedInfo.extensionId === chrome.runtime.id
  );
}

async function applyDesiredAdState(tabId) {
  if (updatingTabs.has(tabId)) {
    return;
  }

  updatingTabs.add(tabId);

  try {
    while (desiredAdStates.has(tabId)) {
      const desiredAdState = desiredAdStates.get(tabId);
      const tab = await chrome.tabs.get(tabId);

      if (desiredAdState && !tab.mutedInfo?.muted) {
        await chrome.tabs.update(tabId, { muted: true });
      } else if (!desiredAdState && isMutedByMutify(tab)) {
        await chrome.tabs.update(tabId, { muted: false });
      }

      if (desiredAdStates.get(tabId) === desiredAdState) {
        break;
      }
    }
  } catch (error) {
    console.error(`Failed to update mute state for tab ${tabId}:`, error);
  } finally {
    updatingTabs.delete(tabId);
  }
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (
    message?.type !== "spotify-ad-state" ||
    typeof message.isAd !== "boolean" ||
    sender.tab?.id === undefined
  ) {
    return;
  }

  const tabId = sender.tab.id;
  desiredAdStates.set(tabId, message.isAd);
  void applyDesiredAdState(tabId);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  desiredAdStates.delete(tabId);
});
