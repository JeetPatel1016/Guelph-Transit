/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { get } from "../service/api.service";
import PropTypes from "prop-types";

import { socket } from "../socket/config";
import { socketHandlers } from "../socket/event-handlers";

export const DataContext = createContext();

export default function RouteProvider({ children }) {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shape, setShape] = useState(null);
  const [showStops, setShowStops] = useState(true);
  const [stops, setStops] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);

  // Socket connection management
  useEffect(() => {
    socket.connect();
    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (socket.connected) {
      setSocketConnected(true);
    }

    // Cleanup function ro remove all event bindings
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, []);

  // Handling Vehicle Updates
  useEffect(() => {
    const handleVehicleUpdate = (updatedVehicles) => {
      setVehicles(updatedVehicles);
    };
    const cleanup = socketHandlers.setupVehicleListeners(handleVehicleUpdate);

    return cleanup;
  }, []);

  // Fetching Initial Static data from API
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const data = await get("/routes");
      setRoutes(data);
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  // Whenever the selected route chanegs, do the following functions
  useEffect(() => {
    fetchStops();
    fetchShape();
    refreshBusPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoute, socketConnected]);

  // Handlers
  const selectRoute = useCallback(
    (routeId) => {
      if (selectedRoute && routeId === selectedRoute.route_id) {
        selectRoute(null);
        return;
      }
      setSelectedRoute(routes[routeId] ?? null);
    },
    [routes, selectedRoute]
  );
  const toggleShowStops = useCallback(() => {
    setShowStops((prev) => !prev);
  }, []);

  const refreshBusPositions = useCallback(() => {
    if (selectedRoute && socketConnected) {
      socket.emit("bus-position");
    }
  }, [selectedRoute, socketConnected]);

  // Calls for API
  const fetchShape = async () => {
    if (!selectedRoute) {
      setShape(null);
      return;
    }
    const shape = await get(`/routes/${selectedRoute.route_id}/shape`);
    setShape(shape);
  };

  const fetchStops = async () => {
    if (!selectedRoute) {
      setStops(null);
      return;
    }
    const data = await get(`/routes/${selectedRoute.route_id}`);
    setStops(data.route_stops);
  };

  return (
    <DataContext.Provider
      value={{
        routes,
        selectedRoute,
        stops,
        showStops,
        loading,
        shape,
        vehicles,
        selectRoute,
        fetchShape,
        toggleShowStops,
        refreshBusPositions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

RouteProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useDataContext() {
  const context = useContext(DataContext);

  if (context === undefined)
    throw new Error("useDataContext must be used within a DataProvider");

  return context;
}
