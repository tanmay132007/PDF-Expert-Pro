import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ children, variant = 'primary', className, style, disabled, ...props }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'btn-primary';
      case 'secondary': return 'btn-secondary';
      case 'danger': return 'btn-primary'; // You can add a danger class in css if needed
      default: return 'btn-primary';
    }
  };

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`${getVariantClass()} ${className || ''}`}
      style={{
        ...style,
        ...(variant === 'danger' ? { backgroundColor: 'var(--semantic-error)' } : {})
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
