import { useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { photos } from '../data/manifest';
import { site, waLink, viberLink } from '../data/site';
import { useLang } from '../i18n/LanguageContext';
import './Quote.css';

type Service = 'wedding' | 'music' | 'print' | 'other';
type Status = 'idle' | 'sending' | 'sent' | 'error';

const SERVICES: Service[] = ['wedding', 'music', 'print', 'other'];

export default function Quote() {
  const { t, lang, pick } = useLang();
  const [params] = useSearchParams();
  const initial = (params.get('service') as Service) || 'wedding';
  const photoId = params.get('photo') ?? '';
  const [service, setService] = useState<Service>(SERVICES.includes(initial) ? initial : 'wedding');
  const [status, setStatus] = useState<Status>('idle');
  const q = t.quote;

  const photoTitle = useMemo(() => (photoId && photos[photoId] ? pick(photos[photoId], 'title') : ''), [photoId, pick]);

  const subject = `${site.brand} — ${q.services[service]}`;

  function serialize(form: HTMLFormElement): Record<string, string> {
    const data: Record<string, string> = {};
    new FormData(form).forEach((v, k) => {
      if (k === '_gotcha' || k === 'consent') return;
      const s = String(v).trim();
      if (s) data[k] = data[k] ? `${data[k]}, ${s}` : s;
    });
    return data;
  }

  function mailtoHref(data: Record<string, string>) {
    const body = Object.entries(data)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = serialize(form);
    if (!site.formspreeId) {
      window.location.href = mailtoHref(data);
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, _subject: subject, _language: lang }),
      });
      setStatus(res.ok ? 'sent' : 'error');
      if (res.ok) form.reset();
    } catch {
      setStatus('error');
    }
  }

  const waText = `${lang === 'el' ? 'Γεια σου, ενδιαφέρομαι για' : 'Hi, I am interested in'}: ${q.services[service]}${photoTitle ? ` — ${photoTitle}` : ''}`;
  const wa = waLink(waText);
  const vb = viberLink();

  return (
    <>
      <Seo title={q.title} description={q.metaDescription} />
      <header className="page-head wrap wrap--narrow">
        <p className="label label--faint">{t.nav.contact}</p>
        <h1 className="display">{q.title}</h1>
        <p className="lead">{q.lead}</p>
        <hr className="rule" />
      </header>

      <section className="wrap wrap--narrow quote">
        <form className="quote__form" onSubmit={onSubmit} noValidate={false}>
          {/* honeypot */}
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="quote__hp" aria-hidden="true" />

          <fieldset className="quote__fs">
            <legend className="label">{q.serviceLabel}</legend>
            <div className="quote__radios">
              {SERVICES.map((s) => (
                <label key={s} className={`quote__radio${service === s ? ' is-on' : ''}`}>
                  <input type="radio" name="service" value={q.services[s]} checked={service === s} onChange={() => setService(s)} />
                  <span>{q.services[s]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="quote__grid">
            <Field label={q.name} name="name" required autoComplete="name" />
            <Field label={q.email} name="email" type="email" required autoComplete="email" />
            <Field label={q.phone} name="phone" type="tel" autoComplete="tel" />

            {service === 'wedding' && (
              <>
                <Field label={q.date} name="date" type="date" />
                <Field label={q.venue} name="venue" />
                <Select label={q.hours} name="hours" options={q.hoursOpts} />
                <Field label={q.guests} name="guests" type="number" />
                <Checks label={q.deliverables} name="deliverables" options={q.deliverablesOpts} />
              </>
            )}
            {service === 'music' && (
              <>
                <Field label={q.band} name="band" />
                <Select label={q.musicType} name="type" options={q.musicTypeOpts} />
                <Field label={q.date} name="date" type="date" />
                <Field label={q.venue} name="venue" />
              </>
            )}
            {service === 'print' && (
              <>
                <Field label={q.photoRef} name="work" defaultValue={photoTitle ? `${photoTitle} (${photoId})` : ''} />
                <Select label={q.size} name="size" options={q.sizeOpts} />
                <Field label={q.quantity} name="quantity" type="number" defaultValue="1" />
              </>
            )}

            <Field label={q.budget} name="budget" />
            <div className="quote__field quote__field--full">
              <label htmlFor="q-message" className="label">
                {q.message}
              </label>
              <textarea id="q-message" name="message" rows={6} />
            </div>
          </div>

          <label className="quote__consent meta">
            <input type="checkbox" name="consent" required />
            <span>{q.consent}</span>
          </label>

          <div className="quote__actions">
            <button type="submit" className="quote__send" disabled={status === 'sending'}>
              {status === 'sending' ? q.sending : q.send}
            </button>
            {!site.formspreeId && <span className="meta">{q.mailtoNote}</span>}
          </div>

          <p className="quote__status meta" role="status" aria-live="polite">
            {status === 'sent' && q.sent}
            {status === 'error' && (
              <>
                {q.error}{' '}
                <a className="link-underline" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </>
            )}
          </p>
        </form>

        <aside className="quote__direct">
          <p className="label label--faint">{q.orDirect}</p>
          <ul className="quote__links">
            <li>
              <a className="link-underline" href={`mailto:${site.email}?subject=${encodeURIComponent(subject)}`}>
                {site.email}
              </a>
            </li>
            {site.phone && (
              <li>
                <a className="link-underline" href={`tel:${site.phone.replace(/\s+/g, '')}`}>
                  {site.phone}
                </a>
              </li>
            )}
            {wa && (
              <li>
                <a className="link-underline" href={wa} target="_blank" rel="noopener noreferrer">
                  {q.whatsapp} ↗
                </a>
              </li>
            )}
            {vb && (
              <li>
                <a className="link-underline" href={vb}>
                  {q.viber} ↗
                </a>
              </li>
            )}
          </ul>
        </aside>
      </section>
      <div className="section" aria-hidden="true" />
    </>
  );
}

/* ---- small field helpers ------------------------------------------------- */

function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
}) {
  const id = `q-${name}`;
  return (
    <div className="quote__field">
      <label htmlFor={id} className="label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input id={id} name={name} type={type} required={required} autoComplete={autoComplete} defaultValue={defaultValue} />
    </div>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: readonly string[] }) {
  const id = `q-${name}`;
  return (
    <div className="quote__field">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <select id={id} name={name} defaultValue="">
        <option value="">—</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Checks({ label, name, options }: { label: string; name: string; options: readonly string[] }) {
  return (
    <fieldset className="quote__field quote__field--full quote__checks">
      <legend className="label">{label}</legend>
      <div>
        {options.map((o) => (
          <label key={o} className="quote__check meta">
            <input type="checkbox" name={name} value={o} /> <span>{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
