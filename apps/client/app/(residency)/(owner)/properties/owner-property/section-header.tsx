import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  className?: string;
};

export function SectionHeader({ title, className }: SectionHeaderProps) {
  return (
    <h1
      className={cn(
        "flex justify-center text-2xl leading-none font-semibold tracking-tighter",
        className,
      )}
    >
      {title}{" "}
    </h1>
  );
}
