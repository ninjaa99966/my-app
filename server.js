const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/auth', (req, res) => {
  const code = req.query.code;
  if (!code) return res.send('Nessun codice ricevuto da Strava');

  // Reindirizza all'app Flutter con schema custom
  res.redirect(`gearpilot://auth?code=${code}`);
});

app.listen(PORT, () => console.log(`Server in ascolto sulla porta ${PORT}`));
