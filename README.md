# Discord Status Logger (Tampermonkey)

Logs a Discord user’s presence (online / idle / DND / offline) over time by reading the **web app’s DOM** — **no bots, no API calls, no self-botting**. A small floating “View Logs” button lets you see the history inline.

> ⚠️ **Important:** Automating or scraping may violate Discord’s Terms of Service. Use only on your own account, for personal/educational purposes, and at your own risk.

---

## Features

* ✅ Polls every 15s (configurable)
* ✅ Captures transitions only (dedupes repeated states)
* ✅ Stores logs in Tampermonkey storage (per-user key)
* ✅ One-click in-page “View Logs” (timestamped list)

---

## How it works (high level)

* Finds the target user’s avatar element in the DOM and inspects the surrounding container’s `aria-label` to infer presence (`online`, `idle`, `do not disturb`; defaults to `offline` when not found).
* On status change, appends `{status, timestamp}` to a per-user array stored via `GM_setValue`.

---

## Installation

1. **Install Tampermonkey**

   * Chrome/Edge: Chrome Web Store
   * Firefox: Add-ons

2. **Create the userscript**

   * Tampermonkey icon → **Create a new script…**
   * Paste your script (the one you shared) into the editor.
   * **Save**.

3. **Configure target user**

   * Set `TARGET_USER_ID` in the script header:

     ```js
     const TARGET_USER_ID = '78346573463456';
     ```
   * To get a user’s ID: Discord **User Settings → Advanced → Developer Mode (On)** → right-click the user → **Copy User ID**.

---

## Usage

1. Open **[https://discord.com/app](https://discord.com/app)** and navigate to a place where the target user is visible (DM, member list, recent messages, etc.).
2. Leave the tab open; the script polls every `CHECK_INTERVAL_MS` (default `15000` ms).
3. Click **“View Logs”** (top-right floating button) to see the recorded history.

> Tip: The script only detects presence when Discord has rendered an element for that user in the current view. If they aren’t visible anywhere in the DOM, it will likely show `offline`.

---

## Data & Storage

* Stored under a Tampermonkey key:
  `status_log_<TARGET_USER_ID>`
* Format:

  ```json
  [
    { "status": "online", "timestamp": "20/08/2025, 13:42:11" },
    { "status": "idle",   "timestamp": "20/08/2025, 13:55:30" }
  ]
  ```
* **Where to view / clear:**

  * Tampermonkey Dashboard → your script → **Storage** tab → locate `status_log_<id>` → copy or delete.

---

## Configuration

* **Poll interval:** change `CHECK_INTERVAL_MS` (e.g., `5000` for 5s).
* **Storage key:** auto-namespaced per target user; you can change `STORAGE_KEY` if you want a custom name.

---

## Limitations

* **Fragile to Discord UI changes:** relies on selectors + `aria-label`. Any DOM/CSS change by Discord can break detection.
* **Must be visible:** If the target user isn’t rendered in your current view, presence may read as `offline`.
* **Browser-only:** Works on desktop web app, not native clients or mobile.
* **Tab must stay open:** No background logging if the page is closed or your machine sleeps.

---

## Troubleshooting

* **No “View Logs” button:** Ensure Tampermonkey is enabled on `https://discord.com/*` and the script is **Enabled**. Refresh the page.
* **Always shows offline:** Make sure the user is visible (open a DM with them or a server where they’re listed). Their avatar selector may differ; moving the mouse over their avatar or opening the user popout can help render the right container.
* **Duplicate / noisy logs:** Lower the poll rate or keep as-is (the script only logs on status **change**).

---

## Roadmap ideas (optional enhancements)

* Export to CSV (add a small “Export” button that builds and downloads a CSV).
* Clear logs button.
* Use a `MutationObserver` to react to user popouts/member list updates instead of fixed polling.
* More robust selectors with fallbacks for different Discord layouts.

---

## Security, Privacy & ToS

* Intended for **personal use**. Respect others’ privacy and local laws.
* Check Discord’s ToS and your jurisdiction’s regulations regarding automation and data collection before using.

---

## License

MIT (or your preference). Add a `LICENSE` file if you plan to publish.

---

## Changelog

* **v1.0** — Initial release (polling + change-only logging + inline viewer).
