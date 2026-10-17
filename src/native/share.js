import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

const toBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });

/* Files made in the app (share cards, wallpapers, backups) can't be
   downloaded from the web view, so they are written to the cache and handed
   to the system share sheet, which also offers saving them (Save Image or
   Save to Files on iOS; Files, Drive or Photos on Android). */
export async function nativeShareFile(blob, filename, text) {
  const data = await toBase64(blob);
  const { uri } = await Filesystem.writeFile({ path: filename, data, directory: Directory.Cache });
  try {
    await Share.share({ files: [uri], text: text || undefined, dialogTitle: "Share or save" });
    return "shared";
  } catch (e) {
    if (/cancel/i.test(String(e?.message || e))) return "cancelled";
    throw e;
  }
}

export const nativeShareImage = nativeShareFile;
