/**
 * Footer block — Xero AU style
 * Fetches /footer, builds 6-column link grid + legal bar + social icons
 */

const SOCIAL_ICONS = {
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>`,
  youtube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.896 0-7.605-.476c-.941-.262-1.684-1.037-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.104 4 12 4 12 4s5.896 0 7.605.476c.941.262 1.684 1.037 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z"/></svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
  twitter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
};

export default async function decorate(block) {
  const resp = await fetch('/footer', window.location.pathname === '/footer' ? {} : { cache: 'default' });
  if (!resp.ok) return;
  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const content = doc.querySelector('main > div');
  if (!content) return;

  const children = Array.from(content.children);

  // ── Column grid ──────────────────────────────────────────
  // Structure: h3, ul, h3, ul, h3, ul ... repeated for each column
  const colsWrapper = document.createElement('div');
  colsWrapper.className = 'footer-columns';

  let currentCol = null;
  children.forEach((el) => {
    if (el.tagName === 'H3') {
      currentCol = document.createElement('div');
      currentCol.className = 'footer-col';
      const heading = document.createElement('h3'); /* was h4 — skipped heading order, fails a11y */
      heading.className = 'footer-col-heading';
      heading.textContent = el.textContent;
      currentCol.appendChild(heading);
      colsWrapper.appendChild(currentCol);
    } else if (el.tagName === 'UL' && currentCol) {
      // Check if it's a nav list (has links) vs social/legal list
      const hasLinks = el.querySelector('a');
      if (hasLinks) {
        const list = document.createElement('ul');
        list.className = 'footer-col-links';
        el.querySelectorAll('li a').forEach((a) => {
          const li = document.createElement('li');
          const link = document.createElement('a');
          link.href = a.href;
          link.textContent = a.textContent;
          li.appendChild(link);
          list.appendChild(li);
        });
        currentCol.appendChild(list);
        currentCol = null; // reset after appending list
      }
    }
  });

  block.appendChild(colsWrapper);

  // ── Bottom bar ───────────────────────────────────────────
  const bottomBar = document.createElement('div');
  bottomBar.className = 'footer-bottom';

  // Copyright paragraph
  const copyrightP = children.find((el) => el.tagName === 'P' && el.textContent.includes('©'));
  if (copyrightP) {
    const copyright = document.createElement('p');
    copyright.className = 'footer-copyright';
    copyright.textContent = copyrightP.textContent;
    bottomBar.appendChild(copyright);
  }

  // Legal links (ul after copyright p)
  const legalUl = children.find((el) => el.tagName === 'UL'
    && el.previousElementSibling?.tagName === 'P'
    && el.previousElementSibling?.textContent.includes('©'));
  const legalBar = document.createElement('div');
  legalBar.className = 'footer-legal-bar';

  if (legalUl) {
    const legalLinks = document.createElement('ul');
    legalLinks.className = 'footer-legal-links';
    legalUl.querySelectorAll('li a').forEach((a) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = a.textContent;
      li.appendChild(link);
      legalLinks.appendChild(li);
    });
    legalBar.appendChild(legalLinks);
  }

  // Region + social icons
  const rightBar = document.createElement('div');
  rightBar.className = 'footer-right-bar';

  // Region
  const regionP = children.find((el) => el.tagName === 'P' && el.textContent.includes('Region'));
  if (regionP) {
    const regionEl = document.createElement('div');
    regionEl.className = 'footer-region';
    regionEl.innerHTML = `<span class="footer-region-flag">🇦🇺</span><span>Region</span><a href="/au">Australia (AUD)</a>`;
    rightBar.appendChild(regionEl);
  }

  // Social icons
  const socialNames = ['facebook', 'youtube', 'linkedin', 'instagram', 'twitter'];
  const socialLinks = ['https://www.facebook.com/xero', 'https://www.youtube.com/xero',
    'https://www.linkedin.com/company/xero', 'https://www.instagram.com/xero', 'https://twitter.com/xero'];
  const socialEl = document.createElement('ul');
  socialEl.className = 'footer-social';
  socialNames.forEach((name, i) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = socialLinks[i];
    a.setAttribute('aria-label', name.charAt(0).toUpperCase() + name.slice(1));
    a.innerHTML = SOCIAL_ICONS[name] || name;
    li.appendChild(a);
    socialEl.appendChild(li);
  });
  rightBar.appendChild(socialEl);

  legalBar.appendChild(rightBar);
  bottomBar.appendChild(legalBar);
  block.appendChild(bottomBar);
}
