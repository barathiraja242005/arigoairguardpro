import { useState, useEffect } from "react";

export const useFluctuatingValue = (
  baseValue: number,
  fluctuationRange: number = 2,
  intervalMs: number = 3000
) => {
  const [value, setValue] = useState(baseValue);

  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * fluctuationRange * 2;
      setValue(baseValue + fluctuation);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [baseValue, fluctuationRange, intervalMs]);

  return Math.round(value * 10) / 10;
};
