/**
 * Decorates the hero block.
 * Ensures dark background and two-column layout for the hero section.
 * @param {HTMLElement} block The hero block element
 */
export default function decorate(block) {
  // Ensure the hero wrapper gets the dark bg
  const wrapper = block.closest('.hero-wrapper') || block.parentElement;
  if (wrapper) {
    wrapper.style.backgroundColor = 'var(--xero-navy, #172C40)';
  }

  // The buildHeroBlock in scripts.js puts { elems: [picture, h1] }
  // which creates: <div class="hero block"><div><div>picture</div><div>h1</div></div></div>
  // We want text left, image right — rearrange if needed.
  const rows = block.querySelectorAll(':scope > div');
  rows.forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length === 2) {
      const [cell1, cell2] = cells;
      const hasPictureFirst = cell1.querySelector('picture');
      const hasPictureSecond = cell2.querySelector('picture');

      // If picture is in first cell and text (h1) is in second, swap them
      if (hasPictureFirst && !hasPictureSecond) {
        // Swap: text should come first (left), image second (right)
        row.appendChild(cell1); // moves cell1 to end
      }
    }
  });

  // Promote h1 into the text column if it's wrapped in a div alongside picture
  const h1 = block.querySelector('h1');
  if (h1) {
    const h1Cell = h1.closest(':scope > div > div', block);
    if (h1Cell) {
      h1Cell.classList.add('hero-text');
    }
  }

  const picture = block.querySelector('picture');
  if (picture) {
    const imgCell = picture.closest('div');
    if (imgCell) {
      imgCell.classList.add('hero-image');
    }
  }
}
