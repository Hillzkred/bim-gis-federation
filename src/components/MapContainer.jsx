import maplibregl from 'maplibre-gl';
import DeckGL from '@deck.gl/react';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { forwardRef, useState } from 'react';
import { Map } from 'react-map-gl';

const MainMap = forwardRef(({ children, handleClick }, ref) => {
  const [cursor, setCursor] = useState('auto');

  const layer = new ScenegraphLayer({
    id: 'scenegraph-layer',
    pickable: true,
    data: [
      {
        name: 'Colma (COLM)',
        address: '365 D Street, Colma CA 94014',
        exits: 4214,
        coordinates: [148.9819, -35.39847],
      },
    ],
    scenegraph:
      'https://maplibre.org/maplibre-gl-js-docs/assets/34M_17/34M_17.gltf',
    getPosition: (d) => d.coordinates,
    getOrientation: (d) => [0, Math.random() * 180, 90],
    sizeScale: 1,
    _lighting: 'pbr',
  });

  return (
    <DeckGL
      initialViewState={{
        longitude: 148.9819,
        latitude: -35.39847,
        zoom: 18,
        pitch: 60,
      }}
      controller={true}
      layers={[layer]}
    >
      <Map
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
    </DeckGL>
  );
});
export default MainMap;
