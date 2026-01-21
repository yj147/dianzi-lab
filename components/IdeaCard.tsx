type IdeaCardProps = {
  idea: {
    id: string;
    title: string;
    description: string;
    tags: string[];
  };
};

// Color palette for tags - cycles through these colors
const tagColors = [
  { bg: 'bg-blue-100', text: 'text-blue-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-purple-100', text: 'text-purple-700' },
  { bg: 'bg-rose-100', text: 'text-rose-700' },
  { bg: 'bg-cyan-100', text: 'text-cyan-700' },
];

function getTagColor(index: number) {
  return tagColors[index % tagColors.length];
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const truncatedDesc =
    idea.description.length > 100
      ? idea.description.slice(0, 100) + '...'
      : idea.description;

  return (
    <div className="group cursor-pointer rounded-xl border border-slate-200/60 bg-white/80 p-6 shadow-md backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-colors">
      <h3 className="mb-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
        {idea.title}
      </h3>
      <p className="mb-4 text-slate-600">{truncatedDesc}</p>
      <div className="flex flex-wrap gap-2">
        {idea.tags.map((tag, index) => {
          const color = getTagColor(index);
          return (
            <span
              key={tag}
              className={`rounded-full px-3 py-1 text-sm font-medium ${color.bg} ${color.text}`}
            >
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  );
}
