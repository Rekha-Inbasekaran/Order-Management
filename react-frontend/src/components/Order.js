import React, {useState, useEffect} from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import axios from 'axios';
import './order.css';
const URL = 'http://localhost:3000/api';

export default function Order(){
    
    const [activeOrderId, setActiveOrderId] = useState(0);
    const [alertMessage, setAlertMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [orderDescription, setOrderDescription] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [orderList, setOrderList] = useState([]);
    const [selected_product_ids, setSelected_Product_Ids] = useState([
        {
            id: 1,
            checked: false,
          },
          {
            id: 2,
            checked: false,
          },
          {
            id: 3,
            checked: false,
          },
          {
            id: 4,
            checked: false,
          }
    ]);

    const openEditModal = (data) => {
        setShowEditModal(true);
        setActiveOrderId(data.id);
    }

    const loadOrders = async () => {
      const response = await axios.get(`${URL}/order`);
      setOrderList(response.data);
    }
    
    useEffect(() => {
      loadOrders();
    }, []);

    const editOrder = async () => {
        await axios.put(`${URL}/order/` + activeOrderId, { orderDescription: editDescription })
        .then(response => {
            setAlertMessage(response.data);
            setShowAlert(true);
            setShowEditModal(false);
            loadOrders();
        })
        .catch(error => {
            setAlertMessage(error.response.data);
            setShowAlert(true);
            setShowEditModal(false);
        });
    } 

    const deleteOrder = async (data) => {
        await axios.delete(`${URL}/order/` + data.id)
          .then(response => {
            setAlertMessage(response.data);
            setShowAlert(true);
            setShowEditModal(false);
            loadOrders();
          })
          .catch(error => {
            setAlertMessage(error.response.data);
            setShowAlert(true);
            setShowEditModal(false);
          });
    }

    const onProductSelectionChange = (productId, checked) => {
        const selectedIds = [...selected_product_ids];
        const product = selectedIds.find(x => x.id == productId)
        product.checked = checked;
    
        setSelected_Product_Ids(selectedIds);
    }

    const createOrder = async () => {
        await axios.post(`${URL}/orders`, {
          orderDescription,
          product_ids: selected_product_ids.filter(x => x.checked).map(x => x.id).join(',')
        })
          .then(response => {
            setAlertMessage(response.data);
            setShowAlert(true);
            setShowCreateModal(false);
            loadOrders();
          })
          .catch(error => {
            setAlertMessage(error.response.data);
            setShowAlert(true);
            setShowCreateModal(false);
          });
    }

    const getFilteredOrderList = () => {
        if (!searchTerm) {
          return orderList;
        }
    
        return orderList.filter(order => {
          return order.id.toString().includes(searchTerm) || order.orderDescription.toLowerCase().includes(searchTerm)
        })
    }

    return (
        <div className="order-management-wrap">
        <h4>Order Management</h4>
        <div className="container">
          <input
            type="text"
            className="search-wrap"
            placeholder="Search by order ID or order description"
            onChange={(e) => { setSearchTerm(e.target.value) }}
          />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Order Description</th>
                <th>Count of Products</th>
                <th>Created Date</th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody>
              {orderList && getFilteredOrderList().map(({ id, orderDescription, products_count, createdAt }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{orderDescription}</td>
                  <td>{products_count}</td>
                  <td>{createdAt}</td>
                  <td>
                    <Button variant="light" onClick={() => openEditModal({id})}>
                      <i className="bi bi-pencil-fill"></i>
                    </Button></td>
                  <td><Button variant="light" onClick={() => deleteOrder({ id })}>
                    <i className="bi bi-trash3-fill"></i>
                  </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Button variant="secondary" size="lg" onClick={() => setShowCreateModal(true)}>
          New Order
        </Button>

        {/* New order */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>New Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <InputGroup.Checkbox aria-label="Checkbox for following text input" onChange={(e) => onProductSelectionChange(1, e.target.checked)} />
              <Form.Control className="product-text" aria-label="Text input with checkbox" placeholder="1" />
              <Form.Control aria-label="Text input with checkbox" placeholder="This is HP Laptop" />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Checkbox aria-label="Checkbox for following text input" onChange={(e) => onProductSelectionChange(2, e.target.checked)} />
              <Form.Control className="product-text" aria-label="Text input with checkbox" placeholder="2" />
              <Form.Control aria-label="Text input with checkbox" placeholder="This is Lenovo Laptop" />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Checkbox aria-label="Checkbox for following text input" onChange={(e) => onProductSelectionChange(3, e.target.checked)} />
              <Form.Control className="product-text" aria-label="Text input with checkbox" placeholder="3" />
              <Form.Control aria-label="Text input with checkbox" placeholder="This is car" />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Checkbox aria-label="Checkbox for following text input" onChange={(e) => onProductSelectionChange(4, e.target.checked)} />
              <Form.Control className="product-text" aria-label="Text input with checkbox" placeholder="4" />
              <Form.Control aria-label="Text input with checkbox" placeholder="This is bike" />
            </InputGroup>
            <input
              type="text"
              className="order-desc"
              placeholder="Enter Order Description"
              onChange={(e) => { setOrderDescription(e.target.value) }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => createOrder(orderDescription)}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit order */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Dialog className="edit-dialog-margin">
            <Modal.Header closeButton>
              <Modal.Title>Edit order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                type="text"
                className="order-desc"
                placeholder="Enter Order Description"
                onChange={(e) => { setEditDescription(e.target.value) }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => editOrder(editDescription)}>
                Edit
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal>

       {/* Toast */}
        {showAlert && (
          <ToastContainer className="p-3" position="top-end">
            <Toast onClose={() => setShowAlert(false)}>
              <Toast.Header>
                <strong className="me-auto">Info</strong>
              </Toast.Header>
              <Toast.Body>{alertMessage}</Toast.Body>
            </Toast>
          </ToastContainer>
        )}

      </div>
    )
}