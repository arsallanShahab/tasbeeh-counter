import { useEffect, useState } from "react";
import { Download, Share2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { THEMES, ARABIC_FONTS } from "../../constants/dhikrData";
import { useEffectiveAppearance } from "../../utils/theme";
import { renderShareCard, shareImage } from "../../utils/shareCard";
import { Sheet } from "./Modal";
import { Button } from "./Button";
import { useToast } from "./toastContext";
import Seg from "./Seg";

/* Preview and send a share card. `card` is { eyebrow, arabic, title, meaning,
   source, filename }. The look follows the theme in light or dark. */
export const ShareSheet = ({ open, onClose, card }) => {
  const { settings } = useApp();
  const toast = useToast();
  const appearance = useEffectiveAppearance(settings.appearance);
  const [look, setLook] = useState(appearance);
  const [withTitle, setWithTitle] = useState(true);
  const [withMeaning, setWithMeaning] = useState(true);
  const [image, setImage] = useState(null); // { blob, url, left }
  const [busy, setBusy] = useState(false);

  const theme = THEMES[settings.theme] || THEMES.qalam;
  const font = ARABIC_FONTS.find((f) => f.id === settings.arabicFont) || ARABIC_FONTS[0];

  useEffect(() => {
    if (!open || !card) return;
    let gone = false;
    let url;
    renderShareCard({
      ...card,
      title: withTitle ? card.title : "",
      meaning: withMeaning ? card.meaning : "",
      vars: theme[look] || theme.light,
      arabicStack: font.stack,
    }).then(({ blob, left }) => {
      if (gone || !blob) return;
      url = URL.createObjectURL(blob);
      setImage({ blob, url, left });
    });
    return () => {
      gone = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [open, card, look, withTitle, withMeaning, theme, font.stack]);

  const send = async (mode) => {
    if (!image) return;
    setBusy(true);
    const text = card.title ? `${card.title}` : "";
    const result = await shareImage(image.blob, card.filename, text, mode === "save");
    setBusy(false);
    if (result === "saved") toast("Image saved");
  };
  const canShareFiles = typeof navigator !== "undefined" && !!navigator.canShare;

  return (
    <Sheet open={open} onClose={onClose} title="Share as image" description="A card in your theme, ready for WhatsApp or anywhere else.">
      <div className="mx-auto w-full max-w-[18rem] overflow-hidden rounded-xl border border-line bg-sunken" style={{ aspectRatio: "1080 / 1350" }}>
        {image ? <img src={image.url} alt="Preview of the share card" className="h-full w-full object-cover" /> : null}
      </div>

      {image?.left?.length > 0 && (
        <p className="mx-auto mt-3 max-w-[18rem] text-center text-[0.8125rem] leading-snug text-muted">
          The {image.left.join(" and ")} {image.left.length > 1 ? "are" : "is"} too long for one card, so {image.left.length > 1 ? "they are" : "it is"} left out.
        </p>
      )}

      <div className="mt-5 space-y-4">
        <Seg
          label="Card look"
          size="sm"
          value={look}
          onChange={setLook}
          options={[
            { v: "light", l: "Paper" },
            { v: "dark", l: "Night" },
          ]}
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="What the card shows">
          {card?.title && (
            <button type="button" className="chip" aria-pressed={withTitle} onClick={() => setWithTitle((v) => !v)}>
              Transliteration
            </button>
          )}
          {card?.meaning && (
            <button type="button" className="chip" aria-pressed={withMeaning} onClick={() => setWithMeaning((v) => !v)}>
              Meaning
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {canShareFiles && (
            <Button icon={Share2} loading={busy} disabled={!image} block onClick={() => send("share")}>
              Share
            </Button>
          )}
          <Button variant={canShareFiles ? "tonal" : "primary"} icon={Download} disabled={!image || busy} block onClick={() => send("save")}>
            Save image
          </Button>
        </div>
      </div>
    </Sheet>
  );
};

export default ShareSheet;
