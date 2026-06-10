import { useLocation } from "react-router-dom";
import { ArrowUpRight, ShieldCheck, BadgeCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { PageSeo } from "@/components/PageSeo";
import { getStaticPageSeo } from "@/lib/staticPageSeo";

type Patent = {
  number: string;
  label?: string;
  issued?: string;
  url: string;
};

const PATENTS: Patent[] = [
  { number: "9,084,459", url: "https://patents.google.com/patent/US9084459B2/en" },
  { number: "10,016,036", url: "https://patents.google.com/patent/US10016036B2/en" },
  { number: "10,561,213", url: "https://patents.google.com/patent/US10561213B2/en" },
  { number: "11,116,298", url: "https://patents.google.com/patent/US11116298B2/en?oq=11116298" },
  { number: "11,375,783", label: "Convertible", url: "https://patents.google.com/patent/US11375783B2/en?oq=11375783" },
  { number: "11,910,900", issued: "Issued February 27, 2024", url: "https://patents.google.com/patent/US11910900B2/en?oq=11%2c910%2c900" },
  { number: "12,458,120", label: "Convertible", issued: "Issued November 4, 2025", url: "https://patents.google.com/patent/US12458120B2/en?oq=12%2c458%2c120" },
  { number: "12,593,903", issued: "Issued April 7, 2026", url: "https://patents.google.com/patent/US12593903B2/en?oq=12593903" },
];

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
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_60%_at_50%_0%,rgba(59,130,246,0.18),transparent_60%),radial-gradient(40%_40%_at_80%_20%,rgba(168,85,247,0.12),transparent_60%)]"
          />
          <div className="container relative max-w-5xl py-20 md:py-28 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Protected Innovation
            </div>
            <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              Lay-n-Go Patents
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
              Sixteen years of engineering distilled into a single, patented motion — open flat, cinch closed.
              Our utility patents protect the design across every Lay-n-Go product.
            </p>
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

        {/* Patent grid */}
        <section className="bg-white py-16 md:py-20">
          <div className="container max-w-6xl">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Patent Portfolio</p>
                <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                  U.S. Utility Patents
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PATENTS.map((p, i) => (
                <a
                  key={p.number}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 p-6 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_18px_40px_-24px_rgba(15,23,42,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_28px_50px_-24px_rgba(15,23,42,0.3)]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-primary/15 to-transparent blur-2xl"
                  />
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                      <BadgeCheck className="h-3 w-3" />
                      Patent {String(i + 1).padStart(2, "0")}
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-900" />
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
                    {p.issued ? (
                      <div className="mt-3 text-xs text-slate-500">{p.issued}</div>
                    ) : null}
                  </div>
                  <div className="mt-6 flex items-center text-xs font-medium text-slate-600 group-hover:text-slate-900">
                    View on Google Patents
                  </div>
                </a>
              ))}
            </div>

            {/* Summary chart */}
            <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_18px_40px_-24px_rgba(15,23,42,0.2)]">
              <div className="border-b border-slate-200/70 bg-white/60 px-6 py-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Quick Reference
                </p>
                <h3 className="mt-1 font-heading text-lg font-semibold tracking-tight text-slate-900">
                  All U.S. Utility Patents
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      <th className="px-6 py-3">#</th>
                      <th className="px-6 py-3">Patent No.</th>
                      <th className="px-6 py-3">Notes</th>
                      <th className="px-6 py-3">Issued</th>
                      <th className="px-6 py-3 text-right">Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70">
                    {PATENTS.map((p, i) => (
                      <tr key={p.number} className="text-slate-700 hover:bg-slate-50/60">
                        <td className="px-6 py-3 text-slate-400">{String(i + 1).padStart(2, "0")}</td>
                        <td className="px-6 py-3 font-medium text-slate-900">{p.number}</td>
                        <td className="px-6 py-3 text-slate-600">{p.label ?? "—"}</td>
                        <td className="px-6 py-3 text-slate-600">
                          {p.issued?.replace(/^Issued\s+/, "") ?? "—"}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            View <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-200/70 bg-slate-50/60 px-6 py-3 text-xs text-slate-500">
                Combined reference: 9,084,459 / 10,016,036 / 10,561,213 / 11,116,298 / 11,375,783 (Convert) /
                11,910,900 / 12,458,120 / 12,593,903
              </div>
            </div>

            {/* APEX */}
            <div className="mt-8 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.5)] md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                    Amazon Patent Evaluation Express
                  </p>
                  <h3 className="mt-2 font-heading text-xl font-semibold tracking-tight md:text-2xl">
                    APEX Certified — Edward Rice, 05/02/2019
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
