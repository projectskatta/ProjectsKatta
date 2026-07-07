"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { addAddress, deleteAddress, type Address, type DashboardState } from "@/app/actions/dashboard";

const initialState: DashboardState = { status: "idle", message: "" };

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-black text-white disabled:opacity-60"
    >
      {pending ? "Saving..." : "Save Address"}
    </button>
  );
}

function AddAddressForm({ onDone }: { onDone: () => void }) {
  const [state, formAction] = useActionState(addAddress, initialState);

  return (
    <form action={formAction} className="grid gap-3 rounded-2xl border border-zinc-200 bg-white/70 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="full_name" placeholder="Full name" required className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm" />
        <input name="phone" placeholder="Phone number" required className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm" />
      </div>
      <input
        name="street_address"
        placeholder="House no, street, area"
        required
        className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm"
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <input name="city" placeholder="City" required className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm" />
        <input name="state" placeholder="State" required className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm" />
        <input name="pincode" placeholder="Pincode" required className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm" />
      </div>
      <label className="flex items-center gap-2 text-xs font-bold text-zinc-600">
        <input name="is_default" type="checkbox" className="h-3.5 w-3.5" />
        Make this my default address
      </label>
      <div className="flex items-center justify-between gap-3 border-t border-zinc-200 pt-3">
        <p className={`text-xs font-bold ${state.status === "error" ? "text-red-600" : "text-emerald-700"}`}>
          {state.message}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={onDone} className="h-10 rounded-full border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-700">
            Cancel
          </button>
          <AddButton />
        </div>
      </div>
    </form>
  );
}

export function DashboardAddresses({ addresses }: { addresses: Address[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="pk-glass flex-1 rounded-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-black text-zinc-950">Saved Addresses</h3>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 text-sm font-black text-blue-600"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add New
          </button>
        )}
      </div>

      {adding && <AddAddressForm onDone={() => setAdding(false)} />}

      <div className="mt-3 grid gap-3">
        {addresses.length === 0 && !adding && (
          <p className="rounded-xl bg-white/50 p-4 text-sm text-zinc-500">No addresses saved yet.</p>
        )}
        {addresses.map((address) => (
          <div key={address.id} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-white/60 p-4">
            <div className="min-w-0">
              {address.isDefault && (
                <span className="mb-1.5 inline-block rounded bg-zinc-200 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-zinc-600">
                  Default
                </span>
              )}
              <p className="flex items-start gap-2 text-sm font-semibold text-zinc-700">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                {address.streetAddress}, {address.city}, {address.state} - {address.pincode}
              </p>
              <p className="ml-6 text-xs text-zinc-500">
                {address.fullName} · {address.phone}
              </p>
            </div>
            <form action={deleteAddress}>
              <input type="hidden" name="id" value={address.id} />
              <button type="submit" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-red-400 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
