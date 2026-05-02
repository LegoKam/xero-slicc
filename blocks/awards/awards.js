/**
 * Decorates the awards block.
 * Separates heading/intro text from logo images into two cells.
 * @param {HTMLElement} block The awards block element
 */
export default function decorate(block) {
  // Find all content within the block
  const rows = block.querySelectorAll(':scope > div');

  rows.forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');

    if (cells.length === 1) {
      // Single cell: split text content from picture content
      const cell = cells[0];
      const textContent = [];
      const imageContent = [];

      Array.from(cell.children).forEach((child) => {
        if (child.querySelector('picture') || child.tagName === 'PICTURE') {
          imageContent.push(child);
        } else {
          textContent.push(child);
        }
      });

      if (imageContent.length > 0 && textContent.length > 0) {
        // Create text cell
        const textCell = document.createElement('div');
        textContent.forEach((el) => textCell.appendChild(el));

        // Create image cell
        const imageCell = document.createElement('div');
        imageContent.forEach((el) => imageCell.appendChild(el));

        // Replace row content
        cell.remove();
        row.appendChild(textCell);
        row.appendChild(imageCell);
      }
    }
  });
}
