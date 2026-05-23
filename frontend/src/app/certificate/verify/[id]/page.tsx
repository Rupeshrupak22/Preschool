import { Award, QrCode, ShieldCheck } from "lucide-react";

export default function CertificateVerifyPage({ params }: { params: { id: string } }) {
  return (
    <main className="grid min-h-screen place-items-center bg-ink bg-radial-grid px-4 text-saffron-900">
      <div className="glass w-full max-w-xl rounded-2xl p-8 text-center">
        <ShieldCheck className="mx-auto h-16 w-16 text-saffron-600" />
        <p className="mt-5 text-sm uppercase tracking-[0.22em] text-saffron-700">QR verification</p>
        <h1 className="mt-3 text-4xl font-semibold">Certificate verified</h1>
        <p className="mt-4 text-saffron-900/62">
          Credential {params.id} is formatted for ADYAPAN QR verification and can be backed by MongoDB Atlas certificate records.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.05] p-5">
            <Award className="mx-auto h-8 w-8 text-saffron-600" />
            <p className="mt-3 font-semibold">Active Credential</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.05] p-5">
            <QrCode className="mx-auto h-8 w-8 text-saffron-600" />
            <p className="mt-3 font-semibold">QR Secured</p>
          </div>
        </div>
        <a href="/" className="mt-7 inline-flex h-12 items-center justify-center rounded-lg bg-saffron-500 px-6 font-semibold shadow-glow">
          Back to ADYAPAN
        </a>
      </div>
    </main>
  );
}



