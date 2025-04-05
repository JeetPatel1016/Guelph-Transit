import { socket } from "./config";
const setupVehicleListeners = (onVehicleUpdate) => {
  socket.on("bus-position", (data) => {
    onVehicleUpdate(data);
  });
  return () => socket.off("bus-position");
};

export const socketHandlers = {
  setupVehicleListeners,
};
