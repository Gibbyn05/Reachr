function scrapeLinkedIn() {
  // Helper: get visible text from first matching selector
  function get(selectors) {
    for (const sel of selectors) {
      try {
        const el = document.querySelector(sel);
        if (el) {
          const text = (el.innerText || el.textContent || "").trim();
          if (text) return text;
        }
      } catch(e) {}
    }
    return "";
  }

  // --- NAME: h1 is the most reliable ---
  const name = get([
    "h1.text-heading-xlarge",
    "h1",
    ".pv-top-card--list h1"
  ]);

  // --- TITLE: the div/span right under the name on profile top card ---
  const title = get([
    ".text-body-medium.break-words",
    ".ph5 .mt2 .t-black.t-normal",
    ".pv-top-card--list-bullet .t-16"
  ]).split("\n")[0].split("·")[0].trim();

  // --- COMPANY: look through page text for "at CompanyName" patterns ---
  // Use the top experience entry - look at ALL spans for short text
  let company = "";
  
  // Method 1: find the "top card" experience button (shows current employer)
  const expButtonSpans = document.querySelectorAll(
    ".pv-text-details__right-panel span[aria-hidden='true'], " +
    ".ph5 .mt2 button span[aria-hidden='true']"
  );
  for (const span of expButtonSpans) {
    const t = (span.innerText || span.textContent || "").trim();
    if (t && t.length > 1 && t.length < 60 && !t.includes("@") && !t.includes("http")) {
      company = t.split("·")[0].trim();
      break;
    }
  }

  // Method 2: look at experience section - first list item company name
  if (!company || company === "—") {
    const expSection = document.getElementById("experience");
    if (expSection) {
      const parent = expSection.closest("section") || expSection.parentElement;
      if (parent) {
        const boldSpans = parent.querySelectorAll(".t-bold span[aria-hidden='true'], .t-bold span:not([aria-hidden='false'])");
        for (const span of boldSpans) {
          const t = (span.innerText || span.textContent || "").trim();
          if (t && t.length > 1 && t.length < 80) {
            company = t;
            break;
          }
        }
      }
    }
  }

  // Method 3: find "at [Company]" pattern in the headline text
  if (!company || company === "—") {
    const headline = get([".text-body-medium.break-words", ".pv-top-card--list .t-18"]);
    const atMatch = headline.match(/ (?:at|@|hos) (.+?)(?:\s*[·|]\s*|$)/i);
    if (atMatch) company = atMatch[1].trim();
  }

  // Guard: if company looks like a sentence (>= 60 chars), blank it
  if (company && company.length >= 60) company = "";

  return {
    name:        name    || "—",
    title:       title   || "—",
    company:     company || "—",
    linkedin_url: window.location.href
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    sendResponse(scrapeLinkedIn());
  }
  return true;
});
