const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const CLIENT_ID = '184108';
const CLIENT_SECRET = 'd2a2f349f024c448ef083a8c50e57f6f32992de4';

app.post('/exchange_token', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code mancante' });
  try {
    const tokenRes = await axios.post('https://www.strava.com/oauth/token', null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code'
      }
    });
    res.json(tokenRes.data); // include access_token, refresh_token etc.
  } catch (err) {
    res.status(500).json({ error: 'Errore scambio token', details: err.message });
  }
});

app.post('/fetch_km', async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ error: 'Token mancante' });
  try {
    const actRes = await axios.get('https://www.strava.com/api/v3/athlete/activities?per_page=30', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const activities = actRes.data;
    // somma i km delle attività di tipo “Ride” (o bici)
    const totalMeters = activities
      .filter(act => act.type === 'Ride')
      .reduce((sum, act) => sum + (act.distance || 0), 0);
    const totalKm = totalMeters / 1000;
    res.json({ totalKm });
  } catch (err) {
    res.status(500).json({ error: 'Errore fetch attività', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server su porta ${PORT}`); });
