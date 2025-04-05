import { ArrowRight, RotateCcw, Search } from "lucide-react";
import "./App.css";
import MapComponent from "./components/MapComponent";
import RouteMenu from "./components/Routes/RouteMenu";
import { useDataContext } from "./context/DataContext";
import { Switch, Input, Button } from "@mantine/core";
function App() {
  const { toggleShowStops, showStops, refreshBusPositions } = useDataContext();
  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row h-screen">
        <div className="flex flex-col w-full min-h-fit h-1/3 lg:w-1/4 lg:h-full">
          <div className="flex gap-4 p-4 justify-between items-center">
            <p className="text-xl font-bold text-neutral-700">GuelphTracks</p>
            <button
              onClick={refreshBusPositions}
              className="appearance-none cursor-pointer hover:bg-gray-100 rounded-full p-1"
            >
              <RotateCcw size={20} className="m-1 text-neutral-700" />
            </button>
          </div>
          <div className="mx-4 flex gap-2 items-stretch">
            <Input
              leftSection={<Search size={16} />}
              variant={"filled"}
              placeholder={"Search"}
              radius={"xs"}
              className="grow"
              color="teal"
            />
            <Button size="sm" color="teal">
              <ArrowRight size={16} />
            </Button>
          </div>
          <RouteMenu />
          <div className="flex items-center gap-3 mt-auto p-4">
            <Switch
              color="teal"
              className=""
              checked={showStops}
              onChange={toggleShowStops}
            />
            <p>Show Stops</p>
          </div>
        </div>
        <div className="bg-gray-500 lg:w-3/4 h-2/3 lg:h-full border-l rounded-b-2xl lg:rounded-br-none lg:rounded-l-2xl overflow-hidden border-gray-300">
          <MapComponent />
        </div>
      </div>
    </>
  );
}

export default App;
