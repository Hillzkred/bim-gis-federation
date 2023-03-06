import { createRef, useEffect, useRef, useState } from 'react';
import { Source, Layer, Popup } from 'react-map-gl';
import MapContainer from './components/MapContainer';
import Csv from './components/Csv';
import centroid from '@turf/centroid';
import { polygon } from '@turf/helpers';
import { IFCLoader } from 'web-ifc-three';

export default function App() {
  const [data, setData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popUpCoordinate, setPopUpCoordinate] = useState({});
  const [ifcData, setIfcData] = useState(false);
  const mapRef = useRef();
  const ifcRef = createRef();

  useEffect(() => {
    const container = ifcRef.current;
  }, []);

  const ifcLoader = new IFCLoader();

  const handleIfcUpload = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    // const reader = new FileReader();
    // reader.readAsArrayBuffer(file);
    // reader.onload = (event) => {
    //   setIfcData(event.currentTarget.result);
    // };
    const url = URL.createObjectURL(file);
    await ifcLoader.loadAsync(url).then((ifcModel) => {
      setIfcData(ifcModel);
    });
  };

  const handleGeojsonUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event) => {
      const geoData = event.currentTarget.result;
      const geoJsonObj = JSON.parse(geoData);
      const feature = geoJsonObj.features[0].geometry.coordinates[0];
      const poly = polygon(feature);
      const centerPoint = centroid(poly);
      setData(geoJsonObj);
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
    <div className='absolute top-0 left-0 h-full w-full' id='map' ref={ifcRef}>
      <nav className='flex fixed z-10'>
        <label className='bg-emerald-500 hover:bg-emerald-700 text-white m-2 pr-2 pl-2 p-1 text-lg rounded-lg cursor-pointer'>
          Upload a GeoJSON file
          <input
            className='hidden'
            type='file'
            onChange={handleGeojsonUpload}
          />
        </label>
        <label className='bg-gray-500 hover:bg-gray-700 text-white m-2 pr-2 pl-2 p-1 text-lg rounded-lg cursor-pointer'>
          Upload an IFC file
          <input className='hidden' type='file' onChange={handleIfcUpload} />
        </label>
      </nav>
      <MapContainer handleClick={handleClick} ref={mapRef} ifc={ifcData}>
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
