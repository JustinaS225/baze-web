'use client'
import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import { useRef } from 'react';

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

const getSpeed = (rating: number): number => {
  if (rating <= 1.99) return 1500;
  if (rating <= 3.99) return 1700;
  if (rating <= 5.99) return 2000;
  if (rating <= 7.99) return 2300;
  return 2500;

}

const RatingMeter = ({rating}: Props) => {
  const [renderedRating, setRenderedRating] = useState(0);
  const strokeWidth = 2; // Adjust stroke width as needed
  const outerStrokeWidth = 0.5; // Adjust outer stroke width as needed
  const radius = 18 - strokeWidth - outerStrokeWidth; // Adjust radius based on stroke width
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Trigger the animation by updating the renderedRating over time
    const animationDuration = getSpeed(rating); // Animation duration in milliseconds
    let animationFrame: number;
    let start: number;

    const animate = (timestamp: number) => {
      start = start || timestamp;
      const elapsed = timestamp - start;

      // Calculate the progress
      const progress = Math.min(elapsed / animationDuration, 1);
      setRenderedRating(progress * rating);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [rating]);

  const fillPercentage = renderedRating / 10;
  const strokeDasharray = `${fillPercentage * circumference} ${circumference}`;
  
  return ( 
    <div className={styles.wrap}>
      <svg viewBox="0 0 36 36" className={styles.ratingMeter}>
        {/* Outer circle border */}
        <circle className={styles.outerCircleBorder}
                cx="18" cy="18" r={radius}
                fill="none" strokeWidth={strokeWidth * 2} />
        {/* Inner circle */}
        <circle className={styles.innerCircle}
                cx="18" cy="18" r={radius}
                fill="none" strokeWidth={strokeWidth} />
        {/* Progress arc */}
        <circle className={styles.circle}
                cx="18" cy="18" r={radius}
                fill="none" strokeWidth={strokeWidth}
                stroke={getFillColor(renderedRating)}
                strokeDasharray={strokeDasharray}
                transform="rotate(-90 18 18)" />
        {/* Rating number */}
        <text x='18' y='18' className={styles.rating}
      dominant-baseline="middle" text-anchor="middle">
          {renderedRating.toFixed(1)}
        </text>
      </svg>
    </div>
   );
}
 
export default RatingMeter;