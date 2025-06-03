import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  title?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  className = '',
  title,
}) => {
  const baseClasses = 'rounded-full flex items-center justify-center transition-all duration-300 font-medium';
  
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const sizeClasses = {
    sm: Icon && !children ? 'p-2' : 'px-3 py-1 text-sm',
    md: Icon && !children ? 'p-3' : 'px-4 py-2',
    lg: Icon && !children ? 'p-4' : 'px-6 py-3 text-lg',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      title={title}
    >
      {Icon && <Icon className={children ? 'mr-2' : ''} size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />}
      {children}
    </button>
  );
};

export default Button;