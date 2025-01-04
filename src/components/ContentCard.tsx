// src/components/ContentCard.tsx
import { ContentCardProps } from '../types/content';
import Image from 'next/image';

export const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        {/* Use a placeholder image if imageUrl is not available */}
        <img
          src="/api/placeholder/400/300"
          alt={content.title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          {content.title}
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          {content.description}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            {new Date(content.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};