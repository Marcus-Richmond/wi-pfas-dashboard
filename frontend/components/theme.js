// import MapLibre map
import { MAPTILER_KEY } from '../config.js'; 
import { map } from './map.js';

// get theme selector
const themeSelect = document.getElementById('theme-select')

// create basemap style object
const basemapStyles = {
    dark: 'dataviz-v4-dark',
    light: 'dataviz-v4-light',
    warm: 'dataviz-v4-light'
}

// add event listener for change
themeSelect.addEventListener('change', () => {
    // change data-theme attribute to selected theme value
    document.documentElement.dataset.theme = themeSelect.value

    // get the basemap style from the object
    const basemapStyle = basemapStyles[themeSelect.value]

    // build basemap url
    const styleURL = `https://api.maptiler.com/maps/${basemapStyle}/style.json?key=${MAPTILER_KEY}`

    // set basemap url
    map.setStyle(styleURL, {diff: false})
})