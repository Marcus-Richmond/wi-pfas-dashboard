export function addPFASsites(map, apiBaseUrl) {
    // get CSS variables
    const cssVariables = window.getComputedStyle(document.documentElement)

    const locations_fill = cssVariables.getPropertyValue('--pfassites-fill');
    const locations_outline = cssVariables.getPropertyValue('--pfassites-outline');


    map.addSource('PFASsites', {
        type: 'geojson',
        data: `${apiBaseUrl}/PFASsites/`
    })

    map.addLayer({
        'id': 'PFASsites',
        'type': 'circle',
        'source': 'PFASsites',
        'paint': {
            'circle-color': locations_fill,
            'circle-stroke-color': locations_outline,
            'circle-stroke-width': 0.5,
            'circle-radius': 3,
        },
    })
}