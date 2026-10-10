// imports
import * as config from "../config.js";
import { addLocations } from "./layers/locations.js";

// configure api base URL
const API_BASE_URL = (config.API_BASE_URL ?? "http://127.0.0.1:8000/api").replace(/\/$/, "");

// get maptiler key
const { MAPTILER_KEY } = config;

// define basemap

// dataviz dark
const map_style_dataviz_dark = 'dataviz-v4-dark'

// custom basemap
// const map_style = '019df9d7-0722-7629-bb66-3ad2ae71c49b'
const map_style = '019df9ad-d703-7b48-90f6-d5b66ddf36fb'

// define maptiler url
const map_source = `https://api.maptiler.com/maps/${map_style_dataviz_dark}/style.json?key=${MAPTILER_KEY}`

export const map = new maplibregl.Map({
    container: 'map', // container id
    style: map_source, // style URL
    center: [-90, 45], // starting position [lng, lat]
    zoom: 4.5 // starting zoom
});

// load locations layer
map.on('load', function() {
    addLocations(map, API_BASE_URL);
})