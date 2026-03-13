document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab.url?.includes("linkedin.com/in/")) {
    document.getElementById('loading').innerText = "Gå til en LinkedIn-profil for å bruke Reachr.";
    return;
  }

  // Inject content script if needed (v3 might handle this via manifest but double checking)
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: "scrape" });
    if (response) {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('content').style.display = 'block';
      
      document.getElementById('name').innerText = response.name || "—";
      document.getElementById('title').innerText = response.title || "—";
      document.getElementById('company').innerText = response.company || "—";
      
      const addBtn = document.getElementById('addBtn');
      addBtn.addEventListener('click', async () => {
        addBtn.disabled = true;
        addBtn.innerText = "Lagrer...";
        
        try {
          // Send to Next.js API
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
            document.getElementById('statusMsg').innerText = "❌ Feil: " + (err.error || "Ikke innlogget");
            addBtn.disabled = false;
            addBtn.innerText = "Prøv igjen";
          }
        } catch (e) {
          document.getElementById('statusMsg').innerText = "❌ Klarte ikke kontakte Reachr. Sjekk at appen kjører på localhost:3001.";
          addBtn.disabled = false;
        }
      });
    }
  } catch (e) {
    document.getElementById('loading').innerText = "Refresh siden for å aktivere Reachr.";
  }
});
