function scrapeLinkedIn() {
  const name = document.querySelector(".text-heading-xlarge")?.innerText || "";
  const title = document.querySelector(".text-body-medium.break-words")?.innerText || "";
  
  // Try to find current company
  let company = "";
  const experienceSection = document.querySelector("#experience");
  if (experienceSection) {
    const latestJob = experienceSection.nextElementSibling?.querySelector(".display-flex.flex-column.full-width");
    if (latestJob) {
      company = latestJob.querySelector(".t-14.t-black.t-normal span")?.innerText || "";
    }
  }

  return { 
    name: name.trim(), 
    title: title.trim(), 
    company: company.split(" · ")[0].trim(), 
    linkedin_url: window.location.href 
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    sendResponse(scrapeLinkedIn());
  }
  return true;
});
