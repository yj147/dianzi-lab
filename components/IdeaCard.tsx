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
  { bg: 'bg-blue-100', text: 'text-blue-800' },
  { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  { bg: 'bg-amber-100', text: 'text-amber-800' },
  { bg: 'bg-purple-100', text: 'text-purple-800' },
  { bg: 'bg-rose-100', text: 'text-rose-800' },
  { bg: 'bg-cyan-100', text: 'text-cyan-800' },
];

function getTagColor(index: number) {
  return tagColors[index % tagColors.length];
}

export default function IdeaCard({ idea }: IdeaCardProps) {

  return (
    <Card className="group h-full border-white/20 bg-white/5 backdrop-blur-xl shadow-sm transition-[transform,shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl leading-tight transition-colors group-hover:text-primary">
          {idea.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed text-muted-foreground line-clamp-3">
          {idea.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex flex-wrap gap-2">
          {idea.tags.map((tag, index) => {
            const color = getTagColor(index);
            return (
              <span
                key={tag}
                className={cn(`rounded-full px-3 py-1 text-xs font-medium bg-opacity-50 border border-opacity-20`, color.bg, color.text)}
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
