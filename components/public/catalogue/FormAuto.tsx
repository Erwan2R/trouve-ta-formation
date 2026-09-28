"use client";

import { useRef, useState, useEffect } from "react";

/**
 * Formulaire GET qui se soumet seul quand une case ou une liste change (le champ texte reste sur Entrée).
 * Sans JavaScript, le bouton « Appliquer » prend le relais : le catalogue fonctionne en HTML pur.
 */
export function FormAuto({
  action,
  className,
  libelleBouton = "Appliquer",
  children,
}: {
  action: string;
  className?: string;
  libelleBouton?: string;
  children: React.ReactNode;
}) {
  const form = useRef<HTMLFormElement>(null);
  const [js, setJs] = useState(false);
  useEffect(() => setJs(true), []);
  return (
    <form
      ref={form}
      action={action}
      method="get"
      className={className}
      onChange={(e) => {
        const type = (e.target as unknown as { type?: string }).type;
        if (type !== "text" && type !== "search") form.current?.requestSubmit();
      }}
    >
      {children}
      {!js && (
        <button
          type="submit"
          className="mt-3 w-full rounded-full bg-ink-900 px-5 py-3 text-sm font-bold text-white hover:bg-brique-700"
        >
          {libelleBouton}
        </button>
      )}
    </form>
  );
}
