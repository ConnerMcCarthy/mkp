"use server";

import { revalidatePath } from "next/cache";
import {
  claimKing,
  releaseKing,
  upsertRsvp,
  type IntentStatus,
} from "@/lib/intentions-store";

export type FormState =
  | { ok: true; message?: string }
  | { ok: false; error: string };

export async function submitIntention(
  _prev: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const weekKey = String(formData.get("weekKey") ?? "");
  const name = String(formData.get("name") ?? "");
  const status = String(formData.get("status") ?? "") as IntentStatus;

  if (status !== "yes" && status !== "no") {
    return { ok: false, error: "Choose whether you’re planning to attend." };
  }

  try {
    await upsertRsvp(weekKey, name, status);
    revalidatePath("/schedule");
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Couldn’t save your response. Check your name and try again.",
    };
  }
}

export async function submitKingClaim(
  _prev: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const weekKey = String(formData.get("weekKey") ?? "");
  const name = String(formData.get("name") ?? "");
  const result = await claimKing(weekKey, name);
  if (!result.ok) {
    return { ok: false, error: result.error };
  }
  revalidatePath("/schedule");
  return { ok: true };
}

export async function submitKingRelease(
  _prev: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const weekKey = String(formData.get("weekKey") ?? "");
  const secret = String(formData.get("secret") ?? "");
  const ok = await releaseKing(weekKey, secret);
  revalidatePath("/schedule");
  if (!ok) {
    return {
      ok: false,
      error: "Steward password didn’t match or this week has no King to clear.",
    };
  }
  return { ok: true, message: "King slot cleared for that week." };
}
