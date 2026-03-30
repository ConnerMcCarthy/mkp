"use server";

import { revalidatePath } from "next/cache";
import { MAX_WEEK_DESCRIPTION_LENGTH } from "@/lib/intentions-constants";
import {
  claimKing,
  releaseKing,
  setWeekDescription,
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
    revalidatePath("/");
    revalidatePath("/attendance");
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
  revalidatePath("/king");
  revalidatePath("/");
  revalidatePath("/attendance");
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
  revalidatePath("/king");
  revalidatePath("/");
  revalidatePath("/attendance");
  if (!ok) {
    return {
      ok: false,
      error: "Steward password didn’t match or this week has no King to clear.",
    };
  }
  return { ok: true, message: "King slot cleared for that week." };
}

export async function submitWeekDescription(
  _prev: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const weekKey = String(formData.get("weekKey") ?? "");
  const description = String(formData.get("description") ?? "");
  const trimmed = description.trim();

  if (trimmed.length > MAX_WEEK_DESCRIPTION_LENGTH) {
    return {
      ok: false,
      error: `Keep the note under ${MAX_WEEK_DESCRIPTION_LENGTH} characters.`,
    };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekKey)) {
    return { ok: false, error: "Invalid meeting week." };
  }

  try {
    await setWeekDescription(weekKey, description);
    revalidatePath("/schedule");
    revalidatePath("/king");
    revalidatePath("/");
    revalidatePath("/attendance");
    return {
      ok: true,
      message: trimmed ? "Week note saved." : "Week note cleared.",
    };
  } catch {
    return { ok: false, error: "Couldn’t save the note. Try again." };
  }
}
