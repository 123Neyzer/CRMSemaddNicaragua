const { db } = require('../prisma/db');

// Lista todos los detalles de conversación.
const getDetailConversations = async (req, res, next) => { try { res.json(await db.orm.detailconversation.all()); } catch (error) { next(error); } };
// Obtiene un detalle por ID.
const getDetailConversationById = async (req, res, next) => { try { const item = await db.orm.detailconversation.where({ id: Number(req.params.id) }).first(); if (!item) return res.status(404).json({ message: 'Detalle no encontrado' }); res.json(item); } catch (error) { next(error); } };
// Crea un detalle de conversación.
const createDetailConversation = async (req, res, next) => { try { const { conversationId, message, typeagent, userenterpriseId, state, content } = req.body; if ([conversationId, message, typeagent, userenterpriseId, content].some((v) => v === undefined || v === '')) return res.status(400).json({ message: 'conversationId, message, typeagent, userenterpriseId y content son obligatorios' }); res.status(201).json(await db.orm.detailconversation.create({ conversationId: Number(conversationId), message, typeagent, userenterpriseId: Number(userenterpriseId), content, ...(state === undefined ? {} : { state: Number(state) }) })); } catch (error) { next(error); } };
// Actualiza los campos enviados.
const updateDetailConversation = async (req, res, next) => { try { const id = Number(req.params.id); const data = { ...req.body }; ['conversationId', 'userenterpriseId', 'state'].forEach((field) => { if (data[field] !== undefined) data[field] = Number(data[field]); }); const current = await db.orm.detailconversation.where({ id }).first(); if (!current) return res.status(404).json({ message: 'Detalle no encontrado' }); res.json(await db.orm.detailconversation.where({ id }).update(data)); } catch (error) { next(error); } };
// Elimina definitivamente el detalle.
const deleteDetailConversation = async (req, res, next) => { try { const id = Number(req.params.id); const current = await db.orm.detailconversation.where({ id }).first(); if (!current) return res.status(404).json({ message: 'Detalle no encontrado' }); await db.orm.detailconversation.where({ id }).delete(); res.status(204).send(); } catch (error) { next(error); } };
module.exports = { getDetailConversations, getDetailConversationById, createDetailConversation, updateDetailConversation, deleteDetailConversation };
