"use client";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { furniture } from "@/config/furniture";
import { factoryVisitInterests } from "../validation/furniture";
import {
  submitFactoryVisit,
  submitFurnitureEnquiry,
  submitFurnitureOutlet,
} from "../actions/submit";
const furnitureFormInitialState = { ok: false, message: "" };
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[color:var(--foreground-light)]">
      <span>{label}</span>
      {children}
    </label>
  );
}
function Honey() {
  const [startedAt] = useState(() => new Date().getTime());
  return (
    <>
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />
      <input type="hidden" name="started_at" value={startedAt} />
    </>
  );
}
function Submit({
  pending,
  children,
}: {
  pending: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button disabled={pending} type="submit">
      {pending ? "Sending…" : children}
    </Button>
  );
}
export function FurnitureDesignForm() {
  const [state, action, pending] = useActionState(
    submitFurnitureEnquiry,
    furnitureFormInitialState,
  );
  const [front, setFront] = useState<string>(furniture.demoColours[0].name);
  const [body, setBody] = useState<string>(furniture.demoColours[2].name);
  return (
    <form action={action} className="grid gap-6">
      <Honey />
      <fieldset className="grid gap-3">
        <legend className="font-display text-3xl">1. Choose furniture</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "Kitchen",
            "Wardrobe",
            "Bedroom",
            "TV Unit",
            "Living Room",
            "Study Furniture",
            "Other",
          ].map((item) => (
            <label
              key={item}
              className="flex min-h-11 items-center gap-3 border border-[color:var(--border-dark)] px-4"
            >
              <input
                type="radio"
                name="furniture_type"
                value={item}
                defaultChecked={item === "Wardrobe"}
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="Requirement type">
        <select
          name="requirement_type"
          className="min-h-11 border border-[color:var(--border-dark)] bg-transparent px-3"
        >
          <option>New furniture</option>
          <option>Replacement</option>
          <option>Renovation / customization</option>
        </select>
      </Field>
      <fieldset className="grid gap-4">
        <legend className="font-display text-3xl">2. Colours & finishes</legend>
        <ColourGroup
          label="Front / door colour"
          value={front}
          onChange={setFront}
          name="front_colour_name"
        />
        <ColourGroup
          label="Body / side colour"
          value={body}
          onChange={setBody}
          name="body_colour_name"
        />
        <div
          className="grid min-h-40 place-items-center border border-[color:var(--border-gold)] bg-[color:var(--surface-dark)]"
          aria-label={`Wardrobe preview: ${front} front and ${body} body`}
        >
          <div className="grid h-28 w-48 grid-cols-[2fr_1fr] border-4 border-[#1c1d19]">
            <div
              style={{
                backgroundColor: furniture.demoColours.find(
                  (c) => c.name === front,
                )?.hex,
              }}
            />
            <div
              style={{
                backgroundColor: furniture.demoColours.find(
                  (c) => c.name === body,
                )?.hex,
              }}
            />
          </div>
          <p className="sr-only">Preview uses selected finish names</p>
        </div>
        <Field label="Finish preference">
          <Input
            name="finish_preference"
            placeholder="Optional finish preference"
          />
        </Field>
      </fieldset>
      <fieldset className="grid gap-4">
        <legend className="font-display text-3xl">3. Approximate size</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Width (mm)">
            <Input name="width" type="number" min="1" />
          </Field>
          <Field label="Height (mm)">
            <Input name="height" type="number" min="1" />
          </Field>
          <Field label="Depth (mm)">
            <Input name="depth" type="number" min="1" />
          </Field>
        </div>
        <Field label="Dimensions note">
          <Input
            name="dimensions_note"
            placeholder="Optional approximate dimensions"
          />
        </Field>
      </fieldset>
      <fieldset className="grid gap-4">
        <legend className="font-display text-3xl">4. Your details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <Input required name="name" />
          </Field>
          <Field label="Phone">
            <Input required name="phone" inputMode="tel" />
          </Field>
          <Field label="Email">
            <Input name="email" type="email" />
          </Field>
          <Field label="Location">
            <Input required name="location" />
          </Field>
          <Field label="District">
            <Input name="district" />
          </Field>
        </div>
        <Field label="Tell us about your requirement">
          <Textarea name="message" rows={4} />
        </Field>
      </fieldset>
      {state.message && (
        <p
          role="status"
          className={state.ok ? "text-green-300" : "text-red-300"}
        >
          {state.message}
        </p>
      )}
      <Submit pending={pending}>Send furniture requirement</Submit>
    </form>
  );
}
function ColourGroup({
  label,
  value,
  onChange,
  name,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  name: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">
        {label}: <span className="text-[color:var(--gold)]">{value}</span>
      </legend>
      <input type="hidden" name={name} value={value} />
      <div className="mt-3 flex flex-wrap gap-3">
        {furniture.demoColours.map((colour) => (
          <button
            type="button"
            key={colour.name}
            onClick={() => onChange(colour.name)}
            aria-pressed={value === colour.name}
            className={`min-h-11 border px-3 text-xs font-bold tracking-[.08em] uppercase ${value === colour.name ? "border-[color:var(--gold)]" : "border-[color:var(--border-dark)]"}`}
          >
            <span
              className="mr-2 inline-block size-4 align-middle"
              style={{ backgroundColor: colour.hex }}
            />
            {colour.name}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
export function FactoryVisitForm() {
  const [state, action, pending] = useActionState(
    submitFactoryVisit,
    furnitureFormInitialState,
  );
  return (
    <form action={action} className="grid gap-4">
      <Honey />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <Input required name="name" />
        </Field>
        <Field label="Phone">
          <Input required name="phone" inputMode="tel" />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" />
        </Field>
        <Field label="Location">
          <Input required name="location" />
        </Field>
        <Field label="Preferred date">
          <Input
            name="preferred_date"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
          />
        </Field>
        <Field label="Furniture interest">
          <select
            required
            name="furniture_interest"
            className="min-h-11 border border-[color:var(--border-dark)] bg-transparent px-3"
          >
            {factoryVisitInterests.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Message">
        <Textarea name="message" rows={4} />
      </Field>
      {state.message && (
        <p
          role="status"
          className={state.ok ? "text-green-300" : "text-red-300"}
        >
          {state.message}
        </p>
      )}
      <Submit pending={pending}>Request factory visit</Submit>
    </form>
  );
}
export function FurnitureOutletForm() {
  const [state, action, pending] = useActionState(
    submitFurnitureOutlet,
    furnitureFormInitialState,
  );
  return (
    <form action={action} className="grid gap-4">
      <Honey />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <Input required name="person_name" />
        </Field>
        <Field label="Showroom / business name">
          <Input name="showroom_name" />
        </Field>
        <Field label="Phone">
          <Input required name="phone" inputMode="tel" />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" />
        </Field>
        <Field label="Location">
          <Input required name="location" />
        </Field>
        <Field label="District">
          <Input name="district" />
        </Field>
        <Field label="Showroom size (sq. ft.)">
          <Input name="showroom_size_sqft" type="number" min="1" />
        </Field>
      </div>
      <Field label="Message">
        <Textarea name="message" rows={4} />
      </Field>
      {state.message && (
        <p
          role="status"
          className={state.ok ? "text-green-300" : "text-red-300"}
        >
          {state.message}
        </p>
      )}
      <Submit pending={pending}>Send outlet enquiry</Submit>
    </form>
  );
}
