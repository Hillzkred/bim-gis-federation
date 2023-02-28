import { useCallback, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Map, Source, Layer, Popup } from 'react-map-gl';
import { readString, useCSVReader } from 'react-papaparse';

export default function App() {
  const [data, setData] = useState(null);
  const [cursor, setCursor] = useState('auto');
  const [showPopup, setShowPopup] = useState(false);
  const [popUpCoordinate, setPopUpCoordinate] = useState({});
  const [csvProperties, setCsvProperties] = useState([]);
  const [csvValues, setCsvValues] = useState([]);
  const { CSVReader } = useCSVReader();

  const handleGeojsonUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event) => {
      const geoData = event.currentTarget.result;
      const geoJsonObj = JSON.parse(geoData);
      setData(geoJsonObj);
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
        <Source type='geojson' data={data}>
          <Layer {...buildingStyle} />
        </Source>
        {showPopup && (
          <Popup {...popUpAttributes}>
            {
              <div>
                <CSVReader
                  onUploadAccepted={(results) => {
                    setCsvProperties(results.data[0]);
                    setCsvValues(results.data[1]);
                  }}
                >
                  {({
                    getRootProps,
                    acceptedFile,
                    ProgressBar,
                    getRemoveFileProps,
                  }) => (
                    <>
                      <div className='w-full'>
                        <label
                          className='cursor-pointer bg-teal-500 p-2 rounded-md text-white hover:bg-teal-700 w-full text-center'
                          htmlFor='inputTag'
                        >
                          Upload a csv
                          <input
                            {...getRootProps()}
                            className='hidden'
                            id='inputTag'
                          />
                        </label>
                        {acceptedFile && (
                          <div className='pt-1'>
                            <div className='p-1' />
                            <table className='border border-solid table-fixed w-full'>
                              <tr>
                                {csvProperties.map((x) => {
                                  return <th>{x}</th>;
                                })}
                              </tr>
                              <tr>
                                {csvValues.map((x) => {
                                  return <td>{x}</td>;
                                })}
                              </tr>
                            </table>
                            <div className='p-1' />
                            <button
                              className='p-1 bg-red-500 text-white rounded-sm'
                              {...getRemoveFileProps()}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                      <div className='pt-2' />
                      <ProgressBar />
                    </>
                  )}
                </CSVReader>
              </div>
            }
          </Popup>
        )}
      </Map>
    </div>
  );
}
