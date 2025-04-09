// utils/countUp.js
export const animateCountUp = (end, setState, duration = 800) => {
    let start = 0;
    const incrementTime = 30;
    const steps = Math.ceil(duration / incrementTime);
    const increment = Math.ceil(end / steps);
  
    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(counter);
        setState(end);
      } else {
        setState(start);
      }
    }, incrementTime);
  };
  