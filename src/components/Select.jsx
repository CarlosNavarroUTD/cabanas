// src/components/Select.jsx
export const Select = ({ 
    label, 
    id, 
    options, 
    value, 
    onChange, 
    placeholder = "Seleccionar...", 
    className = "" 
  }) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#617321] focus:border-transparent ${className}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )
  }
  