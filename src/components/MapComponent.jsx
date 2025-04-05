import Map, {
  Layer,
  Source,
  NavigationControl,
  Marker,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useDataContext } from "../context/DataContext";
import { useEffect, useRef, useState } from "react";
import { BusFront } from "lucide-react";
import bbox from "@turf/bbox";
import { lineString } from "@turf/helpers";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;
const MAPBOX_STYLE = import.meta.env.VITE_MAPBOX_STYLE;

function generatePaintStyle(color) {
  return {
    "line-color": {
      stops: [[0, color ?? "#000"]],
    },
    "line-width": ["interpolate", ["linear", 0.5], ["zoom"], 10, 4, 20, 5],
  };
}

export default function MapComponent() {
  const { vehicles, stops, showStops, shape, selectedRoute } = useDataContext();
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({
    latitude: 43.541944,
    longitude: -80.245671,
    zoom: 12,
  });

  useEffect(() => {
    if (shape && shape.length > 0 && mapRef.current) {
      const line = lineString(shape.flat()); // Flatten in case of MultiLineString
      const [minLng, minLat, maxLng, maxLat] = bbox(line);

      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: 50,
          duration: 500,
        }
      );
    }
  }, [shape]);

  return (
    <>
      <Map
        ref={mapRef}
        {...viewState}
        mapStyle={MAPBOX_STYLE}
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={["data"]}
        onMove={(evt) => setViewState(evt.viewState)}
      >
        <NavigationControl />

        {selectedRoute &&
          vehicles
            .filter((vehicle) => vehicle.routeId === selectedRoute.route_id)
            .map((vehicle) => (
              <Marker
                key={vehicle.id}
                longitude={vehicle.coordinates[0]}
                latitude={vehicle.coordinates[1]}
                className="z-50"
              >
                <div
                  style={{ boxShadow: `0 4px 15px -2px #0000007F` }}
                  className="bg-white rounded-full p-2"
                >
                  <BusFront
                    style={{
                      color: `#${selectedRoute.route_color}`,
                    }}
                    className="place-items-center"
                  />
                </div>
              </Marker>
            ))}

        {shape && selectedRoute && (
          <Source
            id="route"
            type="geojson"
            lineMetrics={true}
            data={{
              type: "MultiLineString",
              coordinates: shape,
            }}
          >
            <Layer
              id="route-fill"
              type="line"
              paint={generatePaintStyle(`#${selectedRoute.route_color}`)}
              beforeId={"stop-fill"}
            />
          </Source>
        )}

        {stops && showStops && selectedRoute && (
          <Source
            id="stops"
            type="geojson"
            data={{
              type: "MultiPoint",
              coordinates: stops.map((stop) => [stop.stop_lon, stop.stop_lat]),
            }}
          >
            <Layer
              id="stop-fill"
              type="circle"
              source="stops"
              paint={{
                "circle-color": "white",
                "circle-stroke-color": `#${selectedRoute.route_color}`,
                "circle-radius": [
                  "interpolate",
                  ["linear", 0.5],
                  ["zoom"],
                  10,
                  3,
                  20,
                  4,
                ],
                "circle-stroke-width": [
                  "interpolate",
                  ["linear", 0.5],
                  ["zoom"],
                  10,
                  2,
                  20,
                  4,
                ],
                "circle-opacity": 0.8,
              }}
            />
          </Source>
        )}
      </Map>
    </>
  );
}
