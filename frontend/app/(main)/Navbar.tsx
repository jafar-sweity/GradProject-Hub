import React from "react";
import Link from "next/link";
import UserButton from "../../components/UserButton";
import SearchField from "../../components/SearchField";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-primary">
          GradPoject-hub
        </Link>
        <SearchField />

        <UserButton calssName="sm:ms-auto" />
      </div>
    </header>
  );
}
