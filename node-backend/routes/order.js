var express = require('express');
const { getAllOrders, getOrderById, createOrder, editOrder, deleteOrder } = require('../models/order');
var router = express.Router(); 

router.get('/order', async function(req, res, next) {
  const orders = await getAllOrders();
  res.json(orders);
});

router.get('/order/:id', async function(req, res, next) {
  const order = await getOrderById(req.params.id); 
  res.json(order);
});

router.post('/orders', async function(req, res, next) {
  const {orderDescription, product_ids} = req.body;
  if (!orderDescription || !product_ids) {
    res.status(400).send('orderDescription or product_ids can\'t be empty');
    return;
  }

  const orderId = await createOrder(orderDescription, product_ids);
  res.status(200).send('Order with ID ' + orderId + ' has been created successfully');
});

router.put('/order/:id', async function(req, res, next) {
  const {orderDescription} = req.body;
  if (!req.params.id || !orderDescription) {
    res.status(400).send('order_id or orderDescription can\'t be empty');
    return;
  }

  const affectedRows = await editOrder(orderDescription, req.params.id);
  res.status(200).send('Order with ID ' + req.params.id + ' has been updated successfully');
});

router.delete('/order/:id', async function(req, res, next) {
  const affectedRows = await deleteOrder(req.params.id);
  res.status(200).send('Order with ID ' + req.params.id + ' has been deleted successfully');
});

module.exports = router;
