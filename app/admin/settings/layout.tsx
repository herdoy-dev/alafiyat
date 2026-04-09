import { SettingsTabs } from "./settings-tabs";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <p className="font-display text-sm italic text-muted-foreground">
          Configure your store
        </p>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
          Settings
        </h1>
      </header>
      <SettingsTabs />
      <div>{children}</div>
    </div>
  );
}
