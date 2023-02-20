import maplibreGl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Layer, Map, Marker, Source } from 'react-map-gl';

const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-122.4, 37.8] },
    },
  ],
};

//I forgot where I got this map from
// https://basemaps.cartocdn.com/gl/positron-gl-style/style.json

const geoJsonUrl =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_ports.geojson';

const geoJsonBuildingHeight =
  'https://{s}.data.osmbuildings.org/0.2/dixw8kmb/tile/{z}/{x}/{y}.json';

export default function App() {
  return (
    <div className='w-screen h-screen'>
      <Map
        initialViewState={{
          latitude: 37.8,
          longitude: -122.4,
          zoom: 14,
        }}
        mapLib={maplibreGl}
        mapStyle='https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
      >
        <Source id='my-data' type='geojson' data={geoJsonUrl}>
          <Layer
            id='point'
            type='circle'
            paint={{ 'circle-radius': 20, 'circle-color': '#007cbf' }}
          />
        </Source>
        <Source
          id='building-height'
          type='geojson'
          data={geoJsonBuildingHeight}
        >
          <Layer
            id='polygon'
            type='fill'
            layout={{}}
            paint={{
              'fill-color': '#0080ff',
              'fill-opacity': 1,
            }}
          />
        </Source>
      </Map>
    </div>
  );
}
