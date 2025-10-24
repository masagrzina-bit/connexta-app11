'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  const baseStyle =
    'w-full py-2 px-4 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1';

  const styles =
    variant === 'primary'
      ? `${baseStyle} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`
      : `${baseStyle} bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400`;

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
};

export default Button;
