function scrapeLinkedIn() {
  // ── NAME ─────────────────────────────────────────────────────
  // LinkedIn page title is always "Firstname Lastname - Headline | LinkedIn"
  let name = "";
  const titleParts = document.title.split(/[|\-–]/);
  if (titleParts.length >= 1) {
    name = titleParts[0].trim();
    // Remove "(Nickname)" or "(X)" patterns sometimes added
    name = name.replace(/\s*\(.*?\)\s*/g, "").trim();
  }

  // Fallback: any h1
  if (!name) {
    name = (document.querySelector("h1")?.innerText || "").trim();
  }

  // ── TITLE ────────────────────────────────────────────────────
  // Method 1: the subtitle under h1 — look for ANY div/span with reasonable length
  // that follows the h1 in the top profile card
  let title = "";
  
  // Try to get it from page title: "Name - Title | LinkedIn"
  if (titleParts.length >= 2) {
    const candidate = titleParts[1].trim();
    if (candidate && candidate.toLowerCase() !== "linkedin" && candidate.length < 120) {
      title = candidate.split("|")[0].split("·")[0].trim();
    }
  }

  if (!title) {
    // Look for text right after h1 in the DOM
    const h1 = document.querySelector("h1");
    if (h1) {
      let el = h1.nextElementSibling;
      for (let i = 0; i < 5 && el; i++) {
        const t = (el.innerText || el.textContent || "").trim();
        if (t && t.length > 3 && t.length < 150 && !t.includes("followers") && !t.includes("connections")) {
          title = t.split("\n")[0].split("|")[0].trim();
          break;
        }
        el = el.nextElementSibling;
      }
    }
  }

  // ── COMPANY ──────────────────────────────────────────────────
  // Look for text matching "Company · Job" pattern on the page
  let company = "";

  // Search ALL visible text nodes for "Company · Role" patterns
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const dotPatternLines = [];
  let node;
  while ((node = walker.nextNode())) {
    const text = (node.nodeValue || "").trim();
    // "Company · Something" lines that are short enough to be a company entry
    if (text.includes("·") && text.length > 2 && text.length < 100 && !text.includes("followers") && !text.includes("connections") && !text.includes("http")) {
      dotPatternLines.push(text);
    }
  }

  if (dotPatternLines.length > 0) {
    // First match is usually the current company
    company = dotPatternLines[0].split("·")[0].trim();
  }

  // Fallback: look for "at Company" in the headline/title
  if (!company) {
    const match = title.match(/(?:at|@|hos)\s+([A-Z][^\|\n·]{2,40})/i);
    if (match) company = match[1].trim();
  }

  return {
    name:         name    || "—",
    title:        title   || "—",
    company:      company || "—",
    linkedin_url: window.location.href
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    sendResponse(scrapeLinkedIn());
  }
  return true;
});
