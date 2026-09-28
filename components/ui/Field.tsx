import { useId, type ComponentProps } from "react";

/** Champ de formulaire (README §6.7) : libellé au-dessus, aide ou erreur en dessous. */
export function Field({
  label,
  aide,
  erreur,
  ...input
}: { label: string; aide?: string; erreur?: string } & ComponentProps<"input">) {
  const id = useId();
  const descId = aide || erreur ? `${id}-desc` : undefined;
  return (
    <div className="flex flex-col gap-[7px]">
      <label htmlFor={id} className="text-[13.5px] font-bold text-ink-900">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={erreur ? true : undefined}
        aria-describedby={descId}
        {...input}
        className="rounded-[14px] border border-line-field bg-white px-[15px] py-3 text-[15px] text-ink-900 outline-none placeholder:text-ink-300 focus:border-ink-900"
      />
      {erreur ? (
        <p id={descId} className="text-[13px] font-bold text-brique-700">
          {erreur}
        </p>
      ) : (
        aide && (
          <p id={descId} className="text-[13px] text-[#6B6560]">
            {aide}
          </p>
        )
      )}
    </div>
  );
}
