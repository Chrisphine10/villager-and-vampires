import React from 'react';
import { Text } from '@react-three/drei';
import './ThreeDStyle.css';

const ThreeDText = ({ text, type }) => {
    let className;
    switch (type) {
        case 'header':
            className = 'threeDText-header';
            break;
        case 'title':
            className = 'threeDText-title';
            break;
        case 'normal':
            className = 'threeDText-normal';
            break;
        default:
            className = 'threeDText-normal';
    }

    return (
        <Text
            className={className}
            anchorX="center"
            anchorY="middle"
            font="Play"
        >
            {text}
        </Text>
    );
};

export default ThreeDText;
