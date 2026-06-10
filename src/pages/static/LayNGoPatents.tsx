import { useLocation } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { PageSeo } from "@/components/PageSeo";
import { getStaticPageSeo } from "@/lib/staticPageSeo";

type Patent = {
  number: string;
  label?: string;
  issued?: string;
};

const PATENTS: Patent[] = [
  { number: "9,084,459" },
  { number: "10,016,036" },
  { number: "10,561,213" },
  { number: "11,116,298" },
  { number: "11,375,783", label: "Convertible" },
  { number: "11,910,900", issued: "February 27, 2024" },
  { number: "12,458,120", label: "Convertible", issued: "November 4, 2025" },
  { number: "12,593,903", issued: "April 7, 2026" },
];

const PATENT_SUMMARY =
  "9,084,459 / 10,016,036 / 10,561,213 / 11,116,298 / 11,375,783 (Convert) / 11,910,900 / 12,458,120 / 12,593,903";

const LayNGoPatents = () => {
  const { pathname } = useLocation();
  const seo = getStaticPageSeo(pathname);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageSeo
        title="Lay-n-Go Patents"
        description={seo.description}
        pathname={pathname}
        keywords={seo.keywords}
      />
      <Header />
      <main id="main-content" className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_60%_at_50%_0%,rgba(59,130,246,0.18),transparent_60%),radial-gradient(40%_40%_at_80%_20%,rgba(168,85,247,0.12),transparent_60%)]"
          />
          <div className="container relative max-w-5xl py-20 md:py-28 text-center">
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              Lay-n-Go Patents
            </h1>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto">
              {[
                { value: "8", label: "U.S. Utility Patents" },
                { value: "16+", label: "Years Protected" },
                { value: "2026", label: "Most Recent" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_10px_30px_-15px_rgba(15,23,42,0.15)] backdrop-blur"
                >
                  <div className="font-heading text-2xl font-semibold text-slate-900 md:text-3xl">{s.value}</div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20">
          <div className="container max-w-6xl">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Patent Portfolio</p>
              <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                U.S. Utility Patents
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PATENTS.map((p, i) => (
                <div
                  key={p.number}
                  className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 p-6 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_18px_40px_-24px_rgba(15,23,42,0.25)]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-primary/15 to-transparent blur-2xl"
                  />
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                    <BadgeCheck className="h-3 w-3" aria-hidden />
                    Patent {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-6">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      U.S. Patent No.
                    </div>
                    <div className="mt-1 font-heading text-3xl font-semibold tracking-tight text-slate-900">
                      {p.number}
                    </div>
                    {p.label ? (
                      <span className="mt-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                        {p.label}
                      </span>
                    ) : null}
                    {p.issued ? <div className="mt-3 text-xs text-slate-500">Issued {p.issued}</div> : null}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 rounded-2xl border border-slate-200/80 bg-slate-50/60 px-6 py-4 text-xs leading-relaxed text-slate-500">
              <span className="font-semibold text-slate-700">US Utility Patents:</span> {PATENT_SUMMARY}
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.5)] md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                    Amazon Patent Evaluation Express
                  </p>
                  <h3 className="mt-2 font-heading text-xl font-semibold tracking-tight md:text-2xl">
                    APEX Certified, Edward Rice, 05/02/2019
                  </h3>
                  <p className="mt-1 text-sm text-white/70">
                    Evaluation Number{" "}
                    <span className="font-mono text-white">5743828331</span>
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 px-4 py-3 text-center backdrop-blur">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">APEX #</div>
                  <div className="font-mono text-lg font-semibold">5743828331</div>
                </div>
              </div>
            </div>

            <p className="mt-10 text-center text-sm text-slate-500">
              Nothing on this site grants a license to reproduce our patented designs. For licensing inquiries, contact{" "}
              <a href="mailto:info@layngo.com" className="text-primary hover:underline">
                info@layngo.com
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default LayNGoPatents;
