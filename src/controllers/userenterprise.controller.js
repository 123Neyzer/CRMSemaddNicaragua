const { db } = require('../prisma/db');

// Lista los usuarios asociados a empresas.
const getUserEnterprises = async (req, res, next) => { try { res.json(await db.orm.userenterprise.all()); } catch (error) { next(error); } };
// Obtiene un usuario empresarial por ID.
const getUserEnterpriseById = async (req, res, next) => { try { const item = await db.orm.userenterprise.where({ id: Number(req.params.id) }).first(); if (!item) return res.status(404).json({ message: 'Usuario empresarial no encontrado' }); res.json(item); } catch (error) { next(error); } };
// Crea un usuario empresarial.
const createUserEnterprise = async (req, res, next) => { try { const { userId, enterpriseId, fullName, email, username, role, password, state } = req.body; if ([userId, enterpriseId, fullName, email, username, password].some((v) => v === undefined || v === '')) return res.status(400).json({ message: 'userId, enterpriseId, fullName, email, username y password son obligatorios' }); res.status(201).json(await db.orm.userenterprise.create({ userId: Number(userId), enterpriseId: Number(enterpriseId), fullName, email, username, password, ...(role === undefined ? {} : { role }), ...(state === undefined ? {} : { state: Number(state) }) })); } catch (error) { next(error); } };
// Actualiza los campos enviados.
const updateUserEnterprise = async (req, res, next) => { try { const id = Number(req.params.id); const data = { ...req.body }; ['userId', 'enterpriseId', 'state'].forEach((field) => { if (data[field] !== undefined) data[field] = Number(data[field]); }); const current = await db.orm.userenterprise.where({ id }).first(); if (!current) return res.status(404).json({ message: 'Usuario empresarial no encontrado' }); res.json(await db.orm.userenterprise.where({ id }).update(data)); } catch (error) { next(error); } };
// Elimina definitivamente el usuario empresarial.
const deleteUserEnterprise = async (req, res, next) => { try { const id = Number(req.params.id); const current = await db.orm.userenterprise.where({ id }).first(); if (!current) return res.status(404).json({ message: 'Usuario empresarial no encontrado' }); await db.orm.userenterprise.where({ id }).delete(); res.status(204).send(); } catch (error) { next(error); } };
module.exports = { getUserEnterprises, getUserEnterpriseById, createUserEnterprise, updateUserEnterprise, deleteUserEnterprise };
