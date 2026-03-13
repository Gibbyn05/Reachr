function scrapeLinkedIn() {
  // Selectors for Name
  const name = document.querySelector(".text-heading-xlarge")?.innerText || 
               document.querySelector("h1")?.innerText || "";
  
  // Selectors for Title
  const title = document.querySelector(".text-body-medium.break-words")?.innerText || 
                document.querySelector(".pv-text-details__left-panel div")?.innerText || "";
  
  // Selectors for Company
  let company = "";
  // Try to find current company from the top profile card first
  const topCompany = document.querySelector('[data-field="experience_company_logo"] img')?.alt ||
                    document.querySelector('.pv-text-details__right-panel .inline-show-more-text')?.innerText;
  
  if (topCompany) {
    company = topCompany;
  } else {
    // Fallback to experience section
    const experienceSection = document.querySelector("#experience");
    if (experienceSection) {
      const latestJob = experienceSection.nextElementSibling?.querySelector(".display-flex.flex-column.full-width");
      if (latestJob) {
        company = latestJob.querySelector(".t-14.t-black.t-normal span")?.innerText || "";
      }
    }
  }

  return { 
    name: name.trim(), 
    title: title.trim(), 
    company: company.replace(/Current company/i, "").split(" · ")[0].trim(), 
    linkedin_url: window.location.href 
  };
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    const data = scrapeLinkedIn();
    sendResponse(data);
  }
  return true;
});
