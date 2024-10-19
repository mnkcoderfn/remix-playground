import React from 'react';

interface ButtonProps {
  type: 'primary' | 'outline';
  size: 'small' | 'medium' | 'large';
  color: 'black';
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ type, size, color, children, onClick, fullWidth = false }) => {
  const baseClasses = 'font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const typeClasses = {
    primary: 'text-white bg-black hover:bg-gray-800 focus:ring-black',
    outline: 'text-black bg-transparent border-2 border-black hover:bg-black hover:text-white focus:ring-black',
  };

  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const buttonClasses = `${baseClasses} ${typeClasses[type]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`;

  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
