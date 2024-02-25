import React from 'react';
import styles from './index.module.scss';

type Props = {
  rating: number;
}

const getFillColor = (rating: number): string => {
  if (rating <= 1.99) return '#C6BEE5';
  if (rating <= 3.99) return '#287C95';
  if (rating <= 5.99) return '#D59F14';
  if (rating <= 7.99) return '#209763';
  return '#E53832';
};

const RatingMeter = ({rating}: Props) => {
  const strokeWidth = 2; // Adjust stroke width as needed
  const outerStrokeWidth = 0.5; // Adjust outer stroke width as needed
  const radius = 18 - strokeWidth - outerStrokeWidth; // Adjust radius based on stroke width
  const circumference = 2 * Math.PI * radius;
  const ratingPercentage = (rating / 10) * circumference;
  const fillColour = getFillColor(rating);
  
  return ( 
    <div className={styles.wrap}>
      <svg viewBox="0 0 36 36" className={styles.ratingMeter}>
        {/* Outer circle border */}
        <circle className={styles.outerCircleBorder}
                cx="18" cy="18" r="17.5" // Adjust for the border to be on the edge
                fill="none" strokeWidth={outerStrokeWidth} />
        {/* Inner circle */}
        <circle className={styles.innerCircle}
                cx="18" cy="18" r={radius}
                fill="none" strokeWidth={strokeWidth * 2} />
        {/* Progress arc */}
        <circle className={styles.circle}
                cx="18" cy="18" r={radius}
                fill="none" strokeWidth={strokeWidth}
                stroke={fillColour}
                strokeDasharray={`${ratingPercentage}, ${circumference}`}
                transform="rotate(-90 18 18)" />
        {/* Rating number */}
        <text x="18" y="17.5" className={styles.rating} 
              alignment-baseline="central"
              text-anchor="middle"
              >{rating}</text>
      </svg>
    </div>
   );
}
 
export default RatingMeter;