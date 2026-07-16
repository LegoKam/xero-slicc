/**
 * Header block — Xero AU nav
 * Fetches /nav, builds promo bar + logo + nav links + CTAs
 */

function buildPromoBar(promoP) {
  const bar = document.createElement('div');
  bar.className = 'nav-promo-bar';
  bar.innerHTML = promoP.innerHTML;

  const dismiss = document.createElement('button');
  dismiss.className = 'nav-promo-dismiss';
  dismiss.innerHTML = 'Dismiss <span aria-hidden="true">&times;</span>';
  dismiss.addEventListener('click', () => {
    bar.style.display = 'none';
  });
  bar.appendChild(dismiss);
  return bar;
}

function buildNavItem(li) {
  const item = document.createElement('li');
  item.className = 'nav-item';

  const topLink = li.querySelector(':scope > p > a, :scope > a');
  if (!topLink) return null;

  const hasDropdown = li.querySelector(':scope > ul');

  const btn = document.createElement('button');
  btn.className = 'nav-item-btn';
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = topLink.textContent;
  if (hasDropdown) {
    btn.innerHTML += '<span class="nav-chevron" aria-hidden="true"></span>';
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // Close all other dropdowns
      btn.closest('.nav-list').querySelectorAll('.nav-item-btn').forEach((b) => {
        b.setAttribute('aria-expanded', 'false');
      });
      btn.setAttribute('aria-expanded', String(!expanded));
    });
  } else {
    // No dropdown — direct link
    const a = document.createElement('a');
    a.href = topLink.href;
    a.className = 'nav-item-link';
    a.textContent = topLink.textContent;
    item.appendChild(a);
    return item;
  }

  item.appendChild(btn);

  // Build dropdown
  const dropdown = document.createElement('ul');
  dropdown.className = 'nav-dropdown';
  li.querySelectorAll(':scope > ul > li').forEach((subLi) => {
    const subItem = document.createElement('li');
    const subA = subLi.querySelector('a');
    if (subA) {
      const a = document.createElement('a');
      a.href = subA.href;
      a.textContent = subA.textContent;
      subItem.appendChild(a);
      dropdown.appendChild(subItem);
    }
  });
  item.appendChild(dropdown);
  return item;
}

export default async function decorate(block) {
  // Fetch nav
  const resp = await fetch('/nav', window.location.pathname === '/nav' ? {} : { cache: 'default' });
  if (!resp.ok) return;
  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const navContent = doc.querySelector('main > div');
  if (!navContent) return;

  const children = Array.from(navContent.children);

  // 1. Promo bar — first <p> (no <strong>)
  const promoP = children.find((el) => el.tagName === 'P' && !el.querySelector('strong'));
  // 2. Logo — <p> or <a> containing a picture/img (but not the promo bar)
  const logoA = children.find((el) => (el.tagName === 'A' || el.tagName === 'P') && el.querySelector('picture, img') && !el.querySelector('strong'));
  // 3. Nav list — <ul>
  const navUl = children.find((el) => el.tagName === 'UL');
  // 4. CTA — <p> that contains a <strong> (Try Xero for free button)
  const ctaP = children.find((el) => el.tagName === 'P' && el.querySelector('strong'));

  // Build wrapper
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Main navigation');

  // Promo bar
  if (promoP) {
    block.prepend(buildPromoBar(promoP));
  }

  // Nav bar
  const navBar = document.createElement('div');
  navBar.className = 'nav-bar';

  // Hamburger toggle (mobile only, shown/hidden via CSS)
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="nav-hamburger-icon" aria-hidden="true"></span>';

  // Logo
  if (logoA) {
    const logoWrap = document.createElement('div');
    logoWrap.className = 'nav-logo';
    const a = document.createElement('a');
    // If the element itself is an <a>, use its href; otherwise look for nested <a>
    const innerA = logoA.tagName === 'A' ? logoA : logoA.querySelector('a');
    a.href = innerA ? innerA.href : '/';
    a.setAttribute('aria-label', 'Xero home');
    const pic = logoA.querySelector('picture, img');
    if (pic) a.appendChild(pic.cloneNode(true));
    logoWrap.appendChild(a);
    navBar.appendChild(logoWrap);
  }

  // Menu panel wraps nav links + CTAs (display:contents on desktop, dropdown on mobile)
  const menu = document.createElement('div');
  menu.className = 'nav-menu';

  // Nav links
  if (navUl) {
    const list = document.createElement('ul');
    list.className = 'nav-list';
    navUl.querySelectorAll(':scope > li').forEach((li) => {
      const item = buildNavItem(li);
      if (item) list.appendChild(item);
    });
    menu.appendChild(list);
  }

  // CTAs
  if (ctaP) {
    const ctas = document.createElement('div');
    ctas.className = 'nav-ctas';
    ctaP.querySelectorAll('a').forEach((a) => {
      const btn = document.createElement('a');
      btn.href = a.href;
      btn.textContent = a.textContent;
      btn.className = a.closest('strong') ? 'nav-cta-primary' : 'nav-cta-secondary';
      ctas.appendChild(btn);
    });
    menu.appendChild(ctas);
  }

  navBar.appendChild(menu);

  // Wire up hamburger toggle: reveals nav links + CTAs on mobile
  hamburger.addEventListener('click', () => {
    const open = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!open));
    hamburger.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    menu.classList.toggle('open', !open);
  });
  navBar.appendChild(hamburger);

  nav.appendChild(navBar);
  block.appendChild(nav);

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!block.contains(e.target)) {
      block.querySelectorAll('.nav-item-btn[aria-expanded="true"]').forEach((btn) => {
        btn.setAttribute('aria-expanded', 'false');
      });
    }
  });
}
