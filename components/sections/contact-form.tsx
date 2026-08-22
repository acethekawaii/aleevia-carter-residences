"use client";

import { Check, Loader2, Mail, Phone } from "lucide-react";
import { type FormEvent, type ReactNode, useId, useRef, useState } from "react";

import { CtaLink, ctaVariants } from "@/components/ui/cta-link";
import { submitLead } from "@/lib/leads";
import { CONTACT, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { LeadPayload } from "@/types/lead";

/** Every key the API can reject, in the order they appear in the form. */
const FIELD_ORDER = [
  "firstName",
  "lastName",
  "contactNumber",
  "email",
  "message",
  "marketingConsent",
  "privacyConsent",
] as const;

type FieldName = (typeof FIELD_ORDER)[number];
type TextFieldName = Exclude<FieldName, "marketingConsent" | "privacyConsent">;
type FieldErrors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success" | "error";

type FormValues = Record<TextFieldName, string> & {
  marketingConsent: boolean;
  privacyConsent: boolean;
};

const EMPTY_FORM: FormValues = {
  firstName: "",
  lastName: "",
  contactNumber: "",
  email: "",
  message: "",
  marketingConsent: false,
  privacyConsent: false,
};

/** The API's own caps. A rejected submit also spends a rate-limit slot. */
const MAX_LENGTHS = {
  firstName: 80,
  lastName: 80,
  contactNumber: 32,
  email: 160,
  message: 2000,
} as const;

/** Digits and + ( ) - . space only — the number is stored exactly as typed. */
const PHONE_PATTERN = /^[\d+().\-\s]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The design system's field, written out rather than taken from
 * `components/ui/input.tsx`: that primitive hardcodes `text-xs`, and Tailwind
 * emits `.text-xs` after the project's `--text-*` tokens, so a `text-body`
 * override passed through `className` never wins the cascade.
 */
const FIELD_CLASSES =
  "w-full rounded-sm border border-input bg-transparent px-3.5 text-body text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20";

const LABEL_CLASSES =
  "mb-2 block text-caption font-medium uppercase tracking-label text-muted-foreground";

/** Mirrors the server's rules, so a fumbled form stays out of the rate limit. */
function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  const firstName = values.firstName.trim();
  const lastName = values.lastName.trim();
  const contactNumber = values.contactNumber.trim();
  const email = values.email.trim();
  const digitCount = contactNumber.replace(/\D/g, "").length;

  if (!firstName) {
    errors.firstName = "Enter your first name.";
  } else if (firstName.length > MAX_LENGTHS.firstName) {
    errors.firstName = "Use 80 characters or fewer.";
  }

  if (!lastName) {
    errors.lastName = "Enter your last name.";
  } else if (lastName.length > MAX_LENGTHS.lastName) {
    errors.lastName = "Use 80 characters or fewer.";
  }

  if (!contactNumber) {
    errors.contactNumber = "Enter a number we can reach you on.";
  } else if (
    contactNumber.length > MAX_LENGTHS.contactNumber ||
    !PHONE_PATTERN.test(contactNumber)
  ) {
    errors.contactNumber = "Use digits, spaces and + ( ) - . only.";
  } else if (digitCount < 7 || digitCount > 15) {
    errors.contactNumber = "Enter between 7 and 15 digits.";
  }

  if (!email) {
    errors.email = "Enter your email address.";
  } else if (email.length > MAX_LENGTHS.email || !EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (values.message.trim().length > MAX_LENGTHS.message) {
    errors.message = "Keep your message to 2,000 characters or fewer.";
  }

  if (!values.privacyConsent) {
    errors.privacyConsent = "Tick this box so we can process your inquiry.";
  }

  return errors;
}

/**
 * Server validation messages arrive prefixed with the property name
 * ("email must be an email"), so mapping them back onto controls is a prefix
 * check. Anything matching no field is shown above the button instead.
 */
function mapServerMessages(messages: string[]) {
  const fields: FieldErrors = {};
  const rest: string[] = [];

  for (const message of messages) {
    const field = FIELD_ORDER.find((name) => message.startsWith(`${name} `));
    if (!field) {
      rest.push(message);
    } else if (!fields[field]) {
      fields[field] = message;
    }
  }

  return { fields, rest };
}

/**
 * The alternative to booking a slot: one POST to /leads, then a thank-you
 * panel. A failed submit never clears what the visitor typed.
 */
export function ContactForm() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [alerts, setAlerts] = useState<string[]>([]);
  const [offerDirectContact, setOfferDirectContact] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const inFlight = useRef(false);
  const uid = useId();

  const isSubmitting = status === "submitting";
  const idFor = (name: string) => `${uid}-${name}`;
  const update = (patch: Partial<FormValues>) =>
    setValues((current) => ({ ...current, ...patch }));

  const failWith = (
    fields: FieldErrors,
    messages: string[],
    directContact = false,
  ) => {
    setFieldErrors(fields);
    setAlerts(messages);
    setOfferDirectContact(directContact);
    setStatus("error");

    // The controls are already mounted, so moving focus does not have to wait
    // for the error text to render.
    const firstInvalid = FIELD_ORDER.find((name) => fields[name]);
    if (!firstInvalid) return;
    const control = formRef.current?.elements.namedItem(firstInvalid);
    if (control instanceof HTMLElement) control.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;

    const errors = validate(values);
    if (Object.keys(errors).length > 0) {
      failWith(errors, ["Please check the highlighted fields."]);
      return;
    }

    inFlight.current = true;
    setFieldErrors({});
    setAlerts([]);
    setOfferDirectContact(false);
    setStatus("submitting");

    // Built key by key: the API runs a strict whitelist, so one UI-only
    // property reaching the wire would 400 the whole request.
    const payload: LeadPayload = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      contactNumber: values.contactNumber.trim(),
      message: values.message.trim() || null,
      marketingConsent: values.marketingConsent,
      privacyConsent: true,
    };

    const result = await submitLead(payload);
    inFlight.current = false;

    if (result.ok) {
      setStatus("success");
      return;
    }

    if (result.status === 400) {
      const { fields, rest } = mapServerMessages(result.messages);
      failWith(
        fields,
        rest.length > 0 ? rest : ["Please check the highlighted fields."],
      );
      return;
    }

    // A rate limit and a dropped connection say something a visitor can act
    // on. Every other status is our problem, not theirs, and its wording is
    // written for a developer — so it gets one plain sentence and a human to
    // call instead.
    const ourFault = result.status !== 429 && result.status !== 0;
    failWith(
      {},
      ourFault
        ? ["Something went wrong on our end — your message was not sent."]
        : result.messages,
      result.status !== 429,
    );
  };

  return (
    <section
      aria-labelledby="contact-form-heading"
      className="border-t border-border bg-secondary/40"
    >
      <div className="main-container py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2
              id="contact-form-heading"
              className="font-heading text-h3 font-light text-balance text-foreground"
            >
              Not ready to pick a time? Send us a{" "}
              <span className="italic text-primary">message.</span>
            </h2>
            <p className="mt-6 text-body text-muted-foreground">
              Ask about unit sizes, payment terms, or availability — anything
              you'd like to know before you visit. Leave your details and a
              specialist will take it from there.
            </p>
          </div>

          <div className="lg:col-span-8">
            {status === "success" ? (
              <SuccessPanel />
            ) : (
              <form
                ref={formRef}
                noValidate
                onSubmit={handleSubmit}
                className="rounded-md border border-border bg-card p-6 md:p-10"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <TextField
                    id={idFor("firstName")}
                    name="firstName"
                    label="First name"
                    autoComplete="given-name"
                    value={values.firstName}
                    error={fieldErrors.firstName}
                    disabled={isSubmitting}
                    onChange={(value) => update({ firstName: value })}
                  />
                  <TextField
                    id={idFor("lastName")}
                    name="lastName"
                    label="Last name"
                    autoComplete="family-name"
                    value={values.lastName}
                    error={fieldErrors.lastName}
                    disabled={isSubmitting}
                    onChange={(value) => update({ lastName: value })}
                  />
                  <TextField
                    id={idFor("contactNumber")}
                    name="contactNumber"
                    label="Contact number"
                    type="tel"
                    autoComplete="tel"
                    placeholder="0912 345 6789"
                    value={values.contactNumber}
                    error={fieldErrors.contactNumber}
                    disabled={isSubmitting}
                    onChange={(value) => update({ contactNumber: value })}
                  />
                  <TextField
                    id={idFor("email")}
                    name="email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    error={fieldErrors.email}
                    disabled={isSubmitting}
                    onChange={(value) => update({ email: value })}
                  />
                </div>

                <div className="mt-6">
                  <label htmlFor={idFor("message")} className={LABEL_CLASSES}>
                    Message (optional)
                  </label>
                  <textarea
                    id={idFor("message")}
                    name="message"
                    rows={4}
                    value={values.message}
                    maxLength={MAX_LENGTHS.message}
                    disabled={isSubmitting}
                    placeholder="Tell us what you'd like to know."
                    aria-invalid={fieldErrors.message ? true : undefined}
                    aria-describedby={
                      fieldErrors.message ? idFor("message-error") : undefined
                    }
                    onChange={(event) =>
                      update({ message: event.target.value })
                    }
                    className={cn(FIELD_CLASSES, "min-h-32 resize-y py-3")}
                  />
                  <FieldError
                    id={idFor("message-error")}
                    message={fieldErrors.message}
                  />
                </div>

                <div className="mt-8 space-y-5 border-t border-border pt-8">
                  <ConsentField
                    id={idFor("marketingConsent")}
                    name="marketingConsent"
                    checked={values.marketingConsent}
                    error={fieldErrors.marketingConsent}
                    disabled={isSubmitting}
                    onChange={(checked) =>
                      update({ marketingConsent: checked })
                    }
                  >
                    I consent to receive marketing emails from {SITE.name} and
                    understand that I can unsubscribe at any time.
                  </ConsentField>
                  <ConsentField
                    id={idFor("privacyConsent")}
                    name="privacyConsent"
                    checked={values.privacyConsent}
                    error={fieldErrors.privacyConsent}
                    disabled={isSubmitting}
                    onChange={(checked) => update({ privacyConsent: checked })}
                  >
                    By clicking, you consent to the collection and processing of
                    the personal data necessary to address your query. These
                    data are protected under the Data Privacy Act.
                  </ConsentField>
                </div>

                {alerts.length > 0 && (
                  <div
                    role="alert"
                    className="mt-8 rounded-sm border border-destructive/30 bg-destructive/5 px-4 py-3.5"
                  >
                    <ul className="space-y-1 text-small text-destructive">
                      {alerts.map((message) => (
                        <li key={message}>{message}</li>
                      ))}
                    </ul>
                    {offerDirectContact && (
                      <p className="mt-2 text-small text-muted-foreground">
                        You can also call{" "}
                        <a
                          href={CONTACT.phoneHref}
                          className="underline underline-offset-2 hover:text-foreground"
                        >
                          {CONTACT.phone}
                        </a>{" "}
                        or email{" "}
                        <a
                          href={CONTACT.emailHref}
                          className="underline underline-offset-2 hover:text-foreground"
                        >
                          {CONTACT.email}
                        </a>
                        .
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={!values.privacyConsent}
                    aria-disabled={isSubmitting || undefined}
                    aria-describedby={
                      values.privacyConsent ? undefined : idFor("submit-hint")
                    }
                    className={cn(
                      ctaVariants({ variant: "solid" }),
                      "disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          aria-hidden
                          className="size-4 motion-safe:animate-spin"
                        />
                        Sending…
                      </>
                    ) : (
                      "Send message"
                    )}
                  </button>
                  {!values.privacyConsent && (
                    <p
                      id={idFor("submit-hint")}
                      className="text-small text-muted-foreground"
                    >
                      Tick the privacy box above to send your message.
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TextField({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  value,
  error,
  disabled,
  onChange,
}: {
  id: string;
  name: TextFieldName;
  label: string;
  type?: "text" | "tel" | "email";
  autoComplete: string;
  placeholder?: string;
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        required
        maxLength={MAX_LENGTHS[name]}
        autoComplete={autoComplete}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(FIELD_CLASSES, "h-12")}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

/**
 * Both consents ship unticked, always. A box that arrives already ticked
 * records the developer's action rather than the visitor's, so it is not
 * consent under the Data Privacy Act.
 */
function ConsentField({
  id,
  name,
  checked,
  error,
  disabled,
  onChange,
  children,
}: {
  id: string;
  name: FieldName;
  checked: boolean;
  error?: string;
  disabled: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="flex items-start gap-3.5">
        <span className="relative flex shrink-0">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => onChange(event.target.checked)}
            className="peer size-6 appearance-none rounded-sm border border-input bg-background transition-colors checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
          />
          <Check
            aria-hidden
            className="pointer-events-none absolute inset-0 m-auto size-4 text-primary-foreground opacity-0 peer-checked:opacity-100"
          />
        </span>
        {/* Capped to the system's 65–75 character measure instead of running
            the full card width, and balanced so the last line is never a
            stray word. `ch` is the width of a digit, which is far wider than
            Albert Sans' average glyph — 55ch lands at ~70 characters. */}
        <span className="max-w-[55ch] text-small text-balance text-muted-foreground">
          {children}
        </span>
      </label>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} className="mt-2 text-caption text-destructive">
      {message}
    </p>
  );
}

/**
 * Replaces the form rather than resetting it — a form that empties itself reads
 * as "it did nothing". Nobody is alerted when a lead arrives, so the copy
 * promises no reply window and routes anyone impatient to a real person.
 */
function SuccessPanel() {
  return (
    <div className="rounded-md border border-border bg-card p-6 md:p-10">
      <span className="inline-flex size-11 items-center justify-center rounded-sm bg-secondary text-primary">
        <Check className="size-5" aria-hidden />
      </span>
      <h3
        ref={(node) => {
          node?.focus();
        }}
        tabIndex={-1}
        className="mt-6 font-heading text-h4 font-normal text-foreground focus:outline-none"
      >
        Thank you — your message is with our team.
      </h3>
      <p className="mt-3 max-w-[52ch] text-body text-muted-foreground">
        A specialist will follow up using the details you left. We're at the
        showroom {CONTACT.hours}, so if you'd rather not wait, reach{" "}
        {CONTACT.contactName} directly.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <CtaLink href={CONTACT.phoneHref} variant="solid" arrow={false}>
          <Phone className="size-4" />
          {CONTACT.phone}
        </CtaLink>
        <CtaLink href={CONTACT.emailHref} variant="outline" arrow={false}>
          <Mail className="size-4" />
          Email us
        </CtaLink>
      </div>
      <p className="mt-8 border-t border-border pt-6 text-small text-muted-foreground">
        Ready to see it in person? Pick a time on the calendar above.
      </p>
    </div>
  );
}
