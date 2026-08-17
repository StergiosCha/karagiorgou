import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { strings, type Lang, type Strings } from './strings';

interface LangCtx {
  lang: Lang;
  t: Strings;
  toggle: () => void;
  setLang: (l: Lang) => void;
  /** pick the right field from a bilingual object: pick(obj, 'title') → obj.title_el | obj.title_en */
  pick: (obj: object, key: string) => string;
}

const Ctx = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default language: Greek. Kept in memory (and mirrored to sessionStorage so a reload doesn't flip it back).
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = sessionStorage.getItem('prunak.lang');
      return saved === 'en' ? 'en' : 'el';
    } catch {
      return 'el';
    }
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      sessionStorage.setItem('prunak.lang', l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => setLang(lang === 'el' ? 'en' : 'el'), [lang, setLang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LangCtx>(
    () => ({
      lang,
      t: strings(lang),
      toggle,
      setLang,
      pick: (obj, key) => {
        const o = obj as Record<string, unknown>;
        const primary = o[`${key}_${lang}`];
        const other = o[`${key}_${lang === "el" ? "en" : "el"}`];
        return (typeof primary === 'string' && primary) || (typeof other === 'string' && other) || '';
      },
    }),
    [lang, toggle, setLang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useLang must be used inside <LanguageProvider>');
  return v;
}
