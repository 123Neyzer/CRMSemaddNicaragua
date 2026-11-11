const { db } = require('../prisma/db');
const { verifyPassword, hashPassword, createAccessToken } = require('./auth.helpers');

// Autentica las credenciales y entrega un JWT con vencimiento de ocho horas.
const login = async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password;

    // Rechaza solicitudes incompletas antes de consultar la base de datos.
    if (!email || typeof password !== 'string' || !password) {
      return res.status(400).json({ message: 'email y password son obligatorios' });
    }

    // No distingue si falló el correo o la contraseña para evitar revelar cuentas existentes.
    const user = await db.orm.user.where({ email }).first();
    if (!user || Number(user.state) !== 1) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const result = await verifyPassword(password, user.password);
    if (!result.valid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Migra de forma transparente las contraseñas antiguas en texto plano al primer acceso válido.
    if (result.needsUpgrade) {
      const passwordHash = await hashPassword(password);
      await db.orm.user.where({ id: user.id }).update({ password: passwordHash });
    }

    // No se crea un token si el secreto JWT no está configurado en el entorno.
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Falta configurar JWT_SECRET en el entorno' });
    }

    const token = createAccessToken(user, secret);
    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      tokenType: 'Bearer',
      expiresIn: '8h',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
