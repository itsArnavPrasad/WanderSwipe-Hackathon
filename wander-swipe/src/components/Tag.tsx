
import React from 'react';
import { cn } from '@/lib/utils';

interface TagProps {
  label: string;
  className?: string;
}

const getTagColor = (tag: string): string => {
  const colors: Record<string, string> = {
    Beach: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
    Island: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100',
    Mountain: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
    City: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
    Cultural: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-100',
    Historic: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    Adventure: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    Nature: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    Romantic: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
    Luxury: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    Safari: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    Temple: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100',
    Ancient: 'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-100',
    Ocean: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    Desert: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
    Snow: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100',
    Wine: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    Coastal: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100',
    Wildlife: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-100',
    Architecture: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100',
  };
  
  return colors[tag] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
};

export const Tag: React.FC<TagProps> = ({ label, className }) => {
  const tagColor = getTagColor(label);
  
  return (
    <span 
      className={cn('tag-pill', tagColor, className)}
    >
      {label}
    </span>
  );
};
