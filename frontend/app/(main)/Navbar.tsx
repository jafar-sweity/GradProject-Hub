import React from "react";
import Link from "next/link";
import UserButton from "../../components/UserButton";
import SearchField from "../../components/SearchField";
import AIChatButton from "@/components/AIChatButton";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-primary">
          GradPoject-hub
        </Link>
        <div className="flex flex-1 justify-center sm:justify-start">
          <SearchField />
        </div>
        <div className="flex items-center gap-5">
          <AIChatButton />
          <UserButton calssName="sm:ms-auto" />
        </div>
      </div>
    </header>
  );
}
