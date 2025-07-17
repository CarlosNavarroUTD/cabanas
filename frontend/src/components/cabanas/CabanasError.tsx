import React from 'react';

interface CabanaErrorProps {
  error: string;
}

const CabanaError: React.FC<CabanaErrorProps> = ({ error }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    </div>
  );
};

export default CabanaError;