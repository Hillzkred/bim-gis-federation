import { useRef, useState } from 'react';
import { Source, Layer, Popup } from 'react-map-gl';
import MapContainer from './components/MapContainer';
import Csv from './components/Csv';

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
      const geoJsonObj = JSON.parse(geoData);
      setData(geoJsonObj);

      const buildingCoordinate =
        geoJsonObj.features[0].geometry.coordinates[0][0][0].slice(0, 2);

      mapRef.current.flyTo({ center: buildingCoordinate, zoom: 17 });
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
      'fill-opacity': 0.5,
    },
  };

  return (
    <div className='absolute top-0 left-0 h-full w-full'>
      <input type='file' onChange={handleGeojsonUpload} />
      <MapContainer handleClick={handleClick} ref={mapRef}>
        <Source type='geojson' data={data}>
          <Layer {...buildingStyle} />
        </Source>
        {showPopup && (
          <Popup {...popUpAttributes}>
            {
              <div>
                <Csv />
              </div>
            }
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}
