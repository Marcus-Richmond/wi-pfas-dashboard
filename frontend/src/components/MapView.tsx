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

        const map = new Map({
            container: container,
            style: "https://demotiles.maplibre.org/style.json",
            center: [-89.5, 44.5],
            zoom: 5.5,
        });

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