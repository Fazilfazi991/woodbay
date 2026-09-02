"use client";
import { useActionState } from "react";
import { login, type LoginState } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
const initial: LoginState = { ok: true, message: "" };
export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(login, initial);
  return (
    <main className="admin-login-page grid place-items-center">
      <Card className="admin-login-card">
        <div className="admin-login-brand">
          <span aria-hidden="true" />
          <div>
            <strong>WOODBAY</strong>
            <small>CONTROL PANEL</small>
          </div>
        </div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-[#69665f]">
          Sign in to manage catalogue and operations.
        </p>
        <form action={action} className="mt-7 space-y-5">
          <label className="block">
            Email
            <Input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2"
            />
          </label>
          <label className="block">
            Password
            <Input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2"
            />
          </label>
          <FormError message={state.ok ? undefined : state.message} />
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
