"use server";

import { revalidatePath } from "next/cache";
import { MAX_ANONYMOUS_BODY_LENGTH } from "@/lib/anonymous-messages-constants";
import { addAnonymousMessage } from "@/lib/anonymous-messages-store";

export type SubmitMessageState =
  | { ok: true; message?: string }
  | { ok: false; error: string };

export async function submitAnonymousMessage(
  _prev: SubmitMessageState | undefined,
  formData: FormData,
): Promise<SubmitMessageState> {
  const body = String(formData.get("body") ?? "");
  const trimmed = body.trim();
  if (!trimmed) {
    return { ok: false, error: "Write something before sending." };
  }
  if (trimmed.length > MAX_ANONYMOUS_BODY_LENGTH) {
    return {
      ok: false,
      error: `Keep it under ${MAX_ANONYMOUS_BODY_LENGTH} characters (currently ${trimmed.length}).`,
    };
  }

  try {
    await addAnonymousMessage(body);
    revalidatePath("/messages");
    return {
      ok: true,
      message: "Posted. Everyone can see it on this page.",
    };
  } catch {
    return { ok: false, error: "Could not save your message. Try again later." };
  }
}
