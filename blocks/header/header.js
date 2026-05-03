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
  dismiss.setAttribute('aria-label', 'Dismiss');
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
  // 2. Logo — <a> with picture (direct child of navContent)
  const logoA = children.find((el) => el.tagName === 'A' && el.querySelector('picture, img'));
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

  // Logo
  if (logoA) {
    const logoWrap = document.createElement('div');
    logoWrap.className = 'nav-logo';
    const a = document.createElement('a');
    a.href = logoA.href || '/';
    a.setAttribute('aria-label', 'Xero home');
    a.appendChild(logoA.querySelector('picture').cloneNode(true));
    logoWrap.appendChild(a);
    navBar.appendChild(logoWrap);
  }

  // Nav links
  if (navUl) {
    const list = document.createElement('ul');
    list.className = 'nav-list';
    navUl.querySelectorAll(':scope > li').forEach((li) => {
      const item = buildNavItem(li);
      if (item) list.appendChild(item);
    });
    navBar.appendChild(list);
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
    navBar.appendChild(ctas);
  }

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
