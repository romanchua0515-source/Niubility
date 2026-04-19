"use client";

import type { AdminCategoryListItem } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import { SubcategoryForm } from "@/components/admin/subcategory-form";

type CategoriesManagerProps = {
  initialCategories: AdminCategoryListItem[];
};

type ModalState =
  | { kind: "closed" }
  | { kind: "add-category" }
  | { kind: "edit-category"; row: AdminCategoryListItem }
  | { kind: "add-subcategory"; row: AdminCategoryListItem };

function ModalCloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>({ kind: "closed" });
  const [rows, setRows] = useState(initialCategories);

  useEffect(() => {
    setRows(initialCategories);
  }, [initialCategories]);

  function closeModal() {
    setModal({ kind: "closed" });
  }

  function afterMutation() {
    closeModal();
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() => setModal({ kind: "add-category" })}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-emerald-500/70 bg-emerald-500/90 px-3 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-400"
        >
          Add New Category
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800/60">
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,0.7fr)_auto] gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
          <div>Title (EN)</div>
          <div>Title (ZH)</div>
          <div>Slug</div>
          <div className="text-right">Subs</div>
          <div className="text-right">Actions</div>
        </div>
        {rows.length === 0 ? (
          <p className="px-4 py-4 text-sm text-zinc-500">
            No categories yet. Use “Add New Category” to create the first hub.
          </p>
        ) : (
          <div className="divide-y divide-zinc-800/80 text-sm">
            {rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,0.7fr)_auto] items-center gap-2 px-4 py-2.5 hover:bg-zinc-900/60"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-zinc-100">{row.title}</p>
                </div>
                <div className="min-w-0 truncate text-zinc-400">
                  {row.title_zh?.trim() ? row.title_zh : "—"}
                </div>
                <div className="min-w-0 truncate font-mono text-xs text-zinc-500">
                  {row.slug}
                </div>
                <div className="text-right text-xs tabular-nums text-zinc-400">
                  {row.subcategoryCount}
                </div>
                <div className="flex flex-wrap justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setModal({ kind: "edit-category", row })}
                    className="rounded-md border border-zinc-700 bg-zinc-950/80 px-2 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal({ kind: "add-subcategory", row })}
                    className="rounded-md border border-zinc-700 bg-zinc-950/80 px-2 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                  >
                    + Sub
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
          </div>
        </div>
      </div>

      {modal.kind === "add-category" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6">
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/50 px-6 py-4">
              <h2 className="text-lg font-semibold text-zinc-100">
                Add New Category
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                aria-label="Close"
              >
                <ModalCloseIcon />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <CategoryForm variant="create" onSuccess={afterMutation} />
            </div>
          </div>
        </div>
      )}

      {modal.kind === "edit-category" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6">
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/50 px-6 py-4">
              <h2 className="text-lg font-semibold text-zinc-100">
                Edit Category
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                aria-label="Close"
              >
                <ModalCloseIcon />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <CategoryForm
                key={modal.row.id}
                variant="edit"
                categoryId={modal.row.id}
                defaultValues={{
                  title: modal.row.title,
                  title_zh: modal.row.title_zh ?? "",
                  slug: modal.row.slug,
                  cover_image: modal.row.cover_image,
                }}
                onSuccess={afterMutation}
              />
            </div>
          </div>
        </div>
      )}

      {modal.kind === "add-subcategory" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6">
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/50 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">
                  Add Subcategory
                </h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Under <span className="text-zinc-300">{modal.row.title}</span>{" "}
                  <span className="font-mono text-zinc-500">({modal.row.slug})</span>
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                aria-label="Close"
              >
                <ModalCloseIcon />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <SubcategoryForm
                key={modal.row.id}
                categoryId={modal.row.id}
                onSuccess={afterMutation}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
