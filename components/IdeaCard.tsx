import { cn } from "@/lib/utils";

type IdeaCardProps = {
  idea: {
    id: string;
    title: string;
    description: string;
    tags: string[];
  };
  statusLabel?: string;
};

export default function IdeaCard({ idea, statusLabel }: IdeaCardProps) {
  const truncatedDescription =
    idea.description.length > 100 ? `${idea.description.slice(0, 100)}…` : idea.description;

  const statusClassName =
    statusLabel === "已上线"
      ? "border-green-200 bg-green-50 text-green-700"
      : statusLabel === "孵化中"
        ? "border-orange-200 bg-orange-50 text-brand-accent"
        : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <div className="group flex h-full flex-col rounded-xl border-2 border-brand-dark bg-white p-5 shadow-solid-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-1.5 hover:shadow-solid motion-reduce:transition-none">
      <div className="mb-3 flex items-start justify-between gap-4">
        <p className="font-mono text-xs text-gray-400">#{idea.id}</p>
        {statusLabel ? (
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs font-semibold",
              statusClassName
            )}
          >
            {statusLabel}
          </span>
        ) : null}
      </div>

      <h3 className="font-heading text-xl font-bold leading-tight text-brand-dark transition-colors group-hover:text-brand-primary">
        {idea.title}
      </h3>

      <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-gray-600 line-clamp-3">
        {truncatedDescription}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        {idea.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className={cn("rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-500")}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
