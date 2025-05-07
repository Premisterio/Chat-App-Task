import React from 'react';

const Button = ({ 
  children, 
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'button';
  const variantClasses = {
    primary: 'button-primary',
    secondary: 'button-secondary',
    danger: 'button-danger',
    outline: 'button-outline',
    text: 'button-text'
  };
  const sizeClasses = {
    sm: 'button-sm',
    md: '',
    lg: 'button-lg'
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant] || '',
    sizeClasses[size] || '',
    fullWidth ? 'button-full-width' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;