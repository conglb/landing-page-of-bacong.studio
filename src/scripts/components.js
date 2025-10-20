// This file is intentionally left blank.

// Simple include loader: finds elements with data-include and injects fetched HTML.
// Requires serving via HTTP (live-server, npm start), not file://
(async function loadIncludes() {
  const nodes = Array.from(document.querySelectorAll('[data-include]'));
  await Promise.all(nodes.map(async (el) => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      const html = await res.text();
      el.innerHTML = html;
      // Re-execute any inline scripts in the injected HTML
      el.querySelectorAll('script').forEach(oldScript => {
        const script = document.createElement('script');
        if (oldScript.src) {
          script.src = oldScript.src;
        } else {
          script.textContent = oldScript.textContent;
        }
        oldScript.parentNode.replaceChild(script, oldScript);
      });
    } catch (err) {
      console.error('Include load failed:', url, err);
      el.innerHTML = '';
    }
  }));

  // notify other scripts that includes are loaded
  window.dispatchEvent(new Event('includes:loaded'));
})();