function addLocations(map, apiBaseUrl) {
    map.addSource('locations', {
        type: 'geojson',
        data: `${apiBaseUrl}/locations/`
    })

    map.addLayer({
        'id': 'locations',
        'type': 'circle',
        'source': 'locations',
        'paint': {
            'circle-color': '#ffffff',
            'circle-stroke-color': '#000000',
            'circle-stroke-width': 0.5,
            'circle-radius': 3,
        },
    })
}