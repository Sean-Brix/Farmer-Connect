// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// Capture a DOM element and save it as a PDF (auto-paginates if needed)
export async function exportElementAsPDF(element, filename = 'analytics.pdf') {
  if (!element) return;
  // Ensure charts/components finish rendering before capture
  await new Promise((r) => setTimeout(r, 100));

  // Mark the root so we can find it in the cloned document
  const EXPORT_ATTR = 'data-export-root';
  element.setAttribute(EXPORT_ATTR, '1');

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    foreignObjectRendering: true,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    onclone: (clonedDoc) => {
      const root = clonedDoc.querySelector(`[${EXPORT_ATTR}="1"]`);
      if (!root) return;
      try {
        // Inline computed color styles to avoid unsupported color functions (e.g., oklch)
        const props = [
          'color',
          'backgroundColor',
          'borderColor',
          'borderTopColor',
          'borderRightColor',
          'borderBottomColor',
          'borderLeftColor',
        ];
        const all = root.querySelectorAll('*');
        all.forEach((el) => {
          const cs = clonedDoc.defaultView.getComputedStyle(el);
          props.forEach((p) => {
            const v = cs[p];
            if (v) el.style[p] = v; // force resolved rgb()/rgba() values
          });
        });
      } catch {}
    },
  });

  element.removeAttribute(EXPORT_ATTR);

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth - 40; // 20pt margins
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let y = 20;
  if (imgHeight > pageHeight - 40) {
    // Multi-page layout: slice the large canvas into page-height chunks
    let remainingHeight = imgHeight;
    const pageImgHeight = pageHeight - 40; // 20 top + 20 bottom
    const ratio = canvas.width / imgWidth;
    let sY = 0;

    while (remainingHeight > 0) {
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(pageImgHeight * ratio, canvas.height - sY);
      const ctx = pageCanvas.getContext('2d');
      ctx.drawImage(
        canvas,
        0,
        sY,
        canvas.width,
        pageCanvas.height,
        0,
        0,
        pageCanvas.width,
        pageCanvas.height
      );

      const pageImg = pageCanvas.toDataURL('image/png');
      if (y > 20) pdf.addPage();
      pdf.addImage(pageImg, 'PNG', 20, 20, imgWidth, pageCanvas.height / ratio);
      sY += pageCanvas.height;
      remainingHeight -= pageImgHeight;
      y += pageHeight; // next page
    }
  } else {
    pdf.addImage(imgData, 'PNG', 20, y, imgWidth, imgHeight);
  }

  pdf.save(filename);
}
