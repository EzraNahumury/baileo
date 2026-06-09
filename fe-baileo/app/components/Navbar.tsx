"use client";

import { useEffect, useState } from "react";
import { links, nav } from "../lib/site";
import { XIcon, DiscordIcon, TelegramIcon, GithubIcon } from "./Icons";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[var(--color-line)] bg-[rgba(5,5,5,0.78)] backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
        {/* left: nav links */}
        <ul className="hidden flex-1 items-center gap-8 text-[13px] tracking-wide text-[var(--color-muted)] lg:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="transition-colors hover:text-[var(--color-champagne)]">
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        {/* center: brand */}
        <a href="#" className="flex flex-col items-center leading-none lg:flex-1 lg:items-center">
          <span className="font-display text-xl font-semibold tracking-[0.4em] text-[var(--color-cream)] sm:text-2xl">
            BAILEO
          </span>
          <span className="mt-1 text-[9px] tracking-[0.55em] text-[var(--color-gold)]">
            ON&nbsp;CELO
          </span>
        </a>

        {/* right: socials + cta */}
        <div className="hidden flex-1 items-center justify-end gap-5 lg:flex">
          <div className="flex items-center gap-4 text-[var(--color-muted)]">
            <a href={links.celo} target="_blank" rel="noreferrer" aria-label="Telegram" className="transition-colors hover:text-[var(--color-gold)]">
              <TelegramIcon className="h-[18px] w-[18px]" />
            </a>
            <a href={links.celo} target="_blank" rel="noreferrer" aria-label="Discord" className="transition-colors hover:text-[var(--color-gold)]">
              <DiscordIcon className="h-[18px] w-[18px]" />
            </a>
            <a href={links.github} target="_blank" rel="noreferrer" aria-label="X" className="transition-colors hover:text-[var(--color-gold)]">
              <XIcon className="h-[15px] w-[15px]" />
            </a>
            <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="transition-colors hover:text-[var(--color-gold)]">
              <GithubIcon className="h-[18px] w-[18px]" />
            </a>
          </div>
          <a href="/app" className="gold-btn rounded-full px-5 py-2 text-[13px] font-semibold">
            Launch App
          </a>
        </div>

        {/* mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-champagne)] lg:hidden"
        >
          <div className="space-y-[5px]">
            <span className={`block h-[1.5px] w-5 bg-current transition ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-current transition ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {/* mobile menu */}
      <div
        className={`overflow-hidden border-t border-[var(--color-line)] bg-[rgba(5,5,5,0.95)] backdrop-blur-xl transition-[max-height] duration-500 lg:hidden ${
          open ? "max-h-96" : "max-h-0 border-transparent"
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-4 text-sm">
          {nav.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                onClick={() => setOpen(false)}
                className="block py-2.5 text-[var(--color-muted)] transition-colors hover:text-[var(--color-champagne)]"
              >
                {n.label}
              </a>
            </li>
          ))}
          <li className="pt-3">
            <a href="/app" className="gold-btn block rounded-full px-5 py-3 text-center text-sm font-semibold">
              Launch App
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
