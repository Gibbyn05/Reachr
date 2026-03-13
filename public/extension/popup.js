document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab || !tab.url?.includes("linkedin.com/in/")) {
    document.getElementById('loading').innerText = "Gå til en LinkedIn personprofil for å bruke Reachr.";
    return;
  }

  async function startScraping() {
    try {
      // 1. Try to send message to existing content script
      let response;
      try {
        response = await chrome.tabs.sendMessage(tab.id, { action: "scrape" });
      } catch (e) {
        // 2. If it fails, script might not be injected. Try injecting it now.
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
        // Try messaging again
        response = await chrome.tabs.sendMessage(tab.id, { action: "scrape" });
      }

      if (response) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        
        document.getElementById('name').innerText = response.name || "—";
        document.getElementById('title').innerText = response.title || "—";
        document.getElementById('company').innerText = response.company || "—";
        
        const addBtn = document.getElementById('addBtn');
        addBtn.onclick = async () => {
          addBtn.disabled = true;
          addBtn.innerText = "Lagrer...";
          
          try {
            const res = await fetch('http://localhost:3001/api/leads/extension', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });
            
            if (res.ok) {
              document.getElementById('statusMsg').innerText = "✅ Lead lagret!";
              document.getElementById('statusMsg').style.color = "#008f52";
              addBtn.style.display = "none";
            } else {
              const err = await res.json();
              document.getElementById('statusMsg').innerText = "❌ Feil: " + (err.error || "Logg inn på Reachr først");
              addBtn.disabled = false;
              addBtn.innerText = "Prøv igjen";
            }
          } catch (e) {
            document.getElementById('statusMsg').innerText = "❌ Klarte ikke kontakte Reachr. Sjekk at du er logget inn i hovedfanen.";
            addBtn.disabled = false;
            addBtn.innerText = "Prøv igjen";
          }
        };
      }
    } catch (e) {
      console.error(e);
      document.getElementById('loading').innerText = "Klarte ikke koble til siden. Prøv å refreshe LinkedIn.";
    }
  }

  startScraping();
});
