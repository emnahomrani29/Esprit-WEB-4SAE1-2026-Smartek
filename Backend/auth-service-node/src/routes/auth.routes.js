const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/auth.controller');
const oauth2Ctrl = require('../controllers/oauth2.controller');

const ROLES = ['LEARNER', 'ADMIN', 'TRAINER', 'RH_COMPANY', 'RH_SMARTEK', 'PARTNER'];

router.post('/register', [
  body('firstName').notEmpty().withMessage('Le prénom est obligatoire'),
  body('email').isEmail().withMessage("Format d'email invalide"),
  body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères'),
  body('role').isIn(ROLES).withMessage('Rôle invalide'),
], ctrl.register);

router.post('/login', [
  body('email').isEmail().withMessage("Format d'email invalide"),
  body('password').notEmpty().withMessage('Le mot de passe est obligatoire'),
], ctrl.login);

router.get('/health', ctrl.health);
router.get('/validate/:userId', ctrl.validateUser);
router.get('/user/:userId', ctrl.getUserById);
router.get('/users/role/:role', ctrl.getUserIdsByRole);

// OAuth2
router.get('/oauth2/callback/:provider', oauth2Ctrl.callback);

module.exports = router;
