const { randomBytes, scrypt: scryptCallback, timingSafeEqual, createHmac } = require('node:crypto');
const { promisify } = require('node:util');

const scrypt = promisify(scryptCallback);
const PASSWORD_KEY_LENGTH = 64;

// Genera un hash scrypt con sal aleatoria para no guardar contraseñas en texto plano.
const hashPassword = async (password) => {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, PASSWORD_KEY_LENGTH);
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
};

// Compara tanto hashes nuevos como contraseñas antiguas, actualizando luego los registros antiguos.
const verifyPassword = async (password, storedPassword) => {
  if (typeof storedPassword !== 'string') return { valid: false, needsUpgrade: false };
  if (!storedPassword.startsWith('scrypt:')) {
    return { valid: password === storedPassword, needsUpgrade: password === storedPassword };
  }

  const [, salt, expectedHex] = storedPassword.split(':');
  if (!salt || !expectedHex || !/^[a-f0-9]+$/i.test(expectedHex)) {
    return { valid: false, needsUpgrade: false };
  }

  const expected = Buffer.from(expectedHex, 'hex');
  const actual = await scrypt(password, salt, expected.length);
  return {
    valid: expected.length === actual.length && timingSafeEqual(expected, actual),
    needsUpgrade: false,
  };
};

// Firma un JWT HS256 usando el secreto configurado en JWT_SECRET.
const createAccessToken = (user, secret) => {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    sub: String(user.id),
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + 60 * 60 * 8,
  })).toString('base64url');
  const content = `${header}.${payload}`;
  const signature = createHmac('sha256', secret).update(content).digest('base64url');
  return `${content}.${signature}`;
};

module.exports = { hashPassword, verifyPassword, createAccessToken };
