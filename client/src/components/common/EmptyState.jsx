import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText = 'Explore Collections',
  actionLink = '/shop',
  onAction,
}) => {
  return (
    <div className="text-center py-20 px-4 max-w-md mx-auto space-y-4">
      {Icon && (
        <div className="mx-auto w-16 h-16 rounded-full bg-luxury-100 flex items-center justify-center text-luxury-500">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="font-serif text-2xl text-luxury-950 font-medium">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-luxury-600 leading-relaxed font-sans">
          {description}
        </p>
      )}
      <div className="pt-4">
        {onAction ? (
          <Button onClick={onAction}>{actionText}</Button>
        ) : (
          <Link to={actionLink}>
            <Button>{actionText}</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
