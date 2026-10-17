import { PageHeader, Panel } from "../common/Layout";

const UPDATED = "18 October 2026";

/* One section of the policy: a heading and its plain-language body. */
const Section = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="font-display text-[1.375rem] leading-tight font-medium text-ink">{title}</h2>
    <div className="max-w-[65ch] space-y-3 text-[0.9375rem] leading-relaxed text-ink">{children}</div>
  </section>
);

export default function PrivacyView() {
  return (
    <article className="space-y-10">
      <PageHeader
        eyebrow={`Updated ${UPDATED}`}
        title="Privacy"
        description="Tasbeeh Go keeps your dhikr on your device. There are no accounts, no ads and no tracking."
      />

      <Panel className="max-w-[65ch] p-5">
        <p className="text-[0.9375rem] leading-relaxed text-ink">
          In short: we do not collect, sell or share any personal data. Everything you add or count stays on your
          phone or computer, and you can delete it at any time.
        </p>
      </Panel>

      <Section title="What stays on your device">
        <p>
          Your counts, streaks, goals, your own dhikr and sets, your du'a list and your settings are saved in your
          device's storage. They are never uploaded to us or to anyone else.
        </p>
        <p>
          If you save a backup, it is a file on your device. Where it goes after that, such as your files or a
          message you share it in, is your choice.
        </p>
      </Section>

      <Section title="Location">
        <p>
          If you turn on prayer times or use the qibla compass, Tasbeeh Go asks for your approximate location. It
          is used on your device to work out prayer times and the qibla direction, and it is not sent anywhere.
          You can also type in coordinates instead, or turn location off in your device settings.
        </p>
      </Section>

      <Section title="Notifications, motion and haptics">
        <p>
          Reminders are scheduled on your device and only if you turn them on. The compass reads your device's
          motion sensors, and the counter can vibrate as you count. None of this leaves your device.
        </p>
      </Section>

      <Section title="Services we rely on">
        <p>
          The website is hosted on Vercel, which keeps standard server logs, such as IP addresses, to deliver and
          protect the site. The website also loads fonts from Google Fonts, which receives your IP address when it
          sends them. Neither is used by us to identify or track you.
        </p>
        <p>
          The Android app is distributed through Google Play, which handles downloads and updates under Google's
          own privacy policy.
        </p>
      </Section>

      <Section title="Children">
        <p>
          Tasbeeh Go is suitable for all ages. Because it collects no personal data, it collects none from
          children either.
        </p>
      </Section>

      <Section title="Deleting your data">
        <p>
          Use Settings, then Reset, to clear everything, or uninstall the app or clear this site's data in your
          browser. Since we hold no copy, nothing is left behind with us.
        </p>
      </Section>

      <Section title="Changes and contact">
        <p>
          If this policy changes, the new version will be posted on this page with a new date. For questions,
          use the developer contact on the Tasbeeh Go Google Play listing.
        </p>
      </Section>
    </article>
  );
}
