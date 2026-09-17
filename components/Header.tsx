"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X, ChevronDown } from "lucide-react";

const links = [
  { label: "Accueil", href: "#accueil" },
  { label: "À propos", href: "#apropos" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [opportunitiesOpen, setOpportunitiesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("Toute catégorie");
  const [searchMessage, setSearchMessage] = useState("");

  const searchCategories = [
    "Toute catégorie",
    "Emploi",
    "Entreprise",
    "Motivation",
    "Offre de stage",
    "Opportunité",
    "Partenariats",
    "Sponsoring",
  ];

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    const scope = searchCategory === "Toute catégorie" ? "toutes les catégories" : searchCategory;
    setSearchMessage(
      query
        ? `Recherche de « ${query} » dans ${scope}.`
        : `Affichage des résultats dans ${scope}.`,
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="relative mx-auto flex max-w-wrap items-center justify-between gap-6 px-6 py-3">
        <Link href="#accueil" className="flex items-center gap-2.5 font-display text-lg font-bold text-navy-900">
          <Image src="/logo.png" alt="SAMRE Logo" width={38} height={38} className="object-contain" />
          <span className="bg-gradient-to-r from-navy-900 to-navy-700 bg-clip-text text-transparent">SAMRE</span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {links.map((l, index) => (
            <div key={l.href} className="flex items-center">
              <a
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-surface hover:text-navy-900"
              >
                {l.label}
              </a>
              {index === 0 && (
                <div className="group relative">
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-surface hover:text-navy-900"
                    aria-label="Afficher les opportunités"
                  >
                    Opportunités
                    <ChevronDown size={15} className="transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  <div className="invisible absolute left-0 top-full z-50 mt-2 w-44 translate-y-1 rounded-xl border border-slate-100 bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <a
                      href="#candidats"
                      className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-surface hover:text-navy-900"
                    >
                      Stagiaire
                    </a>
                    <a
                      href="#entreprises"
                      className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-surface hover:text-navy-900"
                    >
                      Entreprise
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            className="rounded-full p-2.5 text-slate-400 transition hover:bg-surface hover:text-navy-900"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Rechercher"
            aria-expanded={searchOpen}
          >
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
          <Link
            href="/connexion"
            prefetch={true}
            className="rounded-full bg-gradient-to-r from-brand-orange to-brand-orange-dark px-6 py-2 text-sm font-semibold text-white shadow-md shadow-brand-orange/25 transition-all duration-200 hover:shadow-lg hover:shadow-brand-orange/35 hover:-translate-y-0.5"
          >
            Se connecter
          </Link>
          <button
            className="ml-1 rounded-lg p-2 text-slate-500 hover:bg-surface lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 shadow-lg lg:px-8">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-wrap flex-col gap-2 sm:flex-row">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Votre recherche</span>
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Rechercher..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20"
              />
            </label>
            <label className="sm:w-[210px]">
              <span className="sr-only">Catégorie</span>
              <select
                value={searchCategory}
                onChange={(event) => setSearchCategory(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-navy-900 outline-none transition focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20"
              >
                {searchCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-navy-900 px-5 text-sm font-semibold text-white transition hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
            >
              <Search size={16} />
              Rechercher
            </button>
          </form>
          {searchMessage && (
            <p role="status" className="mx-auto max-w-wrap px-1 pt-2 text-xs font-medium text-brand-orange">
              {searchMessage}
            </p>
          )}
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="animate-slide-up border-t border-slate-100 bg-white px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-surface hover:text-navy-900"
              >
                {l.label}
              </a>
            ))}
            <div className="border-t border-slate-100 pt-1">
              <button
                type="button"
                onClick={() => setOpportunitiesOpen(!opportunitiesOpen)}
                aria-expanded={opportunitiesOpen}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-surface hover:text-navy-900"
              >
                Opportunités
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${opportunitiesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {opportunitiesOpen && (
                <div className="ml-4 border-l-2 border-brand-orange/30 pl-3">
                  <a
                    href="#candidats"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-4 py-2.5 text-sm text-slate-500 transition hover:bg-surface hover:text-navy-900"
                  >
                    Stagiaire
                  </a>
                  <a
                    href="#entreprises"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-4 py-2.5 text-sm text-slate-500 transition hover:bg-surface hover:text-navy-900"
                  >
                    Entreprise
                  </a>
                </div>
              )}
            </div>
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
            <Link
              href="/connexion"
              prefetch={true}
              onClick={() => setMobileOpen(false)}
              className="rounded-full bg-gradient-to-r from-brand-orange to-brand-orange-dark px-5 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-brand-orange/20 transition-all"
            >
              Se connecter
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
