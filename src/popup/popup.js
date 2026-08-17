const enabledInput = document.querySelector("#enabled");
const cueEnabledInput = document.querySelector("#cue-enabled");

chrome.storage.local.get(
  { enabled: true, cueEnabled: true },
  ({ enabled, cueEnabled }) => {
    enabledInput.checked = enabled;
    cueEnabledInput.checked = cueEnabled;
  }
);

enabledInput.addEventListener("change", () => {
  chrome.storage.local.set({ enabled: enabledInput.checked });
});

cueEnabledInput.addEventListener("change", () => {
  chrome.storage.local.set({ cueEnabled: cueEnabledInput.checked });
});
