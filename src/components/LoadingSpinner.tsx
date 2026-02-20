import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: string;
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    color = '#d4a574',
    className = '',
}) => {
    const sizeMap = {
        sm: 30,
        md: 50,
        lg: 80,
        xl: 120,
    };

    const strokeWidthMap = {
        sm: 3,
        md: 4,
        lg: 5,
        xl: 6,
    };

    const dimension = sizeMap[size];
    const strokeWidth = strokeWidthMap[size];

    const spinnerStyle = {
        animation: 'spin 1s linear infinite',
    };

    const styleSheet = `
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    `;

    return (
        <>
            <style>{styleSheet}</style>
            <div className={`flex items-center justify-center ${className}`}>
                <svg
                    width={dimension}
                    height={dimension}
                    viewBox={`0 0 ${dimension} ${dimension}`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={spinnerStyle}
                >
                    <circle
                        cx={dimension / 2}
                        cy={dimension / 2}
                        r={dimension / 2 - strokeWidth / 2}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        opacity="0.2"
                    />
                    <circle
                        cx={dimension / 2}
                        cy={dimension / 2}
                        r={dimension / 2 - strokeWidth / 2}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${(dimension * Math.PI) / 2} ${dimension * Math.PI}`}
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        </>
    );
};

export default LoadingSpinner;
