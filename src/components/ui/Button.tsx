import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'default' | 'ghost';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  const variantStyles = {
    primary: 'border-transparent text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    secondary: 'border-transparent text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:ring-yellow-500',
    outline: 'border-yellow-500 text-yellow-500 bg-transparent hover:bg-yellow-50 focus:ring-yellow-500',
    destructive: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
    default: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-yellow-500',
    ghost: 'border-transparent text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-yellow-500'
  };
  
  const disabledStyles = 'opacity-50 cursor-not-allowed';
  
  const buttonStyles = `
    ${baseStyles}
    ${variantStyles[variant as keyof typeof variantStyles] || variantStyles.primary}
    ${disabled ? disabledStyles : ''}
    ${className}
  `;
  
  return (
    <button
      type={type}
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
