import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-100 text-red-700 border border-red-300 rounded-md px-4 py-3">
      <strong>Error:</strong> {message}
    </div>
  );
};

export default ErrorMessage;
