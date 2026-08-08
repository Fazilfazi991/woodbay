"use client";
import { useActionState } from "react";
import { login, type LoginState } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
const initial: LoginState = { ok: true, message: "" };
export default function AdminLoginPage() { const [state, action, pending] = useActionState(login, initial); return <main className="grid min-h-screen place-items-center p-6"><Card className="w-full max-w-md"><h1 className="text-2xl font-semibold">WOODBAY Admin</h1><p className="mt-2 text-sm text-[color:var(--muted)]">Sign in with an active administrator account.</p><form action={action} className="mt-6 space-y-4"><label className="block text-sm font-medium">Email<Input name="email" type="email" autoComplete="email" required className="mt-1" /></label><label className="block text-sm font-medium">Password<Input name="password" type="password" autoComplete="current-password" required className="mt-1" /></label><FormError message={state.ok ? undefined : state.message} /><Button type="submit" disabled={pending} className="w-full">{pending ? "Signing in…" : "Sign in"}</Button></form></Card></main>; }
