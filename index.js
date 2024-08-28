const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

const API_KEY = process.env.API_KEY;


app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Weather App</title>
        <link rel="stylesheet" type="text/css" href="/styles.css">
      </head>
      <body>
        <div class="container">
          <h1>Weather App</h1>
          <form action="/weather" method="get">
            <input type="text" name="address" placeholder="Enter city name" required>
            <button type="submit">Get Weather</button>
          </form>
          <div id="weatherResult">
            ${req.query.message || ''}
          </div>
        </div>
      </body>
    </html>
  `);
});

app.get('/weather', async (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.redirect('/?message=Please%20enter%20a%20city%20name.');
  }

  const url = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${encodeURIComponent(address)}`;
  console.log(url);

  try {
    const response = await axios.get(url);
    const data = response.data;
    
    if (data.error) {
      return res.redirect('/?message=' + encodeURIComponent('Error: ' + data.error.info));
    }
    
    const cityName = data.location.name;
    const temperature = data.current.temperature;
    const weatherDescription = data.current.weather_descriptions[0];
    const message = `City Name: ${cityName}<br>Temperature: ${temperature}&deg;C<br>Weather: ${weatherDescription}`;

    res.redirect('/?message=' + encodeURIComponent(message));
  } catch (error) {
    console.error(error);
    res.redirect('/?message=Error%20occurred%20while%20fetching%20weather%20data.');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
