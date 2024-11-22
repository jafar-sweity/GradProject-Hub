"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

export default function SearchField() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    // Safely access the input
    const input = form.querySelector<HTMLInputElement>('input[name="q"]');
    if (!input) {
      console.error("Search input not found");
      return;
    }

    const q = input.value.trim();
    if (!q) return;

    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <Input name="q" placeholder="Search" className="pe-10" />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        >
          <SearchIcon className="size-5" />
        </button>
      </div>
    </form>
  );
}
