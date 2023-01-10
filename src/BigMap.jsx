import * as React from "react";
import Map, {
  Source,
  Layer,
  GeolocateControl,
  NavigationControl,
  AttributionControl,
} from "react-map-gl";

import Header from "./Header";
import Sidebar from "./Sidebar";
import VehiclePopup from "./VehiclePopup";

import "maplibre-gl/dist/maplibre-gl.css";
// eslint-disable-next-line import/no-webpack-loader-syntax
import maplibregl from "!maplibre-gl";
import maplibreglWorker from "maplibre-gl/dist/maplibre-gl-csp-worker";
maplibregl.workerClass = maplibreglWorker;

function BigMap() {
  const [vehicles, setVehicles] = React.useState({});

  const [loading, setLoading] = React.useState(false);

  const [vehiclePositions, setVehiclePositions] = React.useState(null);

  const [clickedVehicleId, setClickedVehicleId] = React.useState(null);


  const [cursor, setCursor] = React.useState(null);

  const onMouseEnter = React.useCallback(() => {
    setCursor("pointer");
  }, []);

  const onMouseLeave = React.useCallback(() => {
    setCursor(null);
  }, []);

  const onClick = (evt) => {
    if (evt.features.length) {
      setClickedVehicleId(evt.features[0].id);
    }
  };

  const loadVehicles = () => {
    // setLoading(true);
    let url = "/vehicle_positions.json";

    fetch(url).then((response) => {
      response.json().then((data) => {
        setVehicles(
          Object.assign({}, ...data.items.entity.map((item) => ({[item.id]: item})))
        );
        // setLoading(false);
      });
    });
  };

  const [trip, setTrip] = React.useState();

  const loadTrip = () => {
    let item = vehicles[clickedVehicleId];

    if (item && item.vehicle.trip) {
      let url = `http://localhost:8001/tfwm/trips/${item.vehicle.trip.tripId}.json`;

      fetch(url).then((response) => {
        response.json().then((data) => {
          setTrip(data);
        });
      });
    }
  };

  // Similar to componentDidMount and componentDidUpdate:
  React.useEffect(() => {
    // Update the document title using the browser API
    loadTrip();
  }, [clickedVehicleId]);

  const vehiclesList = Object.values(vehicles);
  const clickedVehicle = clickedVehicleId ? vehicles[clickedVehicleId] : null;

  const layerStyle = {
    id: "vehicles",
    type: "circle",
    paint: {
      "circle-color": "#9b1f20",
      "circle-opacity": .6,
      "circle-radius": 5,
      // {
      //   'base': 1.75,
      //   'stops': [
      //     [11, 2],
      //     [22, 180]
      //   ]
      // },
    },
  };

  let clickedTrip = clickedVehicle && trip && clickedVehicle.vehicle.trip && clickedVehicle.vehicle.trip.tripId == trip.id && trip;

  return (
    <React.Fragment>
      <Header>{clickedVehicleId}</Header>
      <Map
        initialViewState={{
          longitude: -2,
          latitude: 52.5,
          zoom: 10
        }}
        onLoad={loadVehicles}
        style={{ position: "absolute", top: 52, height: "auto", bottom: 0, width: "auto" }}

        mapStyle="https://api.os.uk/maps/vector/v1/vts/resources/styles?key=b45dBXyI0RA7DGx5hcftaqVk5GFBUCEY"
        maxBounds={
          [
            [ -10.76418, 49.528423 ],
            [ 1.9134116, 61.331151 ]
          ]
        }
        minZoom={6}
        maxZoom={18}
        transformRequest={(url) => {
          return {
            url: url + '&srs=3857'
          };
        }}

        interactiveLayerIds={['vehicles']}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        cursor={cursor}

        hash={true}
        mapLib={maplibregl}
        RTLTextPlugin={null}
      >
        <NavigationControl showCompass={false} />
        <GeolocateControl />
        { clickedVehicle ? (
          <VehiclePopup
            item={clickedVehicle}
            onClose={() => setClickedVehicleId(null)}
          />
        ) : null}
        <Source
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: vehiclesList.map((item) => {

              return {
                type: "Feature",
                id: item.id,
                geometry: {
                  type: "Point",
                  coordinates: [item.vehicle.position.longitude, item.vehicle.position.latitude],
                },
                properties: item.vehicle
              };
            })
          }}
        >
          <Layer {...layerStyle} />
        </Source>

        { clickedTrip ? <Source
            type="geojson"
            data={{
              type: "Feature",
              geometry: {
                type: "LineString",
                  coordinates: trip.shape
                },
              }}
            >
              <Layer type="line" paint={{ "line-width": 2, "line-color": "#9b1f20" }} />
          </Source>
        : null }


        <AttributionControl customAttribution="&copy; Ordnance Survey" />
      </Map>
      { clickedTrip ? <Sidebar item={clickedVehicle} trip={trip} onClose={() => setClickedVehicleId(null)} /> : null }
    </React.Fragment>
  );
}

export default BigMap;
