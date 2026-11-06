import { map } from '../map.js'

// get layer list html elements
const layerList = document.getElementById("list1")

// loop through layer list 
//    example:
//    for (const [key, value] of Object.entries(object)) {}
for (const [index, item] of Object.entries(layerList.children)) {
    // get name of layer from ID of list item html element
    const layerName = item.id

    // get locations toggle
    const layerToggle = document.getElementById('toggle-' + layerName)

    // create function to update visibility
    function updateVisibility() {
        // get map layer
        const layerIncluded = map.getLayer(layerName)

        // if the layer is in the map
        if (layerIncluded) {
            // create variable to store visibility
            //    example:
            //    var myVariable = (true condition) ? "true" : "false"

            // define visibility variable
            const visibility = (layerToggle.checked) ? "visible" : "none"
            
            // set layer visibility
            map.setLayoutProperty(layerName, 'visibility', visibility)
        }
        // if the layer is not in the map, do nothing
        else
            return 
    }

    // add change listener for locations toggle
    layerToggle.addEventListener('change', updateVisibility)

    // run function when style is loaded (i.e. basemap is reloaded/changed)
    map.on('style.load', updateVisibility)

    // console.log(locationsToggle)
}