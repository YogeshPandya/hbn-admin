import React from "react";
import { useSpring, animated } from "@react-spring/web";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  color,
}) => {
  const animatedValue = useSpring({
    from: { val: 0 },
    to: { val: Number(value) },
    config: { duration: 1000 },
  });
  const animatedChange = useSpring({
    from: { val: 0 },
    to: { val: parseFloat(change) },
    config: { duration: 1000 },
  });

  return (
    <div className="stat-card">
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-value">
          <animated.span>
            {animatedValue.val.to((val) => Math.floor(val))}
          </animated.span>
        </div>
        <div className={`stat-change ${isPositive ? "positive" : "negative"}`}>
          {isPositive ? "↑" : "↓"}{" "}
          <animated.span>
            {animatedChange.val.to((val) => val.toFixed(2))}
          </animated.span>{" "}
          from yesterday
        </div>
      </div>
      <div className="ml-10">
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.21"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 30V37C0 49.7025 10.2975 60 23 60H30H37C49.7025 60 60 49.7025 60 37V30V23C60 10.2975 49.7025 0 37 0H30H23C10.2975 0 0 10.2975 0 23V30Z"
            fill={color}
          />
          <path
            opacity="0.587821"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.666 23.3333C20.666 26.2789 23.0538 28.6667 25.9993 28.6667C28.9449 28.6667 31.3327 26.2789 31.3327 23.3333C31.3327 20.3878 28.9449 18 25.9993 18C23.0538 18 20.666 20.3878 20.666 23.3333ZM34 28.666C34 30.8752 35.7909 32.666 38 32.666C40.2091 32.666 42 30.8752 42 28.666C42 26.4569 40.2091 24.666 38 24.666C35.7909 24.666 34 26.4569 34 28.666Z"
            fill={color}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M25.9778 31.334C19.6826 31.334 14.5177 34.5693 14.0009 40.9329C13.9727 41.2796 14.6356 42.0007 14.97 42.0007H36.9956C37.9972 42.0007 38.0128 41.1946 37.9972 40.934C37.6065 34.3916 32.3616 31.334 25.9778 31.334ZM45.2759 42.002H40.1335V42.0013C40.1335 39.0003 39.142 36.2309 37.4689 34.0028C42.0112 34.0522 45.7202 36.3486 45.9993 41.202C46.0105 41.3974 45.9993 42.002 45.2759 42.002Z"
            fill={color}
          />
        </svg>
      </div>
    </div>
  );
};

export default StatCard;
