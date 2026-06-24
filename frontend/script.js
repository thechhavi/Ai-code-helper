document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'http://127.0.0.1:8000/api';

  const codeInput = document.getElementById('codeInput');
  const languageSelect = document.getElementById('language');
  const submitBtn = document.getElementById('submitBtn');
  const actionBtns = document.querySelectorAll('.action-btn');
  const outputContent = document.getElementById('outputContent');
  const statusText = document.getElementById('statusText');

  let currentAction = 'explain';

  if (codeInput && submitBtn) {

    actionBtns.forEach(btn => {

      if (btn.hasAttribute('data-action')) {
        btn.addEventListener('click', () => {
          actionBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentAction = btn.getAttribute('data-action');
 
          const actionText = currentAction.charAt(0).toUpperCase() + currentAction.slice(1);
          submitBtn.innerHTML = `▶ ${actionText} code`;
        });
      }
    });

    submitBtn.addEventListener('click', async () => {
      const code = codeInput.value.trim();
      if (!code) {
        alert("Please paste some code first.");
        return;
      }

      const language = languageSelect.value;

      submitBtn.disabled = true;
      submitBtn.innerText = 'Processing...';
      outputContent.innerHTML = '<span style="color: var(--text-muted)">Thinking...</span>';
      statusText.innerHTML = '<span style="color: var(--accent-yellow)">processing</span>';

      try {
        const response = await fetch(`${API_URL}/process`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language, action: currentAction })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        outputContent.textContent = data.response;
        statusText.innerHTML = '<span style="color: var(--accent-green)">done</span>';
      } catch (error) {
        console.error('Error:', error);
        outputContent.innerHTML = `<span style="color: var(--accent-red)">An error occurred: ${error.message}</span>`;
        statusText.innerHTML = '<span style="color: var(--accent-red)">error</span>';
      } finally {
        submitBtn.disabled = false;
        const actionText = currentAction.charAt(0).toUpperCase() + currentAction.slice(1);
        submitBtn.innerHTML = `▶ ${actionText} code`;
      }
    });
  }

  const contactForm = document.getElementById('contactForm');
  const contactSubmitBtn = document.getElementById('contactSubmitBtn');
  const contactStatusText = document.getElementById('contactStatusText');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      contactSubmitBtn.disabled = true;
      contactSubmitBtn.innerText = 'Sending...';

      try {
        const response = await fetch(`${API_URL}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });

        if (!response.ok) throw new Error('Failed to send message');

        contactStatusText.innerHTML = '<span style="color: var(--accent-green)">Message saved to messages.db successfully!</span>';
        contactForm.reset();
      } catch (error) {
        contactStatusText.innerHTML = `<span style="color: var(--accent-red)">Error: ${error.message}</span>`;
      } finally {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.innerText = 'Send message';
      }
    });
  }

  const historyContainer = document.getElementById('historyContainer');
  const historyCount = document.getElementById('historyCount');
  const refreshHistoryBtn = document.getElementById('refreshHistoryBtn');

  if (historyContainer) {
    const loadHistory = async () => {
      historyContainer.innerHTML = '<div style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.9rem;">Loading history...</div>';
      
      try {
        const response = await fetch(`${API_URL}/history`);
        if (!response.ok) throw new Error('Failed to fetch history');
        
        const historyData = await response.json();
        
        historyCount.textContent = `${historyData.length} saved entries`;
        
        if (historyData.length === 0) {
          historyContainer.innerHTML = '<div style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.9rem;">No history found. Try processing some code first.</div>';
          return;
        }

        historyContainer.innerHTML = '';
        
        historyData.forEach(item => {
          const date = new Date(item.timestamp).toLocaleString();
          
          const historyEl = document.createElement('div');
          historyEl.className = 'history-item';
          
          let badgeClass = 'badge-explain';
          if (item.action === 'debug') badgeClass = 'badge-debug';
          if (item.action === 'improve') badgeClass = 'badge-improve';

          historyEl.innerHTML = `
            <div class="history-header">
              <div style="display: flex; gap: 1rem; align-items: center;">
                <span class="history-badge ${badgeClass}">${item.action}</span>
                <span style="color: var(--text-muted)">${item.language.toLowerCase()}</span>
                <span class="history-code-preview">${escapeHtml(item.code).substring(0, 50)}...</span>
              </div>
              <div class="history-meta">${date}</div>
            </div>
            <div class="history-body">
              <div style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.8rem; margin-bottom: 0.5rem;">Input Code</div>
              <div class="history-code">${escapeHtml(item.code)}</div>
              <div style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.8rem; margin-bottom: 0.5rem;">AI Response</div>
              <div class="history-code" style="white-space: pre-wrap;">${escapeHtml(item.response)}</div>
            </div>
          `;
          
          historyEl.addEventListener('click', () => {
            historyEl.classList.toggle('open');
          });
          
          historyContainer.appendChild(historyEl);
        });
      } catch (error) {
        historyContainer.innerHTML = `<div style="color: var(--accent-red); font-family: var(--font-mono); font-size: 0.9rem;">Error loading history: ${error.message}</div>`;
      }
    };

    loadHistory();

    if (refreshHistoryBtn) {
      refreshHistoryBtn.addEventListener('click', loadHistory);
    }
  }

  function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }
});
