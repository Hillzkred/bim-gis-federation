import { useRef, useState } from 'react';
import { Source, Layer, Popup } from 'react-map-gl';
import MapContainer from './components/MapContainer';
import Csv from './components/Csv';
import centroid from '@turf/centroid';
import { polygon } from '@turf/helpers';

export default function App() {
  const [data, setData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popUpCoordinate, setPopUpCoordinate] = useState({});
  const mapRef = useRef();

  const handleGeojsonUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event) => {
      const geoData = event.currentTarget.result;
      // console.log(geoData);
      const geoJsonObj = JSON.parse(geoData);
      setData(geoJsonObj);
      const feature = geoJsonObj.features[0].geometry.coordinates[0];
      console.log(feature);
      const poly = polygon(feature);
      const centerPoint = centroid(poly);
      console.log(centerPoint.geometry.coordinates);
      mapRef.current.flyTo({
        center: centerPoint.geometry.coordinates,
        zoom: 17,
      });
    };
  };

  const handleClick = (e) => {
    if (e.features[0].properties) {
      setShowPopup(!showPopup);
      setPopUpCoordinate({
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
      });
    } else setShowPopup(false);
  };

  const popUpAttributes = {
    longitude: popUpCoordinate.lng,
    latitude: popUpCoordinate.lat,
  };

  const buildingStyle = {
    id: 'buildings',
    type: 'fill',
    paint: {
      'fill-color': '#3a3a3a',
      'fill-opacity': 0,
    },
  };

  const buildingHeight = {
    id: 'building-height',
    type: 'fill-extrusion',
    paint: {
      'fill-extrusion-color': '#8a8a8a',
      'fill-extrusion-opacity': 0.9,
      'fill-extrusion-height': ['get', 'Height'],
    },
  };

  return (
    <div className='absolute top-0 left-0 h-full w-full'>
      <nav>
        <label className='fixed z-10 bg-emerald-500 hover:bg-emerald-700 text-white m-2 pr-2 pl-2 p-1 text-lg rounded-lg cursor-pointer'>
          Upload a GeoJSON file
          <input
            className='hidden'
            type='file'
            onChange={handleGeojsonUpload}
          />
        </label>
      </nav>
      <MapContainer handleClick={handleClick} ref={mapRef}>
        <Source type='geojson' data={data}>
          <Layer {...buildingStyle} />
          <Layer {...buildingHeight} />
        </Source>
        {showPopup && (
          <Popup {...popUpAttributes}>
            <Csv />
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}
