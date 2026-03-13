function scrapeLinkedIn() {
  // --- NAME ---
  const name =
    document.querySelector(".text-heading-xlarge")?.innerText?.trim() ||
    document.querySelector("h1")?.innerText?.trim() ||
    "";

  // --- TITLE (current job title) ---
  // LinkedIn puts the headline/title right under the name
  const title =
    document.querySelector(".text-body-medium.break-words")?.innerText?.trim() ||
    "";

  // --- COMPANY --- 
  // Strategy: look at the top card's experience button which shows "Company · Title"
  // OR look at the first experience list item
  let company = "";

  // 1. Try the "Current company" button in the top card (most reliable)
  const topCardButtons = document.querySelectorAll(".pv-text-details__right-panel .display-flex.align-items-center span[aria-hidden='true']");
  for (const span of topCardButtons) {
    const text = span.innerText?.trim();
    // These spans contain "Company · Role" or just company name
    if (text && text.length > 0 && text.length < 80 && !text.includes("http")) {
      company = text.split("·")[0].trim();
      break;
    }
  }

  // 2. Try the "Experience" section — first company name
  if (!company) {
    const expItems = document.querySelectorAll("#experience ~ div .pvs-list__item--line-separated, #experience + div li");
    for (const item of expItems) {
      // Company name is typically in a .t-14.t-normal or similar element
      const companyEl =
        item.querySelector(".t-14.t-normal span[aria-hidden='true']") ||
        item.querySelector("[data-field='experience_company_logo'] ~ div .t-bold span");
      if (companyEl) {
        company = companyEl.innerText?.split("·")[0]?.trim();
        break;
      }
    }
  }

  // 3. Fallback — try structured data from JSON-LD
  if (!company) {
    const ldScript = document.querySelector('script[type="application/ld+json"]');
    if (ldScript) {
      try {
        const json = JSON.parse(ldScript.textContent || "{}");
        company = json?.worksFor?.[0]?.name || "";
      } catch {}
    }
  }

  // Clean up — never return long prose text as company
  if (company && company.length > 80) company = "";

  return {
    name: name || "—",
    title: title.split("·")[0].trim() || "—",
    company: company || "—",
    linkedin_url: window.location.href,
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    sendResponse(scrapeLinkedIn());
  }
  return true;
});
