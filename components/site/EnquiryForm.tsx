"use client";

import { useId, useRef, useState } from "react";
import { contact, site } from "@/lib/content";

/**
 * The project enquiry form.
 *
 * Field styling follows the rest of the site: hairline rules, no boxes, no
 * cards, no radius. An input here is a label and an underline, which is the
 * same device the section dividers use.
 *
 * Delivery is deliberately fail-loud. If the enquiry cannot be handed to a real
 * destination the form says so and offers the address instead — a studio page
 * that silently drops a lead is worse than one with no form on it.
 */

type Status = "idle" | "sending" | "sent" | "failed";

const field =
  "type-body mt-4 w-full border-b border-rule-invert bg-transparent pb-3 text-bone " +
  "placeholder:text-bone-35 transition-colors duration-300 hover:border-rule-invert-strong " +
  "focus:border-bone";

export function EnquiryForm({ onFirstFieldRef }: { onFirstFieldRef?: (el: HTMLInputElement | null) => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const id = (name: string) => `${uid}-${name}`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <div className="border-t border-rule-invert pt-10 md:pt-12">
        <p className="type-h3 max-w-[24ch] text-bone">{contact.form.success.title}</p>
        <p className="type-body measure mt-5 text-bone-60">{contact.form.success.body}</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate={false}
      aria-label={contact.form.label}
      className="border-t border-rule-invert pt-10 md:pt-12"
    >
      {/* Honeypot. Never shown, never announced, never tabbed to. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Website</label>
        <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
        <div>
          <label htmlFor={id("name")} className="type-label text-bone-60">
            {contact.form.name.label}
          </label>
          <input
            ref={onFirstFieldRef}
            id={id("name")}
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={contact.form.name.placeholder}
            className={field}
          />
        </div>

        <div>
          <label htmlFor={id("email")} className="type-label text-bone-60">
            {contact.form.email.label}
          </label>
          <input
            id={id("email")}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={contact.form.email.placeholder}
            className={field}
          />
        </div>

        <div>
          <label htmlFor={id("company")} className="type-label text-bone-60">
            {contact.form.company.label}
          </label>
          <input
            id={id("company")}
            name="company"
            type="text"
            required
            autoComplete="organization"
            placeholder={contact.form.company.placeholder}
            className={field}
          />
        </div>

        <div>
          <label htmlFor={id("stage")} className="type-label flex items-baseline gap-3 text-bone-60">
            {contact.form.stage.label}
            <span className="text-bone-35 normal-case tracking-normal">
              {contact.form.stage.optional}
            </span>
          </label>
          {/* Native select, restyled. A custom listbox would be the only
              non-native control on the site for no gain in clarity. */}
          <div className="relative">
            <select
              id={id("stage")}
              name="stage"
              defaultValue=""
              className={`${field} appearance-none pr-8`}
            >
              <option value="" className="bg-void text-bone-60">
                {contact.form.stage.placeholder}
              </option>
              {contact.form.stage.options.map((option) => (
                <option key={option} value={option} className="bg-void text-bone">
                  {option}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-0 bottom-4 text-bone-60"
            >
              <svg viewBox="0 0 12 12" className="size-3" fill="none">
                <path d="M1.5 4 L6 8.5 L10.5 4" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </span>
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor={id("brief")} className="type-label text-bone-60">
            {contact.form.brief.label}
          </label>
          <textarea
            id={id("brief")}
            name="brief"
            required
            rows={5}
            placeholder={contact.form.brief.placeholder}
            className={`${field} resize-none`}
          />
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
        <button
          type="submit"
          disabled={status === "sending"}
          className="type-label group inline-flex items-center gap-5 bg-bone px-9 py-6 text-void transition-colors duration-[0.42s] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-accent hover:text-bone disabled:opacity-55 md:px-11"
        >
          {status === "sending" ? contact.form.sending : contact.form.submit}
          <span
            aria-hidden
            className="block transition-transform duration-[0.42s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none">
              <path d="M4 12 h15 M13 6 l6 6 -6 6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </button>

        <p className="type-small measure text-bone-60 md:max-w-[46ch] md:text-right">
          {contact.form.assurance}
        </p>
      </div>

      {/* Live region: a failed send must be announced, not just coloured. */}
      <p role="status" aria-live="polite" className="type-small mt-8 text-bone">
        {status === "failed" ? (
          <>
            {contact.form.failure}{" "}
            <a href={`mailto:${site.email}`} className="link-rule text-accent-soft">
              {site.email}
            </a>
          </>
        ) : null}
      </p>
    </form>
  );
}
