"use client";

import { useId, useState, type ReactNode } from "react";

export interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "email" | "textarea";
  required?: boolean;
  autoComplete?: string;
  hint?: string;
  maxLength?: number;
}

interface Props {
  endpoint: string;
  fields: FieldDef[];
  submitLabel: string;
  /** Contenu affiché après succès, à partir de la réponse JSON. */
  success: (body: Record<string, unknown>) => ReactNode;
  disabledReason?: string;
}

/** Formulaire accessible : libellés explicites, erreurs reliées aux champs, champ piège anti-robot. */
export function AjaxForm({ endpoint, fields, submitLabel, success, disabledReason }: Props) {
  const uid = useId();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, unknown> | null>(null);
  const [pending, setPending] = useState(false);

  if (done) {
    return (
      <div role="status" className="card p-7">
        {success(done)}
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setFormError(null);
    const values = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const local: Record<string, string> = {};
    for (const f of fields) if (f.required && !values[f.name]?.trim()) local[f.name] = `${f.label} : champ obligatoire.`;
    if (Object.keys(local).length) {
      setErrors(local);
      setPending(false);
      document.getElementById(`${uid}-${Object.keys(local)[0]}`)?.focus();
      return;
    }
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) {
        setErrors((body.fields as Record<string, string>) ?? {});
        setFormError((body.error as string) ?? "Envoi impossible.");
      } else {
        setErrors({});
        setDone(body);
      }
    } catch {
      setFormError("Connexion impossible. Vérifiez votre réseau et réessayez.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {fields.map((f) => {
        const id = `${uid}-${f.name}`;
        const err = errors[f.name];
        const describedBy = [f.hint ? `${id}-hint` : null, err ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;
        const common = {
          id,
          name: f.name,
          required: f.required,
          autoComplete: f.autoComplete,
          maxLength: f.maxLength,
          "aria-invalid": Boolean(err),
          "aria-describedby": describedBy,
          className: "field",
        };
        return (
          <div key={f.name}>
            <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
              {f.label}
              {f.required ? <span aria-hidden="true"> *</span> : <span className="font-normal text-steel"> (facultatif)</span>}
            </label>
            {f.hint && (
              <p id={`${id}-hint`} className="mb-1.5 text-xs text-steel">
                {f.hint}
              </p>
            )}
            {f.type === "textarea" ? <textarea {...common} rows={6} /> : <input {...common} type={f.type ?? "text"} />}
            {err && (
              <p id={`${id}-err`} className="mt-1.5 text-sm text-[#b3261e]">
                {err}
              </p>
            )}
          </div>
        );
      })}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Ne pas remplir
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {formError && (
        <p role="alert" className="rounded-xl bg-[#fde8e6] px-4 py-3 text-sm text-[#8c1d18]">
          {formError}
        </p>
      )}
      {disabledReason && <p className="rounded-xl bg-warn-bg px-4 py-3 text-sm text-warn">{disabledReason}</p>}
      <p className="text-xs text-steel">* champ obligatoire</p>
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Envoi…" : submitLabel}
      </button>
    </form>
  );
}
