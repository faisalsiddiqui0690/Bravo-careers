const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const LEFT_MARGIN = 54;
const LINE_HEIGHT = 15;

const toAscii = (value) => String(value)
  .replace(/[’‘]/g, "'")
  .replace(/[“”]/g, '"')
  .replace(/[–—]/g, '-')
  .replace(/…/g, '...')
  .replace(/[^\x20-\x7E]/g, '');

const escapePdfText = (value) => toAscii(value)
  .replace(/\\/g, '\\\\')
  .replace(/\(/g, '\\(')
  .replace(/\)/g, '\\)');

const wrapText = (text, maxLength) => {
  const words = toAscii(text).trim().split(/\s+/);
  const lines = [];
  let line = '';

  words.forEach((word) => {
    if (line && `${line} ${word}`.length > maxLength) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  });

  if (line) lines.push(line);
  return lines;
};

const createPage = (title, subtitle, pageNumber, pageCount, bodyLines) => {
  const commands = [
    '0.04 0.12 0.29 rg',
    `0 675 ${PAGE_WIDTH} 117 re f`,
    `BT /F2 9 Tf ${LEFT_MARGIN} 763 Td (BRAVO CAREERS  |  PRACTICAL RESOURCES) Tj ET`,
    '1 1 1 rg',
    `BT /F2 19 Tf ${LEFT_MARGIN} 705 Td (${escapePdfText(title)}) Tj ET`,
    '0.83 0.87 0.93 rg',
    `BT /F1 10 Tf ${LEFT_MARGIN} 687 Td (${escapePdfText(subtitle)}) Tj ET`,
    '0.86 0.89 0.92 RG',
    `1 w ${LEFT_MARGIN} 675 m ${PAGE_WIDTH - LEFT_MARGIN} 675 l S`,
  ];

  let y = 650;
  bodyLines.forEach(({ text, bold, size = 10, color = '0.18 0.23 0.31' }) => {
    commands.push(`${color} rg`);
    commands.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf ${LEFT_MARGIN} ${y} Td (${escapePdfText(text)}) Tj ET`);
    y -= LINE_HEIGHT;
  });

  commands.push('0.45 0.49 0.55 rg');
  commands.push(`BT /F1 8 Tf ${LEFT_MARGIN} 35 Td (General information only. No job, endorsement or visa outcome is guaranteed.) Tj ET`);
  commands.push(`BT /F1 8 Tf ${PAGE_WIDTH - 105} 35 Td (Page ${pageNumber} of ${pageCount}) Tj ET`);
  return commands.join('\n');
};

export function createResourcePdf(resource) {
  const pages = [[]];
  let pageIndex = 0;
  let lineCount = 0;

  const addLine = (text, options = {}) => {
    if (lineCount >= 39) {
      pages.push([]);
      pageIndex += 1;
      lineCount = 0;
    }
    pages[pageIndex].push({ text, ...options });
    lineCount += 1;
  };

  resource.sections.forEach((section) => {
    if (lineCount > 0) addLine('');
    addLine(section.title, { bold: true, size: 12, color: '0.04 0.20 0.43' });
    (section.paragraphs || []).forEach((paragraph) => {
      wrapText(paragraph, 92).forEach((line) => addLine(line));
      addLine('');
    });
    (section.bullets || []).forEach((bullet) => {
      wrapText(`- ${bullet}`, 88).forEach((line) => addLine(line));
    });
  });

  const pageCount = pages.length;
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pages.map((_, index) => `${5 + index * 2} 0 R`).join(' ')}] /Count ${pageCount} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  ];

  pages.forEach((lines, index) => {
    const pageNumber = index + 1;
    const pageObjectId = 5 + index * 2;
    const contentObjectId = pageObjectId + 1;
    const content = createPage(resource.title, resource.description, pageNumber, pageCount, lines);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjectId} 0 R >>`);
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });

  let document = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(document.length);
    document += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = document.length;
  document += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    document += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  document += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([document], { type: 'application/pdf' });
}
