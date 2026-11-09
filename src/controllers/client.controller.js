const { db } = require('../prisma/db');

// Lista todos los clientes.
const getClients = async (req, res, next) => { try { res.json(await db.orm.client.all()); } catch (error) { next(error); } };
// Obtiene un cliente por ID.
const getClientById = async (req, res, next) => { try { const item = await db.orm.client.where({ id: Number(req.params.id) }).first(); if (!item) return res.status(404).json({ message: 'Cliente no encontrado' }); res.json(item); } catch (error) { next(error); } };
// Crea un cliente.
const createClient = async (req, res, next) => { try { const { fullName, telephone, classification, summary, empresaId } = req.body; if ([fullName, telephone, classification, summary, empresaId].some((v) => v === undefined || v === '')) return res.status(400).json({ message: 'fullName, telephone, classification, summary y empresaId son obligatorios' }); res.status(201).json(await db.orm.client.create({ fullName, telephone, classification, summary, empresaId: Number(empresaId) })); } catch (error) { next(error); } };
// Actualiza los campos enviados.
const updateClient = async (req, res, next) => { try { const id = Number(req.params.id); const data = { ...req.body }; if (data.empresaId !== undefined) data.empresaId = Number(data.empresaId); const current = await db.orm.client.where({ id }).first(); if (!current) return res.status(404).json({ message: 'Cliente no encontrado' }); res.json(await db.orm.client.where({ id }).update(data)); } catch (error) { next(error); } };
// Elimina definitivamente el cliente.
const deleteClient = async (req, res, next) => { try { const id = Number(req.params.id); const current = await db.orm.client.where({ id }).first(); if (!current) return res.status(404).json({ message: 'Cliente no encontrado' }); await db.orm.client.where({ id }).delete(); res.status(204).send(); } catch (error) { next(error); } };
module.exports = { getClients, getClientById, createClient, updateClient, deleteClient };
