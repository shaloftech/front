import React, { useEffect, useState } from "react";

const Countdown = ({ deliveryTime, predictedAt, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(deliveryTime);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeElapsed = Math.floor(
        (Date.now() - new Date(predictedAt)) / 1000
      );
      const newTimeLeft = deliveryTime - timeElapsed;
      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        clearInterval(interval);
        if (onComplete) onComplete(); // Trigger callback when complete
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deliveryTime, predictedAt, onComplete]);

  if (timeLeft <= 0) return <span>Filled!</span>;

  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <span>
      {days > 0 && `${days}d `}
      {hours > 0 && `${hours}h `}
      {minutes > 0 && `${minutes}m `}
      {seconds > 0 && `${seconds}s`}
    </span>
  );
};

export default Countdown;
