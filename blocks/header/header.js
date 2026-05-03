import { getMetadata } from '../../scripts/aem.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = expanded ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, !expanded && !isDesktop.matches);
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (!resp.ok) return;

  const html = await resp.text();
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.innerHTML = html;

  const children = [...nav.children];

  // First div = promo bar
  const promoBar = children[0];
  if (promoBar) {
    promoBar.classList.add('nav-promo-bar');
  }

  // Second div = main nav content (logo, links, CTA)
  const mainNav = children[1];
  if (mainNav) {
    // Extract logo (first <p> with img)
    const logoParagraph = mainNav.querySelector(':scope > p:first-child');
    if (logoParagraph) {
      logoParagraph.classList.add('nav-brand');
    }

    // Extract nav links (the <ul>)
    const navList = mainNav.querySelector(':scope > ul');
    if (navList) {
      const navSections = document.createElement('div');
      navSections.classList.add('nav-sections');
      navSections.appendChild(navList);
      mainNav.insertBefore(navSections, mainNav.lastElementChild);

      // Add dropdown behavior
      navList.querySelectorAll(':scope > li').forEach((li) => {
        if (li.querySelector('ul')) {
          li.classList.add('nav-drop');
          li.setAttribute('aria-expanded', 'false');
          li.addEventListener('click', () => {
            if (isDesktop.matches) {
              const wasExpanded = li.getAttribute('aria-expanded') === 'true';
              toggleAllNavSections(navSections);
              li.setAttribute('aria-expanded', wasExpanded ? 'false' : 'true');
            }
          });
        }
      });

      // Hamburger
      const hamburger = document.createElement('div');
      hamburger.classList.add('nav-hamburger');
      hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;
      hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
      mainNav.insertBefore(hamburger, logoParagraph);

      // Close dropdowns on outside click
      document.addEventListener('click', (e) => {
        if (!nav.contains(e.target)) {
          toggleAllNavSections(navSections);
        }
      });

      // Escape key closes menus
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
          const expanded = navSections.querySelector('[aria-expanded="true"]');
          if (expanded) toggleAllNavSections(navSections);
          else if (!isDesktop.matches) toggleMenu(nav, navSections, false);
        }
      });
    }

    // Extract CTA (last <p> with links)
    const ctaParagraph = mainNav.querySelector(':scope > p:last-child');
    if (ctaParagraph && ctaParagraph !== logoParagraph) {
      ctaParagraph.classList.add('nav-tools');
      const links = ctaParagraph.querySelectorAll('a');
      links.forEach((link, i) => {
        link.classList.add('nav-cta');
        link.classList.add(i === 0 ? 'nav-cta-primary' : 'nav-cta-secondary');
      });
    }

    mainNav.classList.add('nav-main');
  }

  nav.setAttribute('aria-expanded', 'false');

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
