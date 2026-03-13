// $lib/utils/generate_pdf.js

export async function generatePdf(booking) {
  const { jsPDF } = await import("jspdf");
  const QRCode    = (await import("qrcode")).default;

  const tickets = booking?.issuedTickets ?? [];
  if (!tickets.length) return null;

  // 210×70mm
  const W = 210;
  const H = 70;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: [H, W] });

  const gold   = [201, 168,  76];
  const dark   = [ 13,  13,  26];
  const card   = [ 18,  18,  42];
  const light  = [232, 232, 240];
  const subtle = [120, 120, 160];

  const op = (o, fn) => {
    doc.setGState(new doc.GState({ opacity: o }));
    fn();
    doc.setGState(new doc.GState({ opacity: 1 }));
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric", month: "long", year: "numeric",
    });
  };
  const formatPrice = (c) =>
    (!c || c === 0) ? "Gratuit" : `${Number(c).toLocaleString("fr-FR")} FCFA`;

  for (let i = 0; i < tickets.length; i++) {
    if (i > 0) doc.addPage([H, W], "landscape");
    const ticket = tickets[i];

    const qrDataUrl = await QRCode.toDataURL(ticket.code, {
      width: 160, margin: 1,
      color: { dark: "#000000", light: "#ffffff" },
      errorCorrectionLevel: "H",
    });

    // ── Fond card ────────────────────────────────────────────────────────
    doc.setFillColor(...card);
    doc.roundedRect(0, 0, W, H, 3, 3, "F");

    // ── Bande or en haut ─────────────────────────────────────────────────
    doc.setFillColor(...gold);
    doc.rect(0, 0, W, 1.2, "F");

    // ── Colonne gauche — accent or (15mm) ─────────────────────────────────
    const accentW = 15;
    doc.setFillColor(...gold);
    doc.rect(0, 0, accentW, H, "F");

    // Points décoratifs dans la colonne or
    [10, 18, 26, 34, 42, 50, 58].forEach(y => {
      doc.setFillColor(...dark);
      op(0.2, () => doc.circle(accentW / 2, y, 0.8, "F"));
    });
    // Petit losange central
    doc.setFillColor(...dark);
    op(0.35, () => doc.circle(accentW / 2, H / 2, 1.5, "F"));

    // ── Zone principale (après colonne or) ────────────────────────────────
    const mainX = accentW + 6;
    const mainW = W - mainX - 6;

    // Séparateur vertical QR
    const qrZoneW = 36;
    const sepX    = W - qrZoneW - 8;

    // Ligne de séparation fine
    op(0.15, () => {
      doc.setDrawColor(...gold);
      doc.setLineWidth(0.3);
      doc.setLineDashPattern([1.5, 1.5], 0);
      doc.line(sepX, 8, sepX, H - 8);
      doc.setLineDashPattern([], 0);
    });

    // ── BLOC GAUCHE — titre + infos ───────────────────────────────────────
    const titleAreaW = sepX - mainX - 4;

    // Label catégorie
    if (booking.event?.category) {
      doc.setTextColor(...gold);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5);
      doc.setCharSpace(1.2);
      doc.text(booking.event.category.toUpperCase(), mainX, 12);
      doc.setCharSpace(0);
      // Ligne sous le label
      op(0.3, () => {
        doc.setDrawColor(...gold);
        doc.setLineWidth(0.2);
        doc.line(mainX, 13.5, mainX + 20, 13.5);
      });
    }

    // Titre événement
    const title = booking.event?.title ?? "Événement";
    doc.setTextColor(...light);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    // Tronquer si trop long
    const maxTitleW = titleAreaW;
    let displayTitle = title;
    while (doc.getStringUnitWidth(displayTitle) * 18 / doc.internal.scaleFactor > maxTitleW && displayTitle.length > 5) {
      displayTitle = displayTitle.slice(0, -1);
    }
    if (displayTitle !== title) displayTitle += "…";
    doc.text(displayTitle, mainX, 26);

    // Sous-ligne or sous le titre
    op(0.4, () => {
      doc.setDrawColor(...gold);
      doc.setLineWidth(0.3);
      doc.line(mainX, 28.5, mainX + 40, 28.5);
    });

    // Infos : date, lieu
    const infoData = [
      { label: "DATE",  value: formatDate(booking.event?.dateStart) },
      { label: "LIEU",  value: booking.event?.isOnline ? "En ligne" : ([booking.event?.venue, booking.event?.city].filter(Boolean).join(", ") || "—") },
      { label: "PRIX",  value: formatPrice(booking.totalAmount) },
    ];

    infoData.forEach((info, idx) => {
      const iy = 36 + idx * 8;
      // Label
      doc.setTextColor(...gold);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(4.5);
      doc.setCharSpace(0.8);
      doc.text(info.label, mainX, iy);
      doc.setCharSpace(0);
      // Valeur
      doc.setTextColor(...light);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      op(0.8, () => {
        const val = info.value.length > 28 ? info.value.slice(0, 28) + "…" : info.value;
        doc.text(val, mainX + 12, iy);
      });
    });

    // ── BLOC MILIEU — titulaire + code ────────────────────────────────────
    const midX = sepX + 4;
    const midW = qrZoneW - 6;

    // Admission label
    doc.setTextColor(...subtle);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(4.5);
    doc.setCharSpace(0.8);
    doc.text("ADMISSION", midX, 10);
    doc.setCharSpace(0);

    // Type billet
    doc.setTextColor(...light);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const tName = (ticket.ticket?.name ?? "Billet").slice(0, 12);
    doc.text(tName, midX, 17);

    // Titulaire
    doc.setTextColor(...light);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    op(0.6, () => {
      const name = booking.userName.slice(0, 14);
      doc.text(name, midX, 23);
    });

    // QR Code — centré dans la zone droite
    const qrSize = 22;
    const qrX    = midX + (midW - qrSize) / 2;
    const qrY    = 27;

    // Fond blanc avec padding
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(qrX - 1, qrY - 1, qrSize + 2, qrSize + 2, 1.5, 1.5, "F");
    // Bordure or
    op(0.4, () => {
      doc.setDrawColor(...gold);
      doc.setLineWidth(0.3);
      doc.roundedRect(qrX - 1, qrY - 1, qrSize + 2, qrSize + 2, 1.5, 1.5, "S");
    });
    doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

    // Code TKT sous le QR
    doc.setTextColor(...gold);
    doc.setFont("courier", "normal");
    doc.setFontSize(4.5);
    doc.setCharSpace(0.3);
    doc.text(ticket.code, midX + midW / 2, qrY + qrSize + 4, { align: "center" });
    doc.setCharSpace(0);

    // ── Ligne de séparation bas ───────────────────────────────────────────
    op(0.1, () => {
      doc.setDrawColor(...gold);
      doc.setLineWidth(0.2);
      doc.line(mainX, H - 9, W - 4, H - 9);
    });

    // ── Footer ────────────────────────────────────────────────────────────
    // Référence
    doc.setTextColor(...subtle);
    doc.setFont("courier", "normal");
    doc.setFontSize(4.5);
    doc.text(`RÉF. ${booking.reference}`, mainX, H - 4);

    // Index billet
    doc.setTextColor(...subtle);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(4.5);
    doc.text(
      `${i + 1} / ${tickets.length}  ·  1 entrée  ·  Non remboursable`,
      W - 4, H - 4,
      { align: "right" }
    );
  }

  return doc;
}