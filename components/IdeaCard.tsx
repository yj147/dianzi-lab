type IdeaCardProps = {
  idea: {
    id: string;
    title: string;
    description: string;
    tags: string[];
  };
};

export default function IdeaCard({ idea }: IdeaCardProps) {
  const truncatedDesc =
    idea.description.length > 100
      ? idea.description.slice(0, 100) + '...'
      : idea.description;

  return (
    <div className="group rounded-xl bg-white/30 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{idea.title}</h3>
      <p className="mb-4 text-gray-600">{truncatedDesc}</p>
      <div className="flex flex-wrap gap-2">
        {idea.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-600"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
