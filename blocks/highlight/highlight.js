/**
 * Decorates the highlight block.
 * Sets up two-column layout and handles image/text positioning.
 * @param {HTMLElement} block The highlight block element
 */
export default function decorate(block) {
  // If the block only has one row with one cell, split text from image
  const rows = block.querySelectorAll(':scope > div');

  rows.forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');

    if (cells.length === 1) {
      // Single-cell: split into text + image
      const cell = cells[0];
      const textEls = [];
      const imageEls = [];

      Array.from(cell.children).forEach((child) => {
        if (child.querySelector('picture') || child.tagName === 'PICTURE') {
          imageEls.push(child);
        } else {
          textEls.push(child);
        }
      });

      if (imageEls.length > 0 && textEls.length > 0) {
        const textCell = document.createElement('div');
        textEls.forEach((el) => textCell.appendChild(el));

        const imageCell = document.createElement('div');
        imageEls.forEach((el) => imageCell.appendChild(el));

        cell.remove();
        row.appendChild(textCell);
        row.appendChild(imageCell);
      }
    }
  });

  // Apply dark wrapper background if needed
  const wrapper = block.closest('.highlight-wrapper');
  if (block.classList.contains('dark') && wrapper) {
    wrapper.style.backgroundColor = 'var(--xero-navy, #172C40)';
  }
}
