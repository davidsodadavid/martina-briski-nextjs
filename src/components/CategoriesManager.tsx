"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import {
  createCategory,
  renameCategory,
  deleteCategory,
  type CategoryFormState,
} from "@/app/actions/categories";

type CategoryItem = { id: string; label: string; postCount: number };

const initialState: CategoryFormState = {};

export default function CategoriesManager({
  categories,
}: {
  categories: CategoryItem[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <NewCategoryForm />
      <ul className="flex flex-col gap-3">
        {categories.map((c) => (
          <CategoryRow key={c.id} category={c} />
        ))}
      </ul>
      {categories.length === 0 && (
        <p className="text-neutral-200">No categories yet.</p>
      )}
    </div>
  );
}

function NewCategoryForm() {
  const [state, formAction, pending] = useActionState(
    createCategory,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex items-start gap-3 rounded-md bg-[var(--color-stone)] p-4"
    >
      <div className="flex-1">
        <input
          type="text"
          name="label"
          placeholder="New category name"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
        {state.error && (
          <p className="mt-1 text-sm text-red-600">{state.error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-[var(--brand-yellow)] px-4 py-2 text-sm font-medium text-[var(--brand-text)] hover:bg-[var(--brand-yellow-dark)] disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add category"}
      </button>
    </form>
  );
}

function CategoryRow({ category }: { category: CategoryItem }) {
  const boundRename = renameCategory.bind(null, category.id);
  const [state, formAction, pending] = useActionState(
    boundRename,
    initialState
  );
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDelete() {
    const warning =
      category.postCount > 0
        ? `Delete "${category.label}"? ${category.postCount} post(s) using it will become uncategorized.`
        : `Delete "${category.label}"?`;
    if (!confirm(warning)) return;
    startDeleteTransition(() => deleteCategory(category.id));
  }

  return (
    <li className="flex items-center gap-3 rounded-md border border-neutral-200 bg-[var(--color-stone)] p-4">
      <form action={formAction} className="flex flex-1 items-start gap-3">
        <div className="flex-1">
          <input
            type="text"
            name="label"
            defaultValue={category.label}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />
          {state.error && (
            <p className="mt-1 text-sm text-red-600">{state.error}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md border border-neutral-600 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </form>
      <span className="text-xs text-neutral-400">
        {category.postCount} post{category.postCount === 1 ? "" : "s"}
      </span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        {isDeleting ? "Deleting…" : "Delete"}
      </button>
    </li>
  );
}
