// src/components/Button.jsx
export const Button = ({ 
    children, 
    className = "", 
    variant = "primary",
    size = "default",
    ...props 
  }) => {
    const baseStyles = "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
    const variants = {
      primary: "bg-[#617321] hover:bg-[#37410f] text-white focus:ring-[#617321]",
      outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-500"
    }
    const sizes = {
      default: "px-4 py-2",
      icon: "p-2"
    }
  
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }