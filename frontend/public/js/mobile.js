/**
 * CivicSense — Mobile Experience JS
 * Injects: Bottom Nav Bar + Slide-out Drawer + Hamburger Button
 * Works on all citizen portal pages.
 */
(function () {
  'use strict';

  // ── Page detection ──────────────────────────────────────────
  const path = window.location.pathname;
  
  // Exclude public pages from injecting bottom nav / drawer
  const publicPages = ['/landing', '/login', '/signup', '/verify', '/', ''];
  const normalize = (p) => p.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  const isPublicPage = publicPages.includes(normalize(path));

  function isActive(href) {
    // Normalize: strip trailing slash and .html extension for comparison
    const normalize = (p) => p.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    const currentPath = normalize(path);
    const targetPath  = normalize(href);

    if (targetPath === '/dashboard') return currentPath === '/dashboard' || currentPath === '' || currentPath === '/';
    return currentPath === targetPath || currentPath.startsWith(targetPath + '/');
  }

  // ── Nav items config ────────────────────────────────────────
  const navItems = [
    { href: '/dashboard',     icon: 'fa-home',      label: 'Home' },
    { href: '/my-reports',    icon: 'fa-list',       label: 'Reports' },
    { href: '/report',        icon: 'fa-plus',       label: 'Report',   isFab: true },
    { href: '/rewards.html',  icon: 'fa-gift',       label: 'Rewards' },
    { href: '/achievements',  icon: 'fa-trophy',     label: 'Badges' },
  ];

  // ── Inject CSS ───────────────────────────────────────────────
  function injectCSS() {
    if (document.querySelector('link[data-mobile-css]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/mobile.css';
    link.setAttribute('data-mobile-css', '1');
    document.head.appendChild(link);
  }

  // ── Build Bottom Nav ─────────────────────────────────────────
  function buildBottomNav() {
    if (document.getElementById('civicBottomNav')) return;

    const nav = document.createElement('nav');
    nav.id = 'civicBottomNav';
    nav.className = 'bottom-nav';
    nav.setAttribute('aria-label', 'Mobile navigation');

    navItems.forEach(item => {
      const a = document.createElement('a');
      a.href = item.href;
      a.className = 'bottom-nav-item' + (item.isFab ? '' : '') + (isActive(item.href) ? ' active' : '');
      a.setAttribute('aria-label', item.label);

      const iconWrapper = document.createElement('span');
      iconWrapper.className = item.isFab ? 'bottom-nav-fab' : '';

      const icon = document.createElement('i');
      icon.className = `fas ${item.icon} bottom-nav-icon`;

      if (item.isFab) {
        iconWrapper.appendChild(icon);
        a.appendChild(iconWrapper);
      } else {
        icon.classList.add('bottom-nav-icon');
        a.appendChild(icon);
      }

      const label = document.createElement('span');
      label.className = 'bottom-nav-label';
      label.textContent = item.label;
      a.appendChild(label);

      nav.appendChild(a);
    });

    document.body.appendChild(nav);
  }

  // ── Build Slide-out Drawer ────────────────────────────────────
  function buildDrawer() {
    if (document.getElementById('civicDrawer')) return;

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'civicDrawerOverlay';
    overlay.className = 'mobile-nav-overlay';
    overlay.addEventListener('click', closeDrawer);

    // Drawer
    const drawer = document.createElement('div');
    drawer.id = 'civicDrawer';
    drawer.className = 'mobile-nav-drawer';

    // Header
    const header = document.createElement('div');
    header.className = 'mobile-drawer-header';

    const userSection = document.createElement('div');
    userSection.className = 'mobile-drawer-user';

    const avatar = document.createElement('img');
    avatar.id = 'drawerAvatar';
    avatar.className = 'mobile-drawer-avatar';
    avatar.src = 'https://ui-avatars.com/api/?name=User&background=667eea&color=fff';
    avatar.alt = 'User';

    const userInfo = document.createElement('div');
    const name = document.createElement('p');
    name.className = 'mobile-drawer-name';
    name.id = 'drawerName';
    name.textContent = 'Citizen';

    const email = document.createElement('p');
    email.className = 'mobile-drawer-email';
    email.id = 'drawerEmail';
    email.textContent = '';

    userInfo.appendChild(name);
    userInfo.appendChild(email);
    userSection.appendChild(avatar);
    userSection.appendChild(userInfo);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-drawer-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.addEventListener('click', closeDrawer);

    header.appendChild(userSection);
    header.appendChild(closeBtn);

    // Nav links
    const drawerNav = document.createElement('nav');
    drawerNav.className = 'mobile-drawer-nav';

    const drawerNavItems = [
      { href: '/dashboard',     icon: 'fa-home',       label: 'Dashboard',       color: '#667eea', bg: 'rgba(102,126,234,0.12)' },
      { href: '/report',        icon: 'fa-plus-circle', label: 'New Report',      color: '#f093fb', bg: 'rgba(240,147,251,0.12)' },
      { href: '/my-reports',    icon: 'fa-list-alt',   label: 'My Reports',      color: '#4facfe', bg: 'rgba(79,172,254,0.12)' },
      { href: '/achievements',  icon: 'fa-trophy',     label: 'Achievements',    color: '#f5a623', bg: 'rgba(245,166,35,0.12)' },
      { href: '/rewards',       icon: 'fa-gift',       label: 'Rewards',         color: '#43e97b', bg: 'rgba(67,233,123,0.12)' },
      { href: '/profile',       icon: 'fa-user-circle', label: 'Profile',        color: '#667eea', bg: 'rgba(102,126,234,0.12)' },
    ];

    drawerNavItems.forEach(item => {
      const a = document.createElement('a');
      a.href = item.href;
      a.className = isActive(item.href) ? 'active' : '';

      const iconDiv = document.createElement('div');
      iconDiv.className = 'drawer-icon';
      iconDiv.style.background = item.bg;
      iconDiv.style.color = item.color;
      iconDiv.innerHTML = `<i class="fas ${item.icon}"></i>`;

      a.appendChild(iconDiv);
      a.appendChild(document.createTextNode(item.label));
      drawerNav.appendChild(a);
    });

    // Logout section
    const logoutSection = document.createElement('div');
    logoutSection.className = 'mobile-drawer-logout';

    const logoutLink = document.createElement('a');
    logoutLink.href = '#';
    logoutLink.id = 'drawerLogout';

    const logoutIcon = document.createElement('div');
    logoutIcon.className = 'drawer-icon';
    logoutIcon.style.background = 'rgba(239,68,68,0.12)';
    logoutIcon.style.color = '#ef4444';
    logoutIcon.innerHTML = '<i class="fas fa-sign-out-alt"></i>';

    logoutLink.appendChild(logoutIcon);
    logoutLink.appendChild(document.createTextNode('Logout'));
    logoutSection.appendChild(logoutLink);

    drawer.appendChild(header);
    drawer.appendChild(drawerNav);
    drawer.appendChild(logoutSection);
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    // Wire logout
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainLogout = document.getElementById('logoutBtn');
      if (mainLogout) mainLogout.click();
      else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    });
  }

  // ── Build Hamburger Button ────────────────────────────────────
  function buildHamburger() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;
    if (document.getElementById('civicHamburger')) return;

    const btn = document.createElement('button');
    btn.id = 'civicHamburger';
    btn.className = 'mobile-hamburger';
    btn.setAttribute('aria-label', 'Open menu');
    btn.innerHTML = '<i class="fas fa-bars"></i>';
    btn.addEventListener('click', openDrawer);

    // Insert hamburger before profile avatar
    headerActions.insertBefore(btn, headerActions.firstChild);
  }

  // ── Open / Close ─────────────────────────────────────────────
  function openDrawer() {
    document.getElementById('civicDrawer')?.classList.add('open');
    document.getElementById('civicDrawerOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
    syncDrawerUser();
  }

  function closeDrawer() {
    document.getElementById('civicDrawer')?.classList.remove('open');
    document.getElementById('civicDrawerOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Sync user info into drawer ────────────────────────────────
  function syncDrawerUser() {
    try {
      const stored = localStorage.getItem('user');
      const user = stored ? JSON.parse(stored) : null;
      if (!user) return;

      const drawerName = document.getElementById('drawerName');
      const drawerEmail = document.getElementById('drawerEmail');
      const drawerAvatar = document.getElementById('drawerAvatar');

      if (drawerName) drawerName.textContent = user.name || 'Citizen';
      if (drawerEmail) drawerEmail.textContent = user.email || '';

      // Try to use same avatar as main header
      const mainAvatar = document.getElementById('userAvatar');
      if (drawerAvatar && mainAvatar?.src) {
        drawerAvatar.src = mainAvatar.src;
      } else if (drawerAvatar && user.avatar) {
        drawerAvatar.src = user.avatar;
      } else if (drawerAvatar) {
        const initials = (user.name || 'U').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
        drawerAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=667eea&color=fff`;
      }
    } catch (e) { /* ignore */ }
  }

  // ── Swipe to Close ───────────────────────────────────────────
  function attachSwipeToClose() {
    const drawer = document.getElementById('civicDrawer');
    if (!drawer) return;

    let startX = 0;
    drawer.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    drawer.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (dx > 60) closeDrawer(); // swipe right = close
    }, { passive: true });
  }

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    // Only run on mobile (max 768px)
    if (window.innerWidth > 900) return;
    
    // Skip portal UI on public pages (landing, login, etc)
    if (isPublicPage) {
      injectCSS(); // Still inject CSS for footer compaction
      return;
    }

    injectCSS();
    buildBottomNav();
    buildDrawer();
    buildHamburger();
    attachSwipeToClose();
    syncDrawerUser();

    // Re-sync avatar when main page updates it
    const mainAvatar = document.getElementById('userAvatar');
    if (mainAvatar) {
      const observer = new MutationObserver(syncDrawerUser);
      observer.observe(mainAvatar, { attributes: true, attributeFilter: ['src'] });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-check on resize (e.g., rotating tablet)
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 900) init();
  }, { passive: true });

})();
