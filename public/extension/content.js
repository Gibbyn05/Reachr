// Helper: wait for a DOM element to appear
function waitForElement(selector, timeout = 3000) {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        observer.disconnect();
        resolve(found);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => { observer.disconnect(); resolve(null); }, timeout);
  });
}

// Helper: get text from first matching selector
function getText(selectors) {
  for (const sel of selectors) {
    try {
      const el = document.querySelector(sel);
      if (el) {
        const t = (el.innerText || el.textContent || "").trim();
        if (t) return t;
      }
    } catch(e) {}
  }
  return "";
}

async function scrapeLinkedIn() {
  // ── NAME (from page title — most reliable) ────────────────────
  const titleParts = document.title.split(/[|\-–]/);
  let name = titleParts[0]?.trim().replace(/\s*\(.*?\)\s*/g, "").trim() || "";
  if (!name) name = getText(["h1"]);

  // ── COMPANY (find "Company · Role" dot-pattern lines) ─────────
  let company = "";
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  const dotLines = [];
  let node;
  while ((node = walker.nextNode())) {
    const t = (node.nodeValue || "").trim();
    if (t.includes("·") && t.length > 2 && t.length < 100 &&
        !t.includes("followers") && !t.includes("connections") && !t.includes("http")) {
      dotLines.push(t);
    }
  }
  if (dotLines.length > 0) company = dotLines[0].split("·")[0].trim();

  // ── LOCATION ─────────────────────────────────────────────────
  let location = "";
  const walker2 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let n2;
  while ((n2 = walker2.nextNode())) {
    const t = (n2.nodeValue || "").trim();
    if (t.includes(",") && t.length > 4 && t.length < 60 &&
        !t.includes("·") && !t.includes("@") && !t.includes("http") &&
        !t.includes("followers") && /[A-Z]/.test(t)) {
      location = t;
      break;
    }
  }

  // ── CONTACT INFO (click modal, scrape, close) ─────────────────
  let email = "";
  let phone = "";

  try {
    // Find the "Contact info" link/button — LinkedIn uses an <a> tag with this text
    const contactBtn = [...document.querySelectorAll("a, button")].find(el => {
      const t = (el.innerText || el.textContent || "").trim().toLowerCase();
      return t === "contact info" || t === "kontaktinfo" || t === "vis kontaktinfo";
    });

    if (contactBtn) {
      contactBtn.click();

      // Wait for the modal to open
      const modal = await waitForElement(
        ".pv-contact-info, [data-test-modal], .artdeco-modal, section.ci-vanity-url",
        3000
      );

      if (modal) {
        await new Promise(r => setTimeout(r, 600)); // Let content render

        // Scrape all text from modal
        const modalText = modal.innerText || modal.textContent || "";
        const modalLines = modalText.split("\n").map(l => l.trim()).filter(Boolean);

        for (const line of modalLines) {
          // Email pattern
          if (!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(line)) {
            email = line;
          }
          // Phone: digits, spaces, +, (, ) — at least 7 chars
          if (!phone && /^[\d\s\+\(\)\-]{7,20}$/.test(line)) {
            phone = line;
          }
        }

        // Also check for <a href="tel:..."> and <a href="mailto:...">
        if (!phone) {
          const telLink = modal.querySelector("a[href^='tel:']");
          if (telLink) phone = telLink.href.replace("tel:", "").trim();
        }
        if (!email) {
          const mailLink = modal.querySelector("a[href^='mailto:']");
          if (mailLink) email = mailLink.href.replace("mailto:", "").trim();
        }

        // Close the modal
        const closeBtn = modal.closest("[data-test-modal-container]")?.querySelector("[data-test-modal-close-btn], button[aria-label='Dismiss'], .artdeco-modal__dismiss");
        if (closeBtn) closeBtn.click();
        else {
          // fallback: press Escape
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", keyCode: 27, bubbles: true }));
        }
      }
    }
  } catch (e) {
    console.warn("Reachr: Could not fetch contact info", e);
  }

  return {
    name:         name     || "—",
    company:      company  || "—",
    location:     location || "—",
    email:        email    || "—",
    phone:        phone    || "—",
    linkedin_url: window.location.href,
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    // Must return true for async response
    scrapeLinkedIn().then(sendResponse);
    return true;
  }
});
