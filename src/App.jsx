import { createRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { Map } from "react-map-gl";

export default function App() {
  return (
    <div className="absolute top-0 left-0 h-full w-full">
      <Map
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3.5,
        }}
        mapLib={maplibregl}
        mapStyle="https://demotiles.maplibre.org/style.json"
      />
    </div>
  );
}
