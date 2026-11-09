const express = require('express');

// Construye las rutas REST comunes para cada entidad.
const createCrudRouter = (controller) => {
  const router = express.Router();
  router.get('/', controller.getAll);
  router.get('/:id', controller.getOne);
  router.post('/', controller.create);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);
  return router;
};

module.exports = { createCrudRouter };
