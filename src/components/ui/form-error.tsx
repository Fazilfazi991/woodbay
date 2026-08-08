export function FormError({ message }: { message?: string }) { return message ? <p role="alert" className="mt-1 text-sm text-[color:var(--destructive)]">{message}</p> : null; }
