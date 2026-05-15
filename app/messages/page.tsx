import type { Metadata } from "next";
import Link from "next/link";
import { MessagesBoard } from "./messages-board";
import { MessagesForm } from "./messages-content";
import { listPublicMessagesNewestFirst } from "@/lib/anonymous-messages-store";
import { site } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Anonymous messages",
  description: `Public anonymous board · ${site.name}.`,
};

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await listPublicMessagesNewestFirst();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 pb-14 sm:px-6">
      <p className="text-sm font-medium text-mkp-blue">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        / Messages
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-mkp-ink">
        Anonymous messages
      </h1>
      <p className="mt-3 max-w-2xl text-mkp-muted">
        Post without your name — everyone in the community can read what you
        write.
      </p>

      <div className="mt-10 space-y-10">
        <MessagesBoard messages={messages} />
        <MessagesForm />
      </div>
    </main>
  );
}
