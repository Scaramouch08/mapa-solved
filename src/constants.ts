export const MAP_CENTER: [number, number] = [-48.444, -1.381111];
export const MAP_ZOOM = 3;

export const GEOJSON_URL = 'https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo+json&intrarregiao=municipio';
export const LOCALIDADES_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios';

export const MVT_URL = 'http://simaveg.solved.eco.br/geoserver/gwc/service/tms/1.0.0/SIMAVEG:alerts_geo@EPSG:900913@pbf/{z}/{x}/{y}.pbf';
export const WMS_URL = 'http://simaveg.solved.eco.br/geoserver/SIMAVEG/wms?service=WMS&version=1.1.1&request=GetMap&layers=SIMAVEG:alerts_geo&styles=&format=image/png&transparent=true&srs=EPSG:3857&width=256&height=256&bbox={bbox-epsg-3857}';
