import { map } from '../map.js'

// // get locations toggle
// const locationsToggle = document.getElementById("toggle-locations")

// // function to update location visibility
// function updateLocationVisibility() {
//     // get map layer
//     const layerIncluded = map.getLayer('locations')

//     // if the layer is in the map
//     if (layerIncluded) {
//         // // create variable to store visibility

//         // example assignment
//         // var myVariable = (true condition) ? "true" : "false"

//         // define visibility variable
//         let myVariable = (locationsToggle.checked) ? "visible" : "none"
        
//         // set layer visibility
//         map.setLayoutProperty('locations', 'visibility', myVariable)
//     }
//     // if the layer is not in the map, do nothing
//     else
//         return 
// }

// // add change listener for locations toggle
// locationsToggle.addEventListener('click', () => {
//     // function
//     updateLocationVisibility()
// })


const layerList = document.getElementById("list1")

// console.log(typeof(layerList.children))

// console.log(layerList.children[0].firstElementChild)

// for (const [key, value] of Object.entries(object)) {}

for (const [index, item] of Object.entries(layerList.children)) {
    // // test
    // console.log(index)
    // console.log(item)
    // console.log(item.firstElementChild)

    // get name of layer from ID of list item html element
    const layerName = item.id

    // get locations toggle
    const layerToggle = document.getElementById('toggle-' + layerName)

    // add change listener for locations toggle
    layerToggle.addEventListener('change', () => {
        // get map layer
        const layerIncluded = map.getLayer(layerName)

        // if the layer is in the map
        if (layerIncluded) {
            // // create variable to store visibility

            // example assignment
            // var myVariable = (true condition) ? "true" : "false"

            // define visibility variable
            const visibility = (layerToggle.checked) ? "visible" : "none"
            
            // set layer visibility
            map.setLayoutProperty(layerName, 'visibility', visibility)
        }
        // if the layer is not in the map, do nothing
        else
                return 
    })

    // console.log(locationsToggle)
}