interface Props {
  title: string;
  description?: string;
  cta?: React.ReactNode;
}

export default function EmptyState({ title, description, cta }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-border-default bg-bg-card px-6 py-16 text-center">
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {description && <p className="mt-2 text-sm text-text-muted">{description}</p>}
      {cta && <div className="mt-5">{cta}</div>}
    </div>
  );
}
