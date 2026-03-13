function scrapeLinkedIn() {
  const getText = (selectors) => {
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el && el.innerText.trim()) return el.innerText.trim();
    }
    return "";
  };

  const name = getText([
    ".text-heading-xlarge",
    "h1.text-heading-xlarge",
    ".pv-top-card--list:first-child",
    "h1"
  ]);

  const title = getText([
    ".text-body-medium.break-words",
    ".pv-text-details__left-panel .text-body-medium",
    "div.text-body-medium"
  ]);

  let company = getText([
    '[data-field="experience_company_logo"] img',
    '.pv-text-details__right-panel .inline-show-more-text',
    '.pv-top-card--experience-list-item [aria-label*="Nåværende bedrift"]',
    '.pv-top-card--experience-list-item'
  ]);

  // Clean up company string
  if (company.includes("Logo")) company = company.replace("Logo", "");
  company = company.replace(/Current company/i, "").split("·")[0].trim();

  // Last fallback - check experience section directly
  if (!company || company === "—") {
    const exp = document.querySelector("#experience");
    if (exp) {
      const firstCompany = exp.parentElement.querySelector(".t-14.t-black.t-normal span");
      if (firstCompany) company = firstCompany.innerText.split("·")[0].trim();
    }
  }

  return {
    name: name || "—",
    title: title || "—",
    company: company || "—",
    linkedin_url: window.location.href
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    sendResponse(scrapeLinkedIn());
  }
  return true;
});
