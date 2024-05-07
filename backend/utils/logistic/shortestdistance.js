// // exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
// //   const R = 6371; // Radius of the Earth in km
// //   const dLat = toRadians(lat2 - lat1);
// //   const dLon = toRadians(lon2 - lon1);
// //   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
// //             Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
// //             Math.sin(dLon / 2) * Math.sin(dLon / 2);
// //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// //   const distance = R * c;
// //   return distance;
// // }

// // function toRadians(degrees) {
// //   return degrees * Math.PI / 180;
// // }


// const axios = require('axios');

// async function calculateShortestDistance(apiToken, start, end) {
//   try {
//     const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}`;
//     const params = {
//       access_token: apiToken,
//       geometries: 'geojson'
//     };
//     const response = await axios.get(url, { params });
//     const data = response.data;

//     if (!data.routes || data.routes.length === 0) {
//       throw new Error('No routes found.');
//     }

//     let shortestDistance = Infinity;
//     data.routes.forEach(route => {
//       shortestDistance = Math.min(shortestDistance, route.distance);
//     });

//     return shortestDistance;
//   } catch (error) {
//     console.error('Error:', error.message);
//     return null;
//   }
// }

// const apiToken = 'your_mapbox_api_token';
// const start = [-73.9857, 40.7484]; // Example coordinates for New York City
// const end = [-74.0060, 40.7128];   // Example coordinates for New York City

// calculateShortestDistance(apiToken, start, end)
//   .then(shortestDistance => {
//     if (shortestDistance !== null) {
//       console.log('Shortest distance:', shortestDistance, 'meters');
//     } else {
//       console.log('Failed to calculate shortest distance.');
//     }
//   })
//   .catch(error => {
//     console.error('Error:', error.message);
//   });
