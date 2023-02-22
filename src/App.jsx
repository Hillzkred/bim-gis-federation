import { createRef, useEffect, useMemo, useState } from "react";
import maplibregl from "maplibre-gl";
import { Map, Source, Layer } from "react-map-gl";
import axios from "axios";

const geoData =
  "https://maps.ottawa.ca/arcgis/rest/services/Zoning/MapServer/3/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryPolygon&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson";

export default function App() {
  const [data, setData] = useState(null);
  useEffect(() => {
    axios.get(geoData).then((response) => {
      const resp = response.data;
      setData(resp);
    });
  }, []);

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
      <Map
        initialViewState={{
          longitude: -76.4877121946961,
          latitude: 44.25898181448393,
          zoom: 12,
        }}
        mapLib={maplibregl}
        mapStyle="https://api.maptiler.com/maps/basic/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
      >
        <Source type="geojson" data={data}>
          <Layer {...buildingStyle} />
          <Layer
            id="boundary"
            type="line"
            paint={{ "line-color": "yellow", "line-width": 0.5 }}
          />
        </Source>
      </Map>
    </div>
  );
}
