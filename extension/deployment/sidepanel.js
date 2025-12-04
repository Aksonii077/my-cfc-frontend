(() => {
  const loginBtn = document.getElementById('loginBtn');
  const authStatus = document.getElementById('authStatus');
  const importBtn = document.getElementById('importBtn');
  const avatar = document.getElementById('avatar');
  const authEmail = document.getElementById('authEmail');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const errorBox = document.getElementById('errorBox');
  const successBox = document.getElementById('successBox');

  function setAuthUI(authed) {
    if (authed) {
      authStatus.textContent = 'Authenticated';
      loginBtn.style.display = 'none';
      setStatus('connected');
    } else {
      authStatus.textContent = 'Not authenticated';
      loginBtn.style.display = 'inline-flex';
      setStatus('disconnected');
    }
  }

  function setStatus(state) {
    statusDot.className = `dot ${state}`;
    statusText.textContent = state === 'connected' ? 'Connected' : state === 'syncing' ? 'Syncing…' : 'Not Connected';
  }

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
    successBox.style.display = 'none';
  }

  function showSuccess(msg) {
    successBox.textContent = msg;
    successBox.style.display = 'block';
    errorBox.style.display = 'none';
  }

  function setProgress(pct, msg) {
    progressFill.style.width = `${pct}%`;
    progressText.textContent = msg || '';
  }

  async function checkAuth() {
    // First, read cached values
    let { authToken, userInfo } = await chrome.storage.local.get(['authToken','userInfo']);

    // If missing, attempt to pull from current tab's localStorage
    if (!authToken) {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
          const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => ({
              token: localStorage.getItem('token') || localStorage.getItem('authToken'),
              userRaw: localStorage.getItem('user')
            })
          });
          const r = results?.[0]?.result;
          if (r?.token) {
            authToken = r.token;
            try { userInfo = r.userRaw ? JSON.parse(r.userRaw) : null; } catch { userInfo = null; }
            await chrome.storage.local.set({ authToken, userInfo, lastAuthCheck: new Date().toISOString() });
          }
        }
      } catch {}
    }

    setAuthUI(!!authToken);
    if (userInfo && userInfo.name) {
      const initials = userInfo.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
      avatar.textContent = initials || 'C';
      authEmail.textContent = userInfo.email || '';
      authStatus.textContent = userInfo.name;
    }
    return authToken;
  }

  loginBtn.addEventListener('click', async () => {
    // Prefer stored base, otherwise localhost dev
    const { apiUrlBase } = await chrome.storage.local.get(['apiUrlBase']);
    const base = apiUrlBase || 'http://localhost:3000';
    chrome.tabs.create({ url: `${base.replace(/\/$/, '')}/auth` });
  });

  importBtn.addEventListener('click', async () => {
    const token = await checkAuth();
    if (!token) {
      showError('Please login first');
      return;
    }
    setStatus('syncing');
    setProgress(5, 'Preparing…');

    // Find active tab; ensure LinkedIn connections page
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      showError('No active tab');
      return;
    }

    // Ensure we are on linkedin connections; if not, navigate and let content script auto-resume
    if (!/linkedin\.com\/mynetwork\/invite-connect\/connections\//.test(tab.url || '')) {
      await chrome.storage.local.set({ pendingSync: { jwtToken: token } });
      await chrome.tabs.update(tab.id, { url: 'https://www.linkedin.com/mynetwork/invite-connect/connections/' });
      showSuccess('Navigating to LinkedIn…');
      return;
    }

    // Ping content script; inject if missing
    const ping = await new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, { action: 'ping' }, (res) => {
        resolve(!chrome.runtime.lastError && res);
      });
    });

    if (!ping) {
      try {
        await chrome.scripting.executeScript({ target: { tabId: tab.id, allFrames: true }, files: ['content.js'] });
      } catch {}
    }

    setProgress(15, 'Starting…');
    chrome.tabs.sendMessage(
      tab.id,
      {
        action: 'startSync',
        jwtToken: token
      },
      (response) => {
        if (chrome.runtime.lastError) {
          showError('Failed to start sync. Refresh LinkedIn and try again.');
          setStatus('disconnected');
          return;
        }
        if (response && response.success) {
          showSuccess('Sync started');
        } else {
          showError('Could not start sync');
          setStatus('disconnected');
        }
      }
    );
  });

  // Listen to progress from content script
  chrome.runtime.onMessage.addListener((req) => {
    if (req.type === 'progress') setProgress(0, req.message);
    if (req.type === 'status') {
      if (req.status === 'connected') setStatus('connected');
      if (req.status === 'syncing') setStatus('syncing');
      if (req.status === 'error') showError(req.message || 'Error');
    }
    if (req.type === 'complete') {
      showSuccess(req.message || 'Done');
      setStatus('connected');
      setProgress(100, 'Completed');
    }
  });

  // init
  checkAuth();
})();


