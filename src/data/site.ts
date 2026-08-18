/**
 * ONE place for the photographer's business details. Everything marked PLACEHOLDER
 * must be replaced with her real data before launch (see README → "Business details").
 * Empty string = the item is hidden on the site.
 */
export interface SiteConfig {
  brand: string; origin: string; email: string; phone: string; whatsapp: string; viber: string;
  formspreeId: string; legalName: string; afm: string; doy: string; address: string; city: string;
  analytics: '' | 'plausible' | 'goatcounter';
}

export const site: SiteConfig = {
  brand: 'P. Karagiorgou',
  origin: 'https://stergioscha.github.io',            // no trailing slash; change on custom domain
  email: 'unrealpk@gmail.com',                          // PLACEHOLDER
  phone: '',                                           // PLACEHOLDER e.g. '+30 69X XXX XXXX' (shown as text)
  whatsapp: '',                                        // PLACEHOLDER digits only, e.g. '3069XXXXXXXX' → wa.me link
  viber: '',                                           // PLACEHOLDER digits only, e.g. '3069XXXXXXXX' → viber://chat
  /** Formspree form id (https://formspree.io → New form → copy the id after /f/). Empty → mailto fallback. */
  formspreeId: '',                                     // PLACEHOLDER e.g. 'xabcdefg'
  /** invoicing details, shown small on Contact when filled */
  legalName: '',                                       // PLACEHOLDER e.g. 'Παναγιώτα Καραγιώργου'
  afm: '',                                             // PLACEHOLDER ΑΦΜ
  doy: '',                                             // PLACEHOLDER ΔΟΥ
  address: '',                                         // PLACEHOLDER έδρα (city is enough)
  city: 'Γρεβενά',
  /** optional cookie-free analytics: 'plausible' | 'goatcounter' | '' ; set the domain/code in index.html */
  analytics: '',
};

export function waLink(text: string) {
  return site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}` : '';
}
export function viberLink() {
  return site.viber ? `viber://chat?number=%2B${site.viber}` : '';
}
