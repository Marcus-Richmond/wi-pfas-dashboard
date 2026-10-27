export function addPFASsites(map, apiBaseUrl) {
    map.addSource('PFASsites', {
        type: 'geojson',
        data: `${apiBaseUrl}/PFASsites/`
    })

    map.addLayer({
        'id': 'PFASsites',
        'type': 'circle',
        'source': 'PFASsites',
        'paint': {
            'circle-color': '#d71414',
            'circle-stroke-color': '#280a0a',
            'circle-stroke-width': 0.5,
            'circle-radius': 3,
        },
    })
}