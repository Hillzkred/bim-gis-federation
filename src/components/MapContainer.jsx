import maplibregl from 'maplibre-gl';
import { forwardRef, useState } from 'react';
import { Map } from 'react-map-gl';

const MainMap = forwardRef(({ children, handleClick }, ref) => {
  const [cursor, setCursor] = useState('auto');

  return (
    <Map
      initialViewState={{
        longitude: -75.72,
        latitude: 45.18,
        zoom: 10,
      }}
      mapLib={maplibregl}
      mapStyle='https://api.maptiler.com/maps/basic/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL'
      onMouseEnter={() => {
        setCursor('pointer');
        console.log('Hovered');
      }}
      onMouseLeave={() => setCursor('auto')}
      interactiveLayerIds={['buildings']}
      cursor={cursor}
      onClick={handleClick}
      ref={ref}
    >
      {children}
    </Map>
  );
});
export default MainMap;
