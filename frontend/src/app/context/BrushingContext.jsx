import { createContext, useContext, useState } from 'react';

const BrushingContext = createContext();

export function BrushingProvider({ children }) {
  const [linkedTimestamp, setLinkedTimestamp] = useState(null);
  const [linkedReading, setLinkedReading] = useState(null);

  const brushPoint = (timestamp, readingData) => {
    setLinkedTimestamp(timestamp);
    setLinkedReading(readingData);
  };

  const clearBrush = () => {
    setLinkedTimestamp(null);
    setLinkedReading(null);
  };

  return (
    <BrushingContext.Provider value={{ linkedTimestamp, linkedReading, brushPoint, clearBrush }}>
      {children}
    </BrushingContext.Provider>
  );
}

export function useBrushing() {
  return useContext(BrushingContext);
}