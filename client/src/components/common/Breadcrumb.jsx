import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-widest text-luxury-500 py-4">
      <Link to="/" className="hover:text-luxury-950 transition-colors">
        Home
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-luxury-400 shrink-0" />
            {isLast || !item.path ? (
              <span className="text-luxury-950 font-medium truncate max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link to={item.path} className="hover:text-luxury-950 transition-colors">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
