// src/pages/config/utils/mappers.js
import { PLATFORMS } from "../model";

export const toServerPayload = (items, profile) => {
  const links = items.map((i, order) => ({
    key: i.key,
    url: i.url,
    visible: i.visible,
    order,
  }));

  const theme = {
    title: profile.title,
    description: profile.description,
    align: profile.align,
    textColor: profile.textColor,
    avatarAlign: profile.avatarAlign,

    bgMode: profile.bgMode,
    bgColor: profile.bgColor,
    bgColor2: profile.bgColor2,
    bgAngle: profile.bgAngle,
    bgImageUrl: profile.bgImageDataUrl,
    overlayOpacity: profile.overlayOpacity,
    bgPosX: profile.bgPosX,
    bgPosY: profile.bgPosY,
    bgZoom: profile.bgZoom,

    btnVariant: profile.btnVariant,
    btnUseBrand: profile.btnUseBrand,
    btnBg: profile.btnBg,
    btnText: profile.btnText,
    btnBorder: profile.btnBorder,
    btnBorderWidth: profile.btnBorderWidth,
    btnRadius: profile.btnRadius,
    btnPill: profile.btnPill,
    btnShadow: profile.btnShadow,
    btnAlign: profile.btnAlign,
    btnWidth: profile.btnWidth,
    btnContentAlign: profile.btnContentAlign,
    btnIconSide: profile.btnIconSide,

    phoneWidth: profile.phoneWidth,
    containerPadding: profile.containerPadding,
    heroOffset: profile.heroOffset,
    linksGap: profile.linksGap,
    fontFamily: profile.fontFamily,
    fontSize: profile.fontSize,

    avatarUrl: profile.avatarDataUrl,
    coverUrl: "",
    pdfUrl: profile.pdfDataUrl,
    pdfName: profile.pdfName,

    contactFullName: profile.contactFullName,
    contactOrg: profile.contactOrg,
    contactTitle: profile.contactTitle,
    contactPhone: profile.contactPhone,
    contactEmail: profile.contactEmail,
    contactWebsite: profile.contactWebsite,
    contactStreet: profile.contactStreet,
    contactCity: profile.contactCity,
    contactRegion: profile.contactRegion,
    contactPostalCode: profile.contactPostalCode,
    contactCountry: profile.contactCountry,
    contactNote: profile.contactNote,
  };

  return {
    displayName: profile.title,
    bio: profile.description,
    theme,
    links,
  };
};

export const fromServerDoc = (doc) => {
  const t = doc?.theme || {};
  const serverProfile = {
    title: t.title || doc?.displayName || "",
    description: t.description || doc?.bio || "",
    align: t.align ?? "center",
    textColor: t.textColor ?? "#FFFFFF",
    avatarAlign: t.avatarAlign ?? "center",

    bgMode: t.bgMode ?? "image",
    bgColor: t.bgColor ?? "#0f172a",
    bgColor2: t.bgColor2 ?? "#1e3a8a",
    bgAngle: t.bgAngle ?? 180,
    bgImageDataUrl: t.bgImageUrl ?? "",
    overlayOpacity: t.overlayOpacity ?? 0.45,
    bgPosX: t.bgPosX ?? 50,
    bgPosY: t.bgPosY ?? 50,
    bgZoom: t.bgZoom ?? 100,

    btnVariant: t.btnVariant ?? "filled",
    btnUseBrand: t.btnUseBrand ?? false,
    btnBg: t.btnBg ?? "#0f172a",
    btnText: t.btnText ?? "#ffffff",
    btnBorder: t.btnBorder ?? "#ffffff",
    btnBorderWidth: t.btnBorderWidth ?? 2,
    btnRadius: t.btnRadius ?? 18,
    btnPill: t.btnPill ?? true,
    btnShadow: t.btnShadow ?? true,
    btnAlign: t.btnAlign ?? "stretch",
    btnWidth: t.btnWidth ?? 85,
    btnContentAlign: t.btnContentAlign ?? "left",
    btnIconSide: t.btnIconSide ?? "left",

    phoneWidth: t.phoneWidth ?? 390,
    containerPadding: t.containerPadding ?? 18,
    heroOffset: t.heroOffset ?? 0,
    linksGap: t.linksGap ?? 12,
    fontFamily: t.fontFamily ?? "System",
    fontSize: t.fontSize ?? 16,

    avatarDataUrl: t.avatarUrl ?? "",
    pdfDataUrl: t.pdfUrl ?? "",
    pdfName: t.pdfName ?? "",

    contactFullName: t.contactFullName ?? "",
    contactOrg: t.contactOrg ?? "",
    contactTitle: t.contactTitle ?? "",
    contactPhone: t.contactPhone ?? "",
    contactEmail: t.contactEmail ?? "",
    contactWebsite: t.contactWebsite ?? "",
    contactStreet: t.contactStreet ?? "",
    contactCity: t.contactCity ?? "",
    contactRegion: t.contactRegion ?? "",
    contactPostalCode: t.contactPostalCode ?? "",
    contactCountry: t.contactCountry ?? "",
    contactNote: t.contactNote ?? "",
  };

  const serverLinks = Array.isArray(doc?.links) ? doc.links : [];
  const mergedLinks = PLATFORMS.map((p) => {
    const found = serverLinks.find((x) => x.key === p.key);
    return {
      key: p.key,
      url: found?.url || "",
      visible: found?.visible ?? true,
      open: false,
    };
  });

  return { profile: serverProfile, items: mergedLinks };
};