document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3300/admin/api/fetchMisc')
    .then(response => response.json())
    .then(data => {
      if (data && data.charges && data.charges.shippingPolicy) {
        // Clean up the data
        let cleanedData = data.charges.shippingPolicy
          .replace(/\|\|/g, "<br>")  // Replace || with <br>
          .replace(/\s+/g, ' ')      // Replace multiple spaces with a single space
          .trim();                   // Remove leading and trailing spaces

        document.getElementById('ShippingPolicy').innerHTML = cleanedData;
      } else {
        console.error('Invalid data structure:', data);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
});
