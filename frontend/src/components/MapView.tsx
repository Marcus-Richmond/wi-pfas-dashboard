import { useEffect, useRef } from "react";
import { Map, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

setWorkerUrl(workerUrl);

function MapView () {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = mapContainerRef.current;

        if (!container) {
            return;
        }

        // create maplibre map
        const map = new Map({
            container: container,
            style: "https://tiles.openfreemap.org/styles/positron",
            center: [-89.5, 44.5],
            zoom: 5.5,
        });

        // once map is loaded, display ready message
        map.on("load", () => {
            console.log("Map is ready for sampling locations");

            // add layer source
            map.addSource("sampling-locations", {
                type: "geojson",
                data: "https://wi-pfas-api.onrender.com/api/locations/",
            });

            // add layer data
            map.addLayer({
                id: "sampling-location-points",
                type: "circle",
                source: "sampling-locations",
            });
        });

        // remove map on close
        return () => {
            map.remove();
        };
    }, []);

    return (
        <div
            ref={mapContainerRef}
            style={{ height: 500, backgroundColor: "#e5e7eb" }}
        />
    )
}

export default MapView;