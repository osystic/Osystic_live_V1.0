/* ══════════════════════════════════════════════════════════
   lib/supabase.ts
   Supabase client — safe usage with strong validation.

   Server-only CV storage client, initialized at request time.
   The unused public client was removed; service credentials never enter a client bundle.
══════════════════════════════════════════════════════════ */

import "server-only";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

/* ── Load env vars safely ── */
let storageClient: ReturnType<typeof createClient> | undefined;
export function getStorageClient() {
  if (!storageClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !svcKey) throw new Error("CV storage is not configured");
    storageClient = createClient(url, svcKey, { auth: { autoRefreshToken: false, persistSession: false } });
  }
  return storageClient;
}

/* ── CV Storage bucket ── */
export const CV_BUCKET = "cv-uploads";

/* ── Upload CV to Supabase Storage ── */
export async function uploadCVToStorage(
  fileBuffer:  ArrayBuffer,
  fileName:    string,
  contentType: string,
  applicantName: string,
): Promise<{ path: string; url: string }> {
  // Names are not embedded in private storage object keys.
  void fileName;
  void applicantName;
  const supabaseAdmin = getStorageClient();
  const { data: bucket, error: bucketError } = await supabaseAdmin.storage.getBucket(CV_BUCKET);
  if (bucketError || !bucket || bucket.public) throw new Error("CV storage must use a private bucket");
  const extensionByType: Record<string, string> = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  };
  const ext = extensionByType[contentType] || "bin";
  const path = `${randomUUID()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(CV_BUCKET)
    .upload(path, fileBuffer, { contentType, upsert: false });

  if (error) throw new Error(`CV upload failed: ${error.message}`);

  /* Signed URL — expires in 7 days */
  const { data: signedData, error: signedError } = await supabaseAdmin.storage
    .from(CV_BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 7);

  if (signedError || !signedData) {
    await deleteCVFromStorage(path);
    throw new Error(`Failed to create signed URL: ${signedError?.message}`);
  }

  return { path, url: signedData.signedUrl };
}

/* ── Delete CV from Storage ── */
export async function deleteCVFromStorage(path: string) {
  const { error } = await getStorageClient().storage.from(CV_BUCKET).remove([path]);
  if (error) console.error("CV delete failed:", error.message);
}
