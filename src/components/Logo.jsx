import React from 'react';

const Logo = ({ height = 40, color = 'var(--primary-color)' }) => {
    return (
        <svg
            width={height}
            height={height}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x="20" y="20" width="60" height="60" rx="10" stroke={color} strokeWidth="8" />
            <path d="M30 20V10" stroke={color} strokeWidth="8" strokeLinecap="round" />
            <path d="M70 20V10" stroke={color} strokeWidth="8" strokeLinecap="round" />
            <path d="M35 55L45 65L65 45" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default Logo;
