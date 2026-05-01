import React from 'react';
import { ArrowRight } from '@phosphor-icons/react';

const Logo: React.FC<{ size?: number }> = ({ size = 120 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * (28 / 120),
        backgroundColor: 'var(--primary-500)',
        boxShadow: '0 16px 48px rgba(229,57,53,0.40)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          fontFamily: 'Sora',
          fontWeight: 700,
          fontSize: size * 0.6,
          color: '#FFFFFF',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        P
      </div>
      <ArrowRight
        weight="bold"
        size={size * 0.16}
        color="#FFFFFF"
        style={{
          position: 'absolute',
          right: size * 0.28,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  );
};

export default Logo;
