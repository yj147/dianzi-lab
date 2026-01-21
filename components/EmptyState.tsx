import { ReactNode } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  icon?: ReactNode;
  message: string;
}

export default function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="text-gray-400 mb-4 w-12 h-12 mx-auto">
        {icon || <SparklesIcon className="w-12 h-12" />}
      </div>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
