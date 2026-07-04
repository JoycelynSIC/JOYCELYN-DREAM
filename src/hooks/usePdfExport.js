/**
 * usePdfExport — ekspor section ke PDF
 * Pakai html-to-image (support oklch/Tailwind v4) + jsPDF
 */
import { useRef, useState } from "react";
import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";

export function usePdfExport(filename = "laporan") {
  const exportRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  const exportToPdf = async () => {
    if (!exportRef.current || exporting) return;
    setExporting(true);

    try {
      const el = exportRef.current;

      // html-to-image support semua CSS modern termasuk oklch
      const dataUrl = await toJpeg(el, {
        quality: 0.92,
        pixelRatio: 1.5,
        backgroundColor: "#ffffff",
        // Skip gambar external (Supabase/CDN) supaya tidak hang
        filter: (node) => {
          if (node.tagName === "IMG") {
            const src = node.getAttribute("src") || "";
            if (src.startsWith("http") || src.startsWith("//")) return false;
          }
          return true;
        },
      });

      // Ukuran gambar dari dataUrl
      const img = new Image();
      await new Promise((res) => { img.onload = res; img.src = dataUrl; });
      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;

      const pdf   = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfW  = pdf.internal.pageSize.getWidth();   // 210mm
      const pdfH  = pdf.internal.pageSize.getHeight();  // 297mm

      const ratio    = pdfW / imgW;
      const pageImgH = Math.floor(pdfH / ratio); // tinggi 1 halaman dalam px

      // Buat canvas untuk slicing multi-page
      const srcCanvas    = document.createElement("canvas");
      srcCanvas.width    = imgW;
      srcCanvas.height   = imgH;
      srcCanvas.getContext("2d").drawImage(img, 0, 0);

      let yOffset = 0;
      let page    = 0;

      while (yOffset < imgH) {
        if (page > 0) pdf.addPage();

        const sliceH      = Math.min(pageImgH, imgH - yOffset);
        const sliceFinalH = sliceH * ratio;

        const tmp = document.createElement("canvas");
        tmp.width  = imgW;
        tmp.height = sliceH;
        tmp.getContext("2d").drawImage(
          srcCanvas, 0, yOffset, imgW, sliceH, 0, 0, imgW, sliceH
        );

        pdf.addImage(
          tmp.toDataURL("image/jpeg", 0.92),
          "JPEG", 0, 0, pdfW, sliceFinalH
        );

        yOffset += sliceH;
        page++;
      }

      const d     = new Date();
      const stamp = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
      pdf.save(`${filename}_${stamp}.pdf`);

    } catch (err) {
      console.error("PDF export error:", err);
      alert("Export gagal: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  return { exportRef, exporting, exportToPdf };
}
