import { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  message: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, message, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="text-muted-foreground mb-4 w-12 h-12 mx-auto">
        {icon || <Sparkles className="w-12 h-12" />}
      </div>
      <p className="text-muted-foreground">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
