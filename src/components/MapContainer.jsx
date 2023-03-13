import maplibregl from 'maplibre-gl';
import DeckGL from '@deck.gl/react';
import { ScenegraphLayer } from '@deck.gl/mesh-layers';
import { forwardRef, useState } from 'react';
import { Map } from 'react-map-gl';
import { parse, fetchFile } from '@loaders.gl/core';
import { I3SLoader } from '@loaders.gl/i3s';
// import { Tile3DLayer } from 'deck.gl';
import { OBJLoader } from '@loaders.gl/obj';
import { Tile3DLayer } from '@deck.gl/geo-layers';
import { ReactThreeFiber } from './ReactThreeFiber';

const MapContainer = forwardRef(({ children, handleClick, ifc }, ref) => {
  const [cursor, setCursor] = useState('auto');
  console.log(ifc);
  const three = ReactThreeFiber(ifc);
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
    scenegraph: ifc,
    // scenegraph:
    //   'https://maplibre.org/maplibre-gl-js-docs/assets/34M_17/34M_17.gltf',
    getPosition: (d) => d.coordinates,
    getOrientation: (d) => [0, Math.random() * 180, 90],
    sizeScale: 50000,
    _lighting: 'pbr',
  });
  // scenegraph: parse(fetchFile(ifc), I3SLoader),

  const newLayer = new Tile3DLayer({
    id: 'tile-3d-layer',
    // Tileset entry point: Indexed 3D layer file url
    data: 'https://tiles.arcgis.com/tiles/z2tnIkrLQ2BRzr6P/arcgis/rest/services/Admin_Building_v17/SceneServer/layers/0',
    loader: I3SLoader,
  });

  return (
    <DeckGL
      initialViewState={{
        // longitude: 148.9819,
        // latitude: -35.39847,
        longitude: 2.0283,
        latitude: 48.9244,
        zoom: 18,
        pitch: 60,
      }}
      controller={true}
      // layers={[layer, newLayer]}
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
export default MapContainer;
