import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  { bg: 'bg-lavender-100', text: 'text-lavender-600' },
  { bg: 'bg-mint-100', text: 'text-mint-700' },
  { bg: 'bg-coral-100', text: 'text-coral-600' },
  { bg: 'bg-amber-100', text: 'text-amber-800' },
];

function getTagColor(index: number) {
  return tagColors[index % tagColors.length];
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const truncatedDescription =
    idea.description.length > 100 ? `${idea.description.slice(0, 100)}…` : idea.description;

  return (
    <Card className="group h-full border-white/40 bg-white/50 backdrop-blur-xl shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-hover">
      <CardHeader>
        <CardTitle className="text-xl leading-tight transition-colors group-hover:text-coral-400">
          {idea.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-pretty text-base leading-relaxed text-slate-500">
          {truncatedDescription}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex flex-wrap gap-2">
          {idea.tags.map((tag, index) => {
            const color = getTagColor(index);
            return (
              <span
                key={tag}
                className={cn('rounded-full px-3 py-1 text-xs font-medium border border-white/60', color.bg, color.text)}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </CardFooter>
    </Card>
  );
}
