import React from 'react';
import { Link } from '@remix-run/react';

interface LinkButtonProps {
  type: 'primary' | 'outline';
  size: 'small' | 'medium' | 'large';
  color: 'black';
  href: string;
  children: React.ReactNode;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ type, size, color, href, children, target, rel }) => {
  const baseClasses = 'font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-block text-center';
  
  const typeClasses = {
    primary: 'text-white bg-black hover:bg-gray-800 focus:ring-black',
    outline: 'text-black bg-transparent border-2 border-black hover:bg-black hover:text-white focus:ring-black',
  };

  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const linkClasses = `${baseClasses} ${typeClasses[type]} ${sizeClasses[size]}`;

  return (
    <Link 
      to={href}
      className={linkClasses}
      target={target}
      rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
