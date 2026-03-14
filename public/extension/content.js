function scrapeLinkedIn() {
  // ── NAME ─────────────────────────────────────────────────────
  // LinkedIn page title is always "Firstname Lastname - Headline | LinkedIn"
  let name = "";
  const titleParts = document.title.split(/[|\-–]/);
  if (titleParts.length >= 1) {
    name = titleParts[0].trim().replace(/\s*\(.*?\)\s*/g, "").trim();
  }
  if (!name) {
    name = (document.querySelector("h1")?.innerText || "").trim();
  }

  // ── COMPANY ──────────────────────────────────────────────────
  let company = "";

  // Search text nodes for "Company · Role" patterns
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  const dotLines = [];
  let node;
  while ((node = walker.nextNode())) {
    const text = (node.nodeValue || "").trim();
    if (
      text.includes("·") &&
      text.length > 2 &&
      text.length < 100 &&
      !text.includes("followers") &&
      !text.includes("connections") &&
      !text.includes("http")
    ) {
      dotLines.push(text);
    }
  }
  if (dotLines.length > 0) {
    company = dotLines[0].split("·")[0].trim();
  }

  // Fallback: try h1 siblings/nearby paragraphs for employer mention
  if (!company) {
    const headline = titleParts[1]?.trim() || "";
    const atMatch = headline.match(/(?:at|@|hos)\s+([A-Z][^\|\n·]{2,40})/i);
    if (atMatch) company = atMatch[1].trim();
  }

  // ── LOCATION ─────────────────────────────────────────────────
  // LinkedIn shows "City, Region, Country" on the profile card
  let location = "";

  // Common location selectors on LinkedIn profile page
  const locCandidates = document.querySelectorAll(
    ".pv-text-details__left-panel .text-body-small, " +
    ".ph5 .mt2 span.text-body-small, " +
    ".pv-top-card--list .pv-top-card--list-bullet"
  );
  for (const el of locCandidates) {
    const text = (el.innerText || el.textContent || "").trim();
    // Locations typically contain comma and are short
    if (
      text &&
      text.length > 3 &&
      text.length < 80 &&
      !text.includes("followers") &&
      !text.includes("connections") &&
      !text.includes("·") &&
      (text.includes(",") || text.match(/\b(nigeria|norway|usa|uk|germany|sweden|denmark|india|australia|canada)\b/i))
    ) {
      location = text;
      break;
    }
  }

  // Fallback: find text between name and first "·" line that looks like a location
  if (!location) {
    // Walk text and find short comma-separated strings
    const walker2 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let n2;
    while ((n2 = walker2.nextNode())) {
      const t = (n2.nodeValue || "").trim();
      if (
        t.includes(",") &&
        t.length > 4 &&
        t.length < 60 &&
        !t.includes("·") &&
        !t.includes("@") &&
        !t.includes("http") &&
        !t.includes("followers") &&
        /[A-Z]/.test(t)
      ) {
        location = t;
        break;
      }
    }
  }

  // ── LINKEDIN URL ──────────────────────────────────────────────
  const linkedinUrl = window.location.href;

  return {
    name:         name     || "—",
    company:      company  || "—",
    location:     location || "—",
    linkedin_url: linkedinUrl,
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    sendResponse(scrapeLinkedIn());
  }
  return true;
});
