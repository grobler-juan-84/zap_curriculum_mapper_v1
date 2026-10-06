import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs font-medium text-slate-500 whitespace-nowrap overflow-x-auto">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-300 shrink-0" aria-hidden="true" />
            )}
            {item.onClick && !isLast ? (
              <button
                type="button"
                onClick={item.onClick}
                className="hover:text-slate-900 transition-colors cursor-pointer text-slate-600 focus-visible:outline-none focus-visible:underline"
              >
                {item.label}
              </button>
            ) : (
              <span className={isLast ? 'text-slate-900 font-semibold truncate' : 'text-slate-500'}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
};
