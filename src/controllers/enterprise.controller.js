const { db } = require('../prisma/db');

// Lista todas las empresas.
const getEnterprises = async (req, res, next) => { try { res.json(await db.orm.enterprise.all()); } catch (error) { next(error); } };
// Busca una empresa por ID.
const getEnterpriseById = async (req, res, next) => { try { const item = await db.orm.enterprise.where({ id: Number(req.params.id) }).first(); if (!item) return res.status(404).json({ message: 'Empresa no encontrada' }); res.json(item); } catch (error) { next(error); } };
// Crea una empresa con sus campos obligatorios.
const createEnterprise = async (req, res, next) => { try { const { nameenterprise, country, userId, state } = req.body; if (!nameenterprise || !country || userId === undefined) return res.status(400).json({ message: 'nameenterprise, country y userId son obligatorios' }); res.status(201).json(await db.orm.enterprise.create({ nameenterprise, country, userId: Number(userId), ...(state === undefined ? {} : { state: Number(state) }) })); } catch (error) { next(error); } };
// Actualiza solo los campos enviados.
const updateEnterprise = async (req, res, next) => { try { const id = Number(req.params.id); const data = { ...req.body }; if (data.userId !== undefined) data.userId = Number(data.userId); if (data.state !== undefined) data.state = Number(data.state); const current = await db.orm.enterprise.where({ id }).first(); if (!current) return res.status(404).json({ message: 'Empresa no encontrada' }); res.json(await db.orm.enterprise.where({ id }).update(data)); } catch (error) { next(error); } };
// Elimina definitivamente la empresa.
const deleteEnterprise = async (req, res, next) => { try { const id = Number(req.params.id); const current = await db.orm.enterprise.where({ id }).first(); if (!current) return res.status(404).json({ message: 'Empresa no encontrada' }); await db.orm.enterprise.where({ id }).delete(); res.status(204).send(); } catch (error) { next(error); } };
module.exports = { getEnterprises, getEnterpriseById, createEnterprise, updateEnterprise, deleteEnterprise };
