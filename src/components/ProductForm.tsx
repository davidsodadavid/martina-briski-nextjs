"use client";

import { useActionState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import ThumbnailPicker from "@/components/ThumbnailPicker";
import GalleryPicker from "@/components/GalleryPicker";
import type { ProductFormState } from "@/app/actions/products";

type MediaItem = { id: string; url: string; filename: string };

type ProductFormProps = {
  action: (
    state: ProductFormState,
    formData: FormData
  ) => Promise<ProductFormState>;
  submitLabel: string;
  initialProduct?: {
    name: string;
    thumbnail: string | null;
    gallery: string[];
    description: string;
    price: number;
    discountPrice: number | null;
  };
  mediaLibrary: MediaItem[];
};

export default function ProductForm({
  action,
  submitLabel,
  initialProduct,
  mediaLibrary,
}: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-md bg-[var(--color-stone)] p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Name
        </label>
        <input
          type="text"
          name="name"
          required
          defaultValue={initialProduct?.name}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Thumbnail
        </label>
        <ThumbnailPicker
          name="thumbnail"
          initialUrl={initialProduct?.thumbnail}
          mediaLibrary={mediaLibrary}
        />
      </div>

      <div className="flex gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            required
            defaultValue={initialProduct?.price}
            className="w-32 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Discount price (optional)
          </label>
          <input
            type="number"
            name="discountPrice"
            step="0.01"
            min="0"
            defaultValue={initialProduct?.discountPrice ?? ""}
            className="w-32 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Gallery (optional)
        </label>
        <GalleryPicker
          name="gallery"
          initialUrls={initialProduct?.gallery ?? []}
          mediaLibrary={mediaLibrary}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Description
        </label>
        <RichTextEditor
          name="description"
          initialContent={initialProduct?.description}
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-[var(--brand-yellow)] px-5 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)] disabled:opacity-50"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
