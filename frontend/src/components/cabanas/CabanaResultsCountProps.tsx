import React from 'react';

interface CabanaResultsCountProps {
  count: number;
}

const CabanaResultsCount: React.FC<CabanaResultsCountProps> = ({ count }) => {
  return (
    <div className="mb-6">
      <p className="text-gray-600">
        {count} cabaña{count !== 1 ? 's' : ''} encontrada{count !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default CabanaResultsCount;