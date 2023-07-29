const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const clientId = '3ac3185b6a50d3be2703';
const clientSecret = 'a040697283f7e450c49c199a7ccb4da048cebca2';

app.get('/login', (req, res) => {
  const redirectUri = req.query.redirect_uri;
  const githubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;

  res.redirect(githubLoginUrl);
});

// Ruta de redirección después de que el usuario autorice en GitHub
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const accessToken = response.data.access_token;

    // Redirecciona al usuario a la página principal de Proyecto B (contenido protegido)
    res.redirect('/');
  } catch (error) {
    console.error('Error al obtener el token de acceso:', error.message);
    res.status(500).send('Error al obtener el token de acceso.');
  }
});

app.get('/', (req, res) => {
  res.send('Bienvenido al contenido protegido de Proyecto B');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});
