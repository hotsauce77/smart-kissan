import React, { ReactNode } from 'react';

interface DataCardProps {
  title: string;
  value?: string | number;
  icon?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  loading?: boolean;
  className?: string;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  icon,
  footer,
  children,
  loading = false,
  className = '',
}) => {
  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
      <div className="p-5">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            {children && <div className="h-24 bg-gray-200 rounded"></div>}
          </div>
        ) : (
          <>
            <div className="flex items-center">
              {icon && <div className="flex-shrink-0">{icon}</div>}
              <div className={`${icon ? 'ml-5' : ''} w-0 flex-1`}>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {title}
                </dt>
                {value && (
                  <dd className="flex items-baseline mt-1">
                    <div className="text-2xl font-semibold text-gray-900">
                      {value}
                    </div>
                  </dd>
                )}
              </div>
            </div>
            {children && <div className="mt-4">{children}</div>}
          </>
        )}
      </div>
      {footer && (
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export default DataCard; 