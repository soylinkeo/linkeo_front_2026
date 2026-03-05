// src/pages/config/utils/vcard.js
const escapeV = (s = "") => s.replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

export const buildVCard = (profile, visibleLinks, platforms) => {
  const p = profile;

  const socialNote = visibleLinks
    .map((l) => {
      const name = platforms.find((x) => x.key === l.key)?.name || l.key;
      return `${name}: ${l.href}`;
    })
    .join("\\n");

  const note = [p.contactNote, socialNote].filter(Boolean).join("\\n");

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeV(p.contactFullName || p.title || "")}`,
    p.contactOrg ? `ORG:${escapeV(p.contactOrg)}` : null,
    p.contactTitle ? `TITLE:${escapeV(p.contactTitle)}` : null,
    p.contactPhone ? `TEL;TYPE=CELL:${p.contactPhone.replace(/\s+/g, "")}` : null,
    p.contactEmail ? `EMAIL;TYPE=INTERNET:${p.contactEmail}` : null,
    p.contactWebsite ? `URL:${p.contactWebsite}` : null,
    p.contactStreet || p.contactCity || p.contactCountry
      ? `ADR;TYPE=HOME:;;${escapeV(p.contactStreet)};${escapeV(p.contactCity)};${escapeV(
          p.contactRegion
        )};${escapeV(p.contactPostalCode)};${escapeV(p.contactCountry)}`
      : null,
    p.avatarDataUrl ? `PHOTO;ENCODING=b;TYPE=JPEG:${p.avatarDataUrl.split(",")[1] || ""}` : null,
    note ? `NOTE:${note}` : null,
    "END:VCARD",
  ].filter(Boolean);

  return lines.join("\r\n");
};

export const downloadTextFile = (filename, content, mime) => {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};