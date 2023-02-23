const geoJsonData = {
  zoning:
    'https://maps.ottawa.ca/arcgis/rest/services/Zoning/MapServer/3/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryPolygon&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Meter&relationParam=&outFields=BYLAW_NUM%2CHEIGHT%2CHISTORY%2CZONE_CODE%2CZONE_MAIN%2CZONINGTYPE&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=*&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson',
  buildingFootprints:
    'https://maps.ottawa.ca/arcgis/rest/services/TopographicMapping/MapServer/3/query?outFields=*&where=1%3D1&f=geojson',
};

export default geoJsonData;
