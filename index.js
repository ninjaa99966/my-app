const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch@2
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const CLIENT_ID = '184108'; // il tuo client ID Strava
const CLIENT_SECRET = 'd2a2f349f024c448ef083a8c50e57f6f32992de4'; // il tuo client secret Strava

app.post('/exchange_token', async (req, res) => {
  const code = req.body.code;
  if (!code) return res.status(400).json({ error: 'Code mancante' });

  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code'
      })
    });

    const data = await response.json();
    res.json({ access_token: data.access_token });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server attivo su http://localhost:${PORT}`));
