import { createRef, useEffect, useRef, useState } from 'react';
import { Source, Layer, Popup } from 'react-map-gl';
import MapContainer from './components/MapContainer';
import Csv from './components/Csv';
import centroid from '@turf/centroid';
import { polygon } from '@turf/helpers';
import { IfcViewerAPI } from 'web-ifc-viewer';
// import { parse } from '@loaders.gl/core';
// import { GLTFLoader } from '@loaders.gl/gltf';
// import {
//   IFCWALL,
//   IFCWALLSTANDARDCASE,
//   IFCSLAB,
//   IFCWINDOW,
//   IFCMEMBER,
//   IFCPLATE,
//   IFCCURTAINWALL,
//   IFCDOOR,
// } from 'web-ifc';

export default function App() {
  const [data, setData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popUpCoordinate, setPopUpCoordinate] = useState({});
  const [ifcData, setIfcData] = useState(false);
  const [viewer, setViewer] = useState(false);
  const mapRef = useRef();
  const ifcRef = createRef();

  useEffect(() => {
    const container = ifcRef.current;
    const viewer = new IfcViewerAPI({
      container,
    });
    viewer.IFC.loader.ifcManager.applyWebIfcConfig({
      COORDINATE_TO_ORIGIN: true,
      USE_FAST_BOOLS: false,
    });
    setViewer(viewer);
  }, []);

  const handleIfcUpload = async (e) => {
    const file = e.target.files[0];

    const url = URL.createObjectURL(file);
    console.log(url);
    const result = await viewer.GLTF.exportIfcFileAsGltf({
      ifcFileUrl: url,
    });
    const ifcReader = new FileReader();
    ifcReader.readAsText(file);
    ifcReader.onload = (event) => {
      const arrayBuffer = event.currentTarget.result.byteLength;
      setIfcData(event);
    };
    // const readPromise = new Promise((resolve) => {
    //   const reader = new FileReader();
    //   reader.onload = (ev) => {
    //     console.log('foo');
    //   };
    //   reader.readAsArrayBuffer(e.dataTransfer.files[0]);
    // });

    // const gltf = parse(ifcReader.result, GLTFLoader).then((model) =>
    //   console.log(model)
    // );

    const model = await viewer.IFC.loadIfc(file);
    // const arrayBuffer = model.geometry.boundsTree._roots;

    // parse(result, GLTFLoader).then((response) => {
    //   console.log(result);
    // });
    // console.log(result);
    // setIfcData(viewer);
    viewer.shadowDropper.renderShadow(model.modelID);
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
      {viewer && (
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
      )}
    </div>
  );
}
