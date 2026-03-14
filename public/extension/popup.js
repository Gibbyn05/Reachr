document.addEventListener('DOMContentLoaded', async () => {
  const statusEl = document.getElementById('loading');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url?.includes("linkedin.com/in/")) {
    statusEl.innerText = "Gå til en LinkedIn personprofil for å bruke Reachr.";
    return;
  }

  statusEl.innerText = "Henter info...";

  // Give content script a moment if page just loaded
  await new Promise(r => setTimeout(r, 500));

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: "scrape" });

    if (!response || response.name === "—") {
      statusEl.innerText = "Klarte ikke lese profil. Refresh LinkedIn og prøv igjen.";
      return;
    }

    // Show content
    statusEl.style.display = 'none';
    document.getElementById('content').style.display = 'block';

    const setField = (id, val) => {
      const el = document.getElementById(id);
      if (!el) return;
      const isEmpty = !val || val === "—";
      el.innerText = isEmpty ? "Ikke funnet" : val;
      el.className = isEmpty ? "value muted" : "value";
    };

    setField('name',     response.name);
    setField('company',  response.company);
    setField('email',    response.email);
    setField('phone',    response.phone);
    setField('location', response.location);

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
          document.getElementById('statusMsg').innerText = "❌ " + (data.error || "Noe gikk galt. Logg inn på Reachr.");
          document.getElementById('statusMsg').style.color = "#ff470a";
          addBtn.disabled = false;
          addBtn.innerText = "Prøv igjen";
        }
      } catch (e) {
        document.getElementById('statusMsg').innerText = "❌ Kan ikke nå Reachr. Er du logget inn?";
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
