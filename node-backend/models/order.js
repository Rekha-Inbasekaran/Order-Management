const { connection } = require('../db_conn');
const util = require('util');
const query = util.promisify(connection.query).bind(connection);

async function getAllOrders() { 
    try {
        const rows = await query('select orders.*, count(orderproductmap.productId) products_count from orders inner join orderproductmap on orderproductmap.orderId = orders.id group by orders.id');
        return rows;
    } finally {
    }
}

async function getOrderById(id) {
    try {
        const rows = await query(`select * from orders where id = ${id}`);
        return rows;
    } finally {
    }
}

async function createOrder(description, productIDs) {
    try {
        const result = await query(`insert into orders (orderDescription, createdAt) values('${description}', now())`);

        const productIDsArr = productIDs.split(',')
        for (let i = 0; i < productIDsArr.length; i++) {
            const productID = productIDsArr[i];
            await query(`insert into orderproductmap (orderId, productId) values(${result.insertId}, ${productID})`);
        }
        return result.insertId;
    } finally {

    }
}

async function editOrder(description, id) {
    try {
        const result = await query(`update orders set orderDescription = '${description}' where id = ${id}`);
        return result?.affectedRows;
    } finally {

    }
}

async function deleteOrder(id) {
    try {
        await query(`delete from orderproductmap where orderId = ${id}`);
        const result = await query(`delete from orders where id = ${id}`);
        return result?.affectedRows;
    } finally {

    }
}

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    editOrder,
    deleteOrder
}