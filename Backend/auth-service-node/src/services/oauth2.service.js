const axios = require('axios');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { generateToken } = require('./jwt.service');

const getGoogleUserInfo = async (code) => {
  const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: 'http://localhost:8081/api/auth/oauth2/callback/google',
    grant_type: 'authorization_code',
  });

  const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenRes.data.access_token}` },
  });

  return { email: data.email, name: data.name };
};

const getGithubUserInfo = async (code) => {
  const tokenRes = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: 'http://localhost:8081/api/auth/oauth2/callback/github',
    },
    { headers: { Accept: 'application/json' } }
  );

  const accessToken = tokenRes.data.access_token;
  const headers = { Authorization: `Bearer ${accessToken}` };

  const { data: userBody } = await axios.get('https://api.github.com/user', { headers });

  let email = userBody.email;
  if (!email) {
    const { data: emails } = await axios.get('https://api.github.com/user/emails', { headers });
    const primary = emails.find((e) => e.primary) || emails[0];
    email = primary?.email || null;
  }

  return { email, name: userBody.name };
};

const handleOAuth2Callback = async (provider, code) => {
  let userInfo;

  if (provider === 'google') {
    userInfo = await getGoogleUserInfo(code);
  } else if (provider === 'github') {
    userInfo = await getGithubUserInfo(code);
  } else {
    throw new Error(`Provider OAuth2 non supporté: ${provider}`);
  }

  const { email, name } = userInfo;
  if (!email) throw new Error('Email non fourni par le provider OAuth2');

  let user = await User.findOne({ email });
  if (!user) {
    const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
    user = await User.create({
      email,
      firstName: name || email.split('@')[0],
      password: randomPassword,
      role: 'LEARNER',
      experience: 0,
    });
  }

  const token = generateToken(user.email, {
    role: user.role,
    userId: user._id.toString(),
    oauth2Provider: provider,
  });

  return {
    token,
    userId: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    role: user.role,
    imageBase64: user.image || null,
    experience: user.experience,
    message: 'Connexion OAuth2 réussie',
  };
};

module.exports = { handleOAuth2Callback };
