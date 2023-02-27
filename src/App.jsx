import { useCallback, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { Map, Source, Layer, Popup } from "react-map-gl";
import * as csv from "csvtojson";

export default function App() {
  const [data, setData] = useState(null);
  const [cursor, setCursor] = useState("auto");
  const [showPopup, setShowPopup] = useState(false);
  const [popUpCoordinate, setPopUpCoordinate] = useState({});

  const handleOnChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event) => {
      const geoData = event.currentTarget.result;
      const geoJsonObj = JSON.parse(geoData);
      console.log(geoJsonObj);
      setData(geoJsonObj);
    };
  };

  const handleCsvUpload = (e) => {
    const file = e;
    csv()
      .fromFile(file)
      .then((jsonObj) => {
        console.log(jsonObj);
      });
    // console.log(file);
  };

  const handleClick = (e) => {
    setShowPopup(!showPopup);
    setPopUpCoordinate({
      lng: e.lngLat.lng,
      lat: e.lngLat.lat,
    });
    console.log(e);
  };

  const popUpAttributes = {
    longitude: popUpCoordinate.lng,
    latitude: popUpCoordinate.lat,
  };

  const buildingStyle = {
    id: "buildings",
    type: "fill",
    paint: {
      "fill-color": "#3a3a3a",
      "fill-opacity": 0.5,
    },
  };

  return (
    <div className="absolute top-0 left-0 h-full w-full">
      <input type="file" onChange={handleOnChange} />
      <Map
        initialViewState={{
          longitude: -75.72,
          latitude: 45.18,
          zoom: 10,
        }}
        mapLib={maplibregl}
        mapStyle="https://api.maptiler.com/maps/basic/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
        onMouseEnter={() => {
          setCursor("pointer");
          console.log("Hovered");
        }}
        onMouseLeave={() => setCursor("auto")}
        interactiveLayerIds={["buildings"]}
        cursor={cursor}
        onClick={handleClick}
      >
        <Source type="geojson" data={data}>
          <Layer {...buildingStyle} />
        </Source>
        {showPopup && (
          <Popup {...popUpAttributes}>
            {
              <div>
                <label
                  className="cursor-pointer bg-teal-500 p-2 rounded-md text-white hover:bg-teal-700"
                  htmlFor="inputTag"
                >
                  Upload a csv
                  <input
                    className="hidden"
                    id="inputTag"
                    type="file"
                    onChange={handleCsvUpload}
                  />
                </label>
              </div>
            }
          </Popup>
        )}
      </Map>
    </div>
  );
}
