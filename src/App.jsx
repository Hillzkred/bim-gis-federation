import { createRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";

export default function App() {
  const [viewer, setViewer] = useState();
  const ifcContainer = createRef();

  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      style: "https://demotiles.maplibre.org/style.json",
      center: [-100.04, 38.907],
      zoom: 3,
    });

    map.on("load", () => {
      map.addSource("states", {
        type: "geojson",
        data: "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson",
      });
      map.addLayer({
        id: "states-layer",
        type: "fill",
        source: "states",
        paint: {
          "fill-color": "#f5a2bb",
          "fill-outline-color": "rgba(200, 100, 240, 1)",
          "fill-opacity": 0.5,
        },
      });
    });
  }, []);

  return (
    <div id="map" className="absolute top-0 left-0 h-full w-full">
      <div>
        {/* <input type='file' id='file' accept='.ifc' onChange={ifcOnLoad} /> */}
      </div>
      {/* <IfcContainer ref={ifcContainer} viewer={viewer} /> */}
    </div>
  );
}
