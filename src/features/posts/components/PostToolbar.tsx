type Props = {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
};

export function PostToolbar({ title, subtitle, rightSlot }: Props) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {rightSlot}
    </header>
  );
}
