import { useCallback, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { Map, Source, Layer, Popup } from "react-map-gl";
import axios from "axios";
import geoJsonData from "./api/geojson";

export default function App() {
  const [data, setData] = useState(null);
  const [footprint, setFootprint] = useState(null);
  const [cursor, setCursor] = useState("auto");
  const [showPopup, setShowPopup] = useState(false);
  const [popUpCoordinate, setPopUpCoordinate] = useState({});
  const [zoningInfo, setZoningInfo] = useState({});

  useEffect(() => {
    //   axios.get(geoJsonData.zoning).then((response) => {
    //     const resp = response.data;
    //     console.log(resp);
    //     setData(resp);
    //   });
    //   axios.get(geoJsonData.buildingFootprints).then((response) => {
    //     const resp = response.data;
    //     setFootprint(resp);
    //   });
  }, []);

  const handleOnChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event) => {
      const geoData = event.currentTarget.result;
      console.log(geoData);
    };
  };

  const buildingStyle = {
    id: "buildings",
    type: "fill",
    paint: {
      "fill-color": "#3a3a3a",
      "fill-opacity": 0.5,
    },
  };

  const footprintStyle = {
    id: "footprint",
    type: "fill",
    paint: {
      "fill-color": "red",
    },
  };

  const handleClick = (event) => {
    const featureObj = event.features;
    const layerProperties = featureObj[0].properties;
    setZoningInfo({
      ...zoningInfo,
      zoneCode: layerProperties.ZONE_CODE,
      zoneMain: layerProperties.ZONE_MAIN,
    });
    setPopUpCoordinate({
      ...popUpCoordinate,
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    });
    setShowPopup(!showPopup);
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
        onClick={handleClick}
        interactiveLayerIds={["buildings"]}
        cursor={cursor}
      >
        <Source type="geojson" data={data}>
          {/* <Layer
            id="boundary"
            type="line"
            paint={{ "line-color": "#111", "line-width": 0.5 }}
          /> */}
          <Layer {...buildingStyle} />
        </Source>
        {/* <Source type="geojson" data={footprint}>
          <Layer {...footprintStyle} />
        </Source> */}
        {showPopup && (
          <Popup
            longitude={popUpCoordinate.longitude}
            latitude={popUpCoordinate.latitude}
          >
            <div className="grid grid-rows-1 grid-flow-col gap-2 text-lg p-4">
              <ul className="text-right ">
                <li>Zone:</li>
                <li>Zone Code:</li>
              </ul>
              <ul className="text-orange-700">
                <li>{zoningInfo.zoneMain}</li>
                <li>{zoningInfo.zoneCode}</li>
              </ul>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
