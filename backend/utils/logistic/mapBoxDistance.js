// const mapbox = require('mapbox');
// const axios= require('axios')

// Function to calculate distance using Mapbox API
// exports.calculateDistanceWithMapbox = async (lat1, lon1, lat2, lon2) => {
//     // Initialize Mapbox client with your API key
//     console.log(lat1, lon1, lat2, lon1)
//     const MAPBOX_API_KEY = 'pk.eyJ1IjoiYXJhZGh5YTM0NTUiLCJhIjoiY2x2cnp4NDNlMGw3MzJrbnkyMmFxeHd0cCJ9.--vWGJ4FJjDdHZn7mAEDwg';
//     const mapboxClient = mapbox({ accessToken: MAPBOX_API_KEY });

//     try {
//         // Make a request to the Mapbox Directions API
//         const response = await mapboxClient.directions({
//             waypoints: [
//                 { coordinates: [lon1, lat1] }, // Origin
//                 { coordinates: [lon2, lat2] }  // Destination
//             ],
//             profile: 'driving',        // Specify driving profile
//             geometries: 'geojson',     // Get route as GeoJSON
//             steps: true               // Include step-by-step instructions
//         }).send();

//         // Extract distance from the response
//         const distance = response.body.routes[0].distance;

//         // Convert distance from meters to kilometers
//         const distanceInKm = distance / 1000;

//         return distanceInKm;
//     } catch (error) {
//         console.error('Error calculating distance with Mapbox:', error.message);
//         throw new Error('Error calculating distance with Mapbox');
//     }
// }


// exports.calculateShortestDistance =  async(apiToken, start, end) => {
//     try {
//         const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}`;
//         const params = {
//             access_token: apiToken
//         };
//         const response = await axios.get(url, { params });
//         console.log(response)
//         const data = response.data;

//         // if (!data.routes || data.routes.length === 0) {
//         //     throw new Error('No routes found.');
//         // }

//         // let shortestDistance = Infinity;
//         // data.routes.forEach(route => {
//         //     shortestDistance = Math.min(shortestDistance, route.distance);
//         // });

//         return data;
//     } catch (error) {
//         console.error('Error:', error);
//         return null;
//     }
// }

// exports.calculateShortestDistance =  async(apiToken, start, end) => {
//     try {
//         const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}`;
//         const params = {
//             access_token: apiToken
//         };
//         const response = await axios.get(url, { params });
//         console.log(response)
//         const data = response.data;

//         // if (!data.routes || data.routes.length === 0) {
//         //     throw new Error('No routes found.');
//         // }

//         // let shortestDistance = Infinity;
//         // data.routes.forEach(route => {
//         //     shortestDistance = Math.min(shortestDistance, route.distance);
//         // });

//         return data;
//     } catch (error) {
//         console.error('Error:', error);
//         return null;
//     }
// }

// const axios = require('axios');

// exports.calculateShortestDistance = async (apiToken, start, end) => {
//     try {
//         const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}`;
//         const params = {
//             access_token: apiToken
//         };
//         const response = await axios.get(url, { params });

//         if (response.data && response.data.distances && response.data.distances.length > 0) {
//             // Assuming the response contains distances in meters
//             const shortestDistance = response.data.distances[0][0];
//             // You can also get details of the places from their coordinates using reverse geocoding
//             const startPlaceDetails = await getPlaceDetails(start);
//             const endPlaceDetails = await getPlaceDetails(end);

//             return {
//                 shortestDistance,
//                 startPlace: startPlaceDetails,
//                 endPlace: endPlaceDetails
//             };
//         } else {
//             throw new Error('No distance information found.');
//         }
//     } catch (error) {
//         throw new Error(`Error calculating shortest distance: ${error.message}`);
//     }
// };

// // Function to get place details using reverse geocoding
// async function getPlaceDetails(coordinates) {
//     try {
//         const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json`;
//         const params = {
//             access_token: apiToken
//         };
//         const response = await axios.get(url, { params });

//         if (response.data && response.data.features && response.data.features.length > 0) {
//             const placeDetails = response.data.features[0];
//             return {
//                 name: placeDetails.place_name,
//                 coordinates
//             };
//         } else {
//             throw new Error('No place details found.');
//         }
//     } catch (error) {
//         throw new Error(`Error getting place details: ${error.message}`);
//     }
// }
