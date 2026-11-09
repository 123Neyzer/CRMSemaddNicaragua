const { db } = require('../prisma/db');

// Lista todas las conversaciones.
const getConversations = async (req, res, next) => { try { res.json(await db.orm.conversation.all()); } catch (error) { next(error); } };
// Obtiene una conversación por ID.
const getConversationById = async (req, res, next) => { try { const item = await db.orm.conversation.where({ id: Number(req.params.id) }).first(); if (!item) return res.status(404).json({ message: 'Conversación no encontrada' }); res.json(item); } catch (error) { next(error); } };
// Crea una conversación.
const createConversation = async (req, res, next) => { try { const { clientId, userId, enterpriseId, message, canal, state } = req.body; if ([clientId, userId, enterpriseId, message, canal].some((v) => v === undefined || v === '')) return res.status(400).json({ message: 'clientId, userId, enterpriseId, message y canal son obligatorios' }); res.status(201).json(await db.orm.conversation.create({ clientId: Number(clientId), userId: Number(userId), enterpriseId: Number(enterpriseId), message, canal, ...(state === undefined ? {} : { state: Number(state) }) })); } catch (error) { next(error); } };
// Actualiza los campos enviados.
const updateConversation = async (req, res, next) => { try { const id = Number(req.params.id); const data = { ...req.body }; ['clientId', 'userId', 'enterpriseId', 'state'].forEach((field) => { if (data[field] !== undefined) data[field] = Number(data[field]); }); const current = await db.orm.conversation.where({ id }).first(); if (!current) return res.status(404).json({ message: 'Conversación no encontrada' }); res.json(await db.orm.conversation.where({ id }).update(data)); } catch (error) { next(error); } };
// Elimina definitivamente la conversación.
const deleteConversation = async (req, res, next) => { try { const id = Number(req.params.id); const current = await db.orm.conversation.where({ id }).first(); if (!current) return res.status(404).json({ message: 'Conversación no encontrada' }); await db.orm.conversation.where({ id }).delete(); res.status(204).send(); } catch (error) { next(error); } };
module.exports = { getConversations, getConversationById, createConversation, updateConversation, deleteConversation };
