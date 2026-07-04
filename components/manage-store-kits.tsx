"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ChevronUp, Pencil, Trash2 } from "lucide-react";
import { deleteStoreKit, updateStoreKit, type CommandState } from "@/app/admin-katta/actions";
import { cn } from "@/lib/utils";

const initialState: CommandState = { status: "idle", message: "" };

type StoreKitRow = {
  id: string;
  product_slug: string;
  title: string;
  category: string;
  summary: string | null;
  mrp: number | null;
  selling_price: number;
  stock_status: boolean;
  image_gallery: string[] | null;
  technical_specs: Record<string, string> | null;
  whats_in_box: string | null;
  warranty_info: string | null;
  return_policy: string | null;
  weight_grams: number | null;
  package_length_cm: number | null;
  package_width_cm: number | null;
  package_height_cm: number | null;
  availability_status: string;
};

function specsToLines(specs: Record<string, string> | null) {
  if (!specs) return "";
  return Object.entries(specs)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-black text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

function EditKitForm({ kit, onClose }: { kit: StoreKitRow; onClose: () => void }) {
  const [state, formAction] = useActionState(updateStoreKit, initialState);

  return (
    <form action={formAction} className="mt-3 grid gap-3 rounded-lg border border-zinc-200 bg-white p-3">
      <input type="hidden" name="id" value={kit.id} />
      <input type="hidden" name="existing_image_gallery" value={(kit.image_gallery ?? []).join("\n")} />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-wide text-zinc-500">Title</span>
          <input
            name="title"
            defaultValue={kit.title}
            required
            className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs font-bold"
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-wide text-zinc-500">Slug</span>
          <input
            name="product_slug"
            defaultValue={kit.product_slug}
            className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs font-bold"
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-wide text-zinc-500">Category</span>
          <select
            name="category"
            defaultValue={kit.category}
            className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs font-bold"
          >
            {["Robotics Kits", "Embedded Systems", "Electronics DIY", "IoT Automation"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-wide text-zinc-500">Availability</span>
          <select
            name="availability_status"
            defaultValue={kit.availability_status}
            className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs font-bold"
          >
            <option value="available">Available</option>
            <option value="coming_soon">Coming Soon</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </label>
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-wide text-zinc-500">MRP</span>
          <input
            name="mrp"
            type="number"
            defaultValue={kit.mrp ?? ""}
            className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs font-bold"
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-wide text-zinc-500">Selling Price</span>
          <input
            name="selling_price"
            type="number"
            defaultValue={kit.selling_price}
            required
            className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs font-bold"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-[10px] font-black uppercase tracking-wide text-zinc-500">Summary</span>
        <textarea
          name="summary"
          defaultValue={kit.summary ?? ""}
          rows={2}
          className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs font-bold"
        />
      </label>

      <label className="block">
        <span className="text-[10px] font-black uppercase tracking-wide text-zinc-500">
          Replace Primary Image (leave empty to keep current)
        </span>
        <input
          name="image_file"
          type="file"
          accept="image/*"
          className="mt-1 block w-full text-xs font-bold file:mr-2 file:rounded-md file:border-0 file:bg-zinc-950 file:px-2 file:py-1 file:text-xs file:font-black file:text-white"
        />
      </label>
      <label className="block">
        <span className="text-[10px] font-black uppercase tracking-wide text-zinc-500">Image URLs (one per line)</span>
        <textarea
          name="image_gallery"
          defaultValue={(kit.image_gallery ?? []).join("\n")}
          rows={2}
          className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs font-bold"
        />
      </label>

      <label className="block">
        <span className="text-[10px] font-black uppercase tracking-wide text-zinc-500">Technical Specs (key: value per line)</span>
        <textarea
          name="technical_specs"
          defaultValue={specsToLines(kit.technical_specs)}
          rows={4}
          className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs font-bold"
        />
      </label>

      <label className="block">
        <span className="text-[10px] font-black uppercase tracking-wide text-zinc-500">What&apos;s in the Box (one per line)</span>
        <textarea
          name="whats_in_box"
          defaultValue={kit.whats_in_box ?? ""}
          rows={3}
          className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs font-bold"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-wide text-zinc-500">Warranty Info</span>
          <textarea
            name="warranty_info"
            defaultValue={kit.warranty_info ?? ""}
            rows={2}
            className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs font-bold"
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-wide text-zinc-500">Return Policy</span>
          <textarea
            name="return_policy"
            defaultValue={kit.return_policy ?? ""}
            rows={2}
            className="mt-1 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs font-bold"
          />
        </label>
      </div>

      <div>
        <p className="text-[10px] font-black uppercase tracking-wide text-zinc-500">Weight &amp; Dimensions</p>
        <div className="mt-1 grid grid-cols-4 gap-2">
          <input
            name="weight_grams"
            type="number"
            defaultValue={kit.weight_grams ?? ""}
            placeholder="grams"
            className="h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs font-bold"
          />
          <input
            name="package_length_cm"
            type="number"
            defaultValue={kit.package_length_cm ?? ""}
            placeholder="L cm"
            className="h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs font-bold"
          />
          <input
            name="package_width_cm"
            type="number"
            defaultValue={kit.package_width_cm ?? ""}
            placeholder="W cm"
            className="h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs font-bold"
          />
          <input
            name="package_height_cm"
            type="number"
            defaultValue={kit.package_height_cm ?? ""}
            placeholder="H cm"
            className="h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs font-bold"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs font-bold text-zinc-700">
        <input name="stock_status" type="checkbox" defaultChecked={kit.stock_status} className="h-4 w-4 rounded border-zinc-300" />
        In stock
      </label>

      <div className="flex items-center justify-between gap-3 border-t border-zinc-200 pt-3">
        <p
          className={cn(
            "text-xs font-bold",
            state.status === "success" && "text-emerald-700",
            state.status === "error" && "text-red-600"
          )}
        >
          {state.message}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-zinc-200 bg-white px-4 text-sm font-black text-zinc-700"
          >
            Close
          </button>
          <SaveButton />
        </div>
      </div>
    </form>
  );
}

export function ManageStoreKits({ kits }: { kits: StoreKitRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm space-y-3">
      <h3 className="font-bold text-zinc-700 border-b pb-2 text-xs uppercase tracking-wider flex justify-between">
        <span>Store Kits</span>
        <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full text-[10px]">{kits.length}</span>
      </h3>
      <div className="max-h-[32rem] overflow-y-auto space-y-2 pr-1">
        {kits.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">No kits uploaded yet.</p>
        ) : (
          kits.map((kit) => {
            const isEditing = editingId === kit.id;
            return (
              <div key={kit.id} className="rounded-lg border border-zinc-100 bg-zinc-50">
                <div className="flex items-center justify-between p-2.5 text-xs hover:bg-zinc-100/50 transition">
                  <div className="truncate mr-2">
                    <p className="font-bold text-zinc-800 truncate">{kit.title}</p>
                    <p className="text-[10px] text-zinc-400 truncate">
                      slug: {kit.product_slug} · ₹{kit.selling_price} ·{" "}
                      {kit.availability_status === "available"
                        ? "Available"
                        : kit.availability_status === "coming_soon"
                          ? "Coming Soon"
                          : "Out of Stock"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingId(isEditing ? null : kit.id)}
                      className="text-zinc-500 hover:text-zinc-900 p-1.5 rounded-md hover:bg-zinc-200 transition"
                      title="Edit kit"
                    >
                      {isEditing ? <ChevronUp className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                    </button>
                    <form action={deleteStoreKit}>
                      <input type="hidden" name="id" value={kit.id} />
                      <button
                        type="submit"
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-md hover:bg-red-50 transition"
                        title="Delete kit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
                {isEditing && (
                  <div className="px-2.5 pb-2.5">
                    <EditKitForm kit={kit} onClose={() => setEditingId(null)} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
