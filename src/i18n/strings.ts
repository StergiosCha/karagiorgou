export type Lang = 'el' | 'en';

const dict = {
  el: {
    siteName: 'Prunak',
    tagline: 'φωτογραφίες',
    nav: { home: 'Αρχική', portfolio: 'Portfolio', about: 'Βιογραφικό', journal: 'Ημερολόγιο', contact: 'Επικοινωνία' },
    langToggle: 'Αλλαγή γλώσσας σε Αγγλικά',
    skipToContent: 'Μετάβαση στο περιεχόμενο',
    home: {
      intro: 'Ερείπια, ομίχλη, στάσιμα νερά — φωτογραφίες από τον βορρά της Ελλάδας και τα Βαλκάνια.',
      seriesLabel: 'Σειρές',
      enter: 'Είσοδος',
      metaDescription:
        'Prunak — φωτογραφικό portfolio της Παναγιώτας Καραγιώργου. Βαλκανική φθορά, ομίχλη, αστική μελαγχολία, ασπρόμαυρη σιωπή, βόρειες ακτές.',
    },
    portfolio: {
      title: 'Portfolio',
      lead: 'Πέντε σειρές. Δέκα φωτογραφίες η καθεμία.',
      photos: 'φωτογραφίες',
      metaDescription: 'Οι πέντε φωτογραφικές σειρές της Παναγιώτας Καραγιώργου.',
    },
    series: {
      label: 'Σειρά',
      of: 'από',
      prev: 'Προηγούμενη σειρά',
      next: 'Επόμενη σειρά',
      backToPortfolio: 'Όλες οι σειρές',
      notFound: 'Η σειρά δεν βρέθηκε.',
      openPhoto: 'Άνοιγμα φωτογραφίας',
    },
    lightbox: {
      close: 'Κλείσιμο',
      prev: 'Προηγούμενη φωτογραφία',
      next: 'Επόμενη φωτογραφία',
      viewOn: 'Προβολή στο',
      counter: (i: number, n: number) => `${i} / ${n}`,
      dialogLabel: 'Προβολή φωτογραφίας',
    },
    about: {
      title: 'Βιογραφικό',
      placeholderNote: 'ΚΕΙΜΕΝΟ-ΥΠΟΔΕΙΓΜΑ — προς αντικατάσταση',
      body: [
        'Η Παναγιώτα Καραγιώργου φωτογραφίζει τα Βαλκάνια, τον βορρά, ό,τι απομένει όταν οι άνθρωποι φεύγουν: κτίσματα που φθίνουν, πεδιάδες μέσα στην ομίχλη, στάσιμα νερά.',
        'Ζει και εργάζεται στη Θεσσαλονίκη.',
      ],
      portraitAlt: 'Πορτρέτο της Παναγιώτας Καραγιώργου',
      metaDescription: 'Βιογραφικό της φωτογράφου Παναγιώτας Καραγιώργου.',
    },
    journal: {
      title: 'Ημερολόγιο',
      empty: 'Τίποτα ακόμη',
      emptySub: 'Σημειώσεις, ταξίδια, σκέψεις — θα έρθουν με τον καιρό.',
      readMore: 'Ανάγνωση',
      back: 'Ημερολόγιο',
      notFound: 'Η καταχώριση δεν βρέθηκε.',
      metaDescription: 'Ημερολόγιο της φωτογράφου Παναγιώτας Καραγιώργου.',
    },
    contact: {
      title: 'Επικοινωνία',
      emailLabel: 'Email',
      emailPlaceholder: 'email@example.com',
      emailNote: 'ΥΠΟΔΕΙΓΜΑ — προς αντικατάσταση',
      elsewhere: 'Αλλού',
      metaDescription: 'Επικοινωνία με τη φωτογράφο Παναγιώτα Καραγιώργου.',
    },
    notFound: { title: 'Δεν βρέθηκε', body: 'Η σελίδα δεν υπάρχει.', home: 'Επιστροφή στην αρχική' },
    footer: { rights: 'Όλα τα δικαιώματα διατηρούνται.', copyright: 'Παναγιώτα Καραγιώργου' },
  },
  en: {
    siteName: 'Prunak',
    tagline: 'photographs',
    nav: { home: 'Home', portfolio: 'Portfolio', about: 'About', journal: 'Journal', contact: 'Contact' },
    langToggle: 'Switch language to Greek',
    skipToContent: 'Skip to content',
    home: {
      intro: 'Ruins, fog, still water — photographs from northern Greece and the Balkans.',
      seriesLabel: 'Series',
      enter: 'Enter',
      metaDescription:
        'Prunak — the photographic portfolio of Panagiota Karagiorgou. Balkan decay, fog, urban melancholy, monochrome silence, northern coastlines.',
    },
    portfolio: {
      title: 'Portfolio',
      lead: 'Five series. Ten photographs each.',
      photos: 'photographs',
      metaDescription: 'The five photographic series of Panagiota Karagiorgou.',
    },
    series: {
      label: 'Series',
      of: 'of',
      prev: 'Previous series',
      next: 'Next series',
      backToPortfolio: 'All series',
      notFound: 'Series not found.',
      openPhoto: 'Open photograph',
    },
    lightbox: {
      close: 'Close',
      prev: 'Previous photograph',
      next: 'Next photograph',
      viewOn: 'View on',
      counter: (i: number, n: number) => `${i} / ${n}`,
      dialogLabel: 'Photograph viewer',
    },
    about: {
      title: 'About',
      placeholderNote: 'PLACEHOLDER — replace this text',
      body: [
        'Panagiota Karagiorgou photographs the Balkans, the north, whatever remains when people leave: buildings in decline, plains under fog, still water.',
        'She lives and works in Thessaloniki.',
      ],
      portraitAlt: 'Portrait of Panagiota Karagiorgou',
      metaDescription: 'About the photographer Panagiota Karagiorgou.',
    },
    journal: {
      title: 'Journal',
      empty: 'Nothing yet',
      emptySub: 'Notes, journeys, thoughts — they will come in time.',
      readMore: 'Read',
      back: 'Journal',
      notFound: 'Entry not found.',
      metaDescription: 'Journal of the photographer Panagiota Karagiorgou.',
    },
    contact: {
      title: 'Contact',
      emailLabel: 'Email',
      emailPlaceholder: 'email@example.com',
      emailNote: 'PLACEHOLDER — replace',
      elsewhere: 'Elsewhere',
      metaDescription: 'Contact the photographer Panagiota Karagiorgou.',
    },
    notFound: { title: 'Not found', body: 'This page does not exist.', home: 'Back to home' },
    footer: { rights: 'All rights reserved.', copyright: 'Panagiota Karagiorgou' },
  },
} as const;

export type Strings = (typeof dict)['el'];
export function strings(lang: Lang): Strings {
  return dict[lang] as unknown as Strings;
}
