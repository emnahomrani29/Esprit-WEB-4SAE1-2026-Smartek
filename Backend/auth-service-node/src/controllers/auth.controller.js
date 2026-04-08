const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/user.model');
const { generateToken } = require('../services/jwt.service');

const buildResponse = (user, token = null, message = '') => ({
  ...(token && { token }),
  userId: user._id.toString(),
  email: user.email,
  firstName: user.firstName,
  role: user.role,
  imageBase64: user.image || null,
  experience: user.experience,
  message,
});

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  const { firstName, email, password, phone, role, imageBase64, experience } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName, email, password: hashed, phone, role,
      image: imageBase64 || null,
      experience: experience ?? 0,
    });

    const token = generateToken(user.email, { role: user.role, userId: user._id.toString() });
    return res.status(201).json(buildResponse(user, token, 'Inscription réussie'));
  } catch (err) {
    console.error('Erreur inscription:', err.message);
    return res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = generateToken(user.email, { role: user.role, userId: user._id.toString() });
    return res.json(buildResponse(user, token, 'Connexion réussie'));
  } catch (err) {
    console.error('Erreur connexion:', err.message);
    return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
  }
};

exports.health = (_req, res) => res.json('Auth Service is running');

exports.validateUser = async (req, res) => {
  try {
    const exists = !!(await User.findById(req.params.userId));
    return res.json(exists);
  } catch {
    return res.json(false);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    return res.json(buildResponse(user, null, 'Données utilisateur récupérées'));
  } catch (err) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }
};

exports.getUserIdsByRole = async (req, res) => {
  try {
    const users = await User.find({ role: req.params.role.toUpperCase() }, '_id');
    return res.json(users.map((u) => u._id.toString()));
  } catch {
    return res.json([]);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    return res.json(users.map(u => ({
      userId: u._id.toString(),
      firstName: u.firstName,
      email: u.email,
      role: u.role,
      phone: u.phone || null,
      experience: u.experience ?? 0,
      createdAt: u.createdAt,
    })));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    return res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
