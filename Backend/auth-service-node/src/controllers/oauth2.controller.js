const { handleOAuth2Callback } = require('../services/oauth2.service');

exports.callback = async (req, res) => {
  const { provider } = req.params;
  const { code } = req.query;

  try {
    const response = await handleOAuth2Callback(provider, code);

    const params = new URLSearchParams({
      token: response.token,
      userId: response.userId,
      email: response.email,
      firstName: response.firstName || '',
      role: response.role,
    });

    const redirectUrl = `${process.env.FRONTEND_URL}/auth/oauth2/success?${params.toString()}`;

    return res.send(`<!DOCTYPE html><html><head><title>Redirection...</title></head>
      <body><p>Connexion réussie! Redirection en cours...</p>
      <script>window.location.href = '${redirectUrl}';</script>
      </body></html>`);
  } catch (err) {
    console.error('Erreur OAuth2 callback:', err.message);
    const errorUrl = `${process.env.FRONTEND_URL}/auth/sign-in?error=${encodeURIComponent(err.message)}`;
    return res.send(`<!DOCTYPE html><html><head><title>Erreur</title></head>
      <body><p>Erreur lors de la connexion. Redirection...</p>
      <script>window.location.href = '${errorUrl}';</script>
      </body></html>`);
  }
};
