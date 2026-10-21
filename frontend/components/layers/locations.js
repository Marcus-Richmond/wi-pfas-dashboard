export function addLocations(map, apiBaseUrl) {
    // get CSS variables
    const cssVariables = window.getComputedStyle(document.documentElement)

    const locations_fill = cssVariables.getPropertyValue('--location-fill');
    const locations_outline = cssVariables.getPropertyValue('--location-outline');
    
    
    map.addSource('locations', {
        type: 'geojson',
        data: `${apiBaseUrl}/locations/`
    })

    map.addLayer({
        'id': 'locations',
        'type': 'circle',
        'source': 'locations',
        'paint': {
            'circle-color': locations_fill,
            'circle-stroke-color': locations_outline,
            'circle-stroke-width': 0.5,
            'circle-radius': 3,
        },
    })
}