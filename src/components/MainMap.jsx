import maplibregl from 'maplibre-gl';
import { useState } from 'react';
import { Map } from 'react-map-gl';

export default function MainMap({ children, handleClick }) {
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
    >
      {children}
    </Map>
  );
}
