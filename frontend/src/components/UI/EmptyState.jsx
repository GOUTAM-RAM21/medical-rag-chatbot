import React from 'react';

export const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="text-6xl mb-4 opacity-50">{icon}</div>}
      <h3 className="text-xl font-heading font-semibold text-slate-800 mb-2">
        {title}
      </h3>
      <p className="text-slate-600 mb-6 max-w-md">{description}</p>
      {action}
    </div>
  );
};
