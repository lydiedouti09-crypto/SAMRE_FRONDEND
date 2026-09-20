import RevealText from "@/components/RevealText";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-navy-950 py-20 lg:py-24 text-white">
      <div className="mx-auto grid max-w-wrap grid-cols-1 gap-14 px-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-orange/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-orange">
            <MessageCircle size={14} />
            Contact
          </div>
          <RevealText as="h2" className="font-display text-3xl font-bold sm:text-4xl">
            Une question ?
            <br />
            <span className="text-brand-orange">Parlons-nous.</span>
          </RevealText>
          <p className="mt-4 max-w-sm text-slate-300 leading-relaxed">
            Notre équipe vous répond rapidement, que vous soyez candidat ou
            entreprise.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/15">
                <Mail size={18} className="text-brand-orange" />
              </span>
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="text-sm font-medium">contact@samre.tg</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15">
                <Phone size={18} className="text-success" />
              </span>
              <div>
                <p className="text-xs text-slate-400">Téléphone</p>
                <p className="text-sm font-medium">+228 00 00 00 00</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/15">
                <MapPin size={18} className="text-info" />
              </span>
              <div>
                <p className="text-xs text-slate-400">Adresse</p>
                <p className="text-sm font-medium">Lomé, Togo</p>
              </div>
            </div>
          </div>
        </div>

        <form className="space-y-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">Nom</label>
              <input
                type="text"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">Prénom</label>
              <input
                type="text"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
                placeholder="Votre prénom"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
              placeholder="vous@exemple.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">Sujet</label>
            <select className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition">
              <option>Candidat — Question sur les offres</option>
              <option>Entreprise — Publier une offre</option>
              <option>Partenariat</option>
              <option>Autre</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">Message</label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition resize-none"
              placeholder="Comment pouvons-nous vous aider ?"
            />
          </div>
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-orange to-brand-orange-dark py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-orange/25 transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/30 hover:-translate-y-0.5"
          >
            <Send size={16} />
            Envoyer le message
          </button>
        </form>
      </div>

      {/* Background decorations */}
      <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-brand-orange/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-info/5 blur-3xl" />
    </section>
  );
}
