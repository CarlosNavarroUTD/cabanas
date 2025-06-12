// src/components/Input.jsx
export const Input = ({ 
    label, 
    id, 
    className = "", 
    ...props 
  }) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          id={id}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#617321] focus:border-transparent ${className}`}
          {...props}
        />
      </div>
    )
  }