import { Settings2 } from "lucide-react";
import { useDataContext } from "../../context/DataContext";
import { ScrollArea, Tabs } from "@mantine/core";
export default function RouteMenu() {
  const { routes, selectedRoute, selectRoute } = useDataContext();
  return (
    <>
      <Tabs className="p-4" defaultValue={"routes"} color="teal">
        <Tabs.List>
          <Tabs.Tab value="routes">Routes</Tabs.Tab>
          <Tabs.Tab className="ml-auto" value="settings">
            <Settings2 size={16} className="text-neutral-500" />
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="routes">
          <ScrollArea className="h-[200px] md:h-[500px]">
            {Object.entries(routes).map(([route_id, route_details], index) => (
              <div
                // style={{ backgroundColor: `#${route_details.route_color}` }}
                className="flex my-3 items-center gap-4 cursor-pointer"
                key={index}
                onClick={() => selectRoute(route_id)}
              >
                <button
                  className={`w-20 rounded-md cursor-pointer border border-gray-300 px-3 py-1 transition-all text-ellipsis overflow-hidden whitespace-nowrap`}
                  style={{
                    backgroundColor:
                      route_id === selectedRoute?.route_id
                        ? "#" + route_details.route_color + "BF"
                        : "",
                    color:
                      route_id === selectedRoute?.route_id ? "white" : "black",
                  }}
                >
                  {route_details.route_short_name}
                </button>
                <p
                  className="text-lg "
                  style={{
                    color: `#${
                      route_id === selectedRoute?.route_id
                        ? route_details.route_color
                        : "404040"
                    }`,
                  }}
                >
                  {route_details.route_long_name}
                </p>
              </div>
            ))}
          </ScrollArea>
          <div className="flex flex-col bg-red-400 overflow-auto h-full"></div>
        </Tabs.Panel>
        <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
      </Tabs>
    </>
  );
}
