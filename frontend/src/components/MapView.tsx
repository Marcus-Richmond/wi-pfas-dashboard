import { useRef } from "react";

function MapView () {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    return (
        <div
            ref={mapContainerRef}
            style={{ height: 500, backgroundColor: "#e5e7eb" }}
        />
    )
}

export default MapView;