type SectionHeaderProps = {
  title: string;
};

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="space-y-1 flex justify-center">
      <h1 className="text-2xl leading-none font-semibold tracking-tighter">
        {title}{" "}
      </h1>
    </div>
  );
}
