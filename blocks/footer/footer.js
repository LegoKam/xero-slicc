import { decorateIcons } from '../../scripts/aem.js';

export default async function decorate(block) {
  const resp = await fetch('/footer.plain.html');

  if (resp.ok) {
    const html = await resp.text();
    const footer = document.createElement('div');
    footer.innerHTML = html;

    const sections = [...footer.children];
    if (sections[0]) {
      sections[0].classList.add('footer-links');
    }
    if (sections[1]) {
      sections[1].classList.add('footer-bottom');
    }

    decorateIcons(footer);
    block.append(footer);
  }
}
