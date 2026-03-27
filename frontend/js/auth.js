const Auth = {
  save(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  get() {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  },
  token() { return localStorage.getItem('token'); },
  logout() {
    document.body.classList.add('page-leaving');
    setTimeout(() => {
      localStorage.clear();
      window.location.href = '/index.html';
    }, 220);
  },
  requireAuth(role) {
    const user = this.get();
    if (!user || user.role !== role) {
      window.location.href = role === 'company' ? '/company/login.html' : '/user/login.html';
      return false;
    }
    return true;
  },
  redirectIfLoggedIn() {
    const user = this.get();
    if (!user) return;
    window.location.href = user.role === 'company' ? '/company/dashboard.html' : '/user/browse.html';
  }
};

const Icon = {
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  alert: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  info:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
};

function showAlert(container, message, type = 'error') {
  const icon = type === 'success' ? Icon.check : type === 'info' ? Icon.info : Icon.alert;
  container.innerHTML = `<div class="alert alert-${type}">${icon} ${message}</div>`;
  if (type === 'success') setTimeout(() => { if(container) container.innerHTML = ''; }, 4000);
}

function setLoading(btn, loading, text = '') {
  if (loading) {
    btn._orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> ${text}`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn._orig || text;
  }
}

/* ── Smooth Page Transitions ── */
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href], button[onclick]');
    if (!link) return;

    const onclick = link.getAttribute('onclick') || '';
    const href    = link.getAttribute('href') || '';

    const match = onclick.match(/location\.href\s*=\s*['"]([^'"]+)['"]/);
    const dest  = match
      ? match[1]
      : (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('javascript')
          ? href
          : null);

    if (dest) {
      e.preventDefault();
      document.body.classList.add('page-leaving');
      setTimeout(() => { window.location.href = dest; }, 220);
    }
  });
});