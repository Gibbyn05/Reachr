document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('loading');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url?.includes("linkedin.com/in/")) {
    statusEl.innerText = "Gå til en LinkedIn personprofil for å bruke Reachr.";
    return;
  }

  statusEl.innerText = "Henter profil-data...";

  // Give content script a moment to load if page just loaded
  await new Promise(r => setTimeout(r, 500));

  try {
    // Send message to already-injected content script (declared in manifest)
    const response = await chrome.tabs.sendMessage(tab.id, { action: "scrape" });

    if (!response || (!response.name && !response.title)) {
      statusEl.innerText = "Klarte ikke lese profil. Prøv å refreshe LinkedIn-siden.";
      return;
    }

    // Show content
    statusEl.style.display = 'none';
    document.getElementById('content').style.display = 'block';
    document.getElementById('name').innerText    = response.name    || "—";
    document.getElementById('title').innerText   = response.title   || "—";
    document.getElementById('company').innerText = response.company || "—";

    document.getElementById('addBtn').onclick = async () => {
      const addBtn = document.getElementById('addBtn');
      addBtn.disabled = true;
      addBtn.innerText = "Lagrer...";

      try {
        const res = await fetch('http://localhost:3001/api/leads/extension', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(response)
        });

        const data = await res.json();

        if (res.ok && data.success) {
          document.getElementById('statusMsg').innerText = "✅ Lead lagret i Reachr!";
          document.getElementById('statusMsg').style.color = "#008f52";
          addBtn.style.display = "none";
        } else {
          document.getElementById('statusMsg').innerText = "❌ " + (data.error || "Noe gikk galt");
          document.getElementById('statusMsg').style.color = "#ff470a";
          addBtn.disabled = false;
          addBtn.innerText = "Prøv igjen";
        }
      } catch (e) {
        document.getElementById('statusMsg').innerText = "❌ Ikke tilkobling til Reachr. Logg inn og prøv igjen.";
        document.getElementById('statusMsg').style.color = "#ff470a";
        addBtn.disabled = false;
        addBtn.innerText = "Prøv igjen";
      }
    };

  } catch (e) {
    console.error("Reachr Extension Error:", e);
    statusEl.innerText = "Refresh LinkedIn-profilen og prøv igjen.";
  }
});
