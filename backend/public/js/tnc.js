document.addEventListener('DOMContentLoaded', async() => {
    await fetch('http://localhost:3300/admin/api/fetchMisc', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
  })
    .then(response => response.json())
    .then(data => {
      // Check if data and charges.privacyPolicy exist
        if (data && data.charges && data.charges.tnc) {
          console.log(data.charges.tnc.replace(/\|\|/g, "<br>"))
        document.getElementById('tnc').innerHTML = data.charges.tnc.replace(/\|\|/g, "<br>");
      } else {
        console.error('Invalid data structure:', data);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
});
