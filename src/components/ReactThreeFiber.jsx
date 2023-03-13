import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';

export function ReactThreeFiber() {
  const [customLayer, setCustomLayer] = useState();
  useEffect(() => {
    const newLayer = {};
    setCustomLayer(newLayer);
  }, []);

  return customLayer;
}
