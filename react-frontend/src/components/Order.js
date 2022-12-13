import React from "react";
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

class Order extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      orderList: [],
      searchTerm: '',
      orderDescription: '',
      selected_product_ids: [
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
        },
      ],
      editDescription: '',
      editId: '',
      showCreate: false,
      showEdit: false,
      showAlert: false
    };
  }

  openCreateModal() {
    this.setState({
      showCreate: true
    })
  }

  closeCreateModal() {
    this.setState({
      showCreate: false
    })
  }

  openEditModal(data) {
    this.setState({
      showEdit: true,
      editId: data.id
    })
  }

  closeEditModal() {
    this.setState({
      showEdit: false
    })
  }

  setShowAlert(showAlert) {
    this.setState({
      showAlert
    })
  }

  async loadOrders() {
    const response = await axios.get(`${URL}/order`);
    this.setState({ orderList: response.data })
  }

  async componentDidMount() {
    this.loadOrders();
  }

  async editOrder() {
    await axios.put(`${URL}/order/` + this.state.editId, { orderDescription: this.state.editDescription })
      .then(response => {
        this.setState({ alertmessage: response.data })
        this.setShowAlert(true);
        this.closeEditModal();
        this.loadOrders();
      })
      .catch(error => {
        this.setState({ alertmessage: error.response.data })
        this.setShowAlert(true);
        this.closeEditModal();
      });
  }

  async deleteOrder(data) {
    await axios.delete(`${URL}/order/` + data.id)
      .then(response => {
        this.setState({ alertmessage: response.data })
        this.setShowAlert(true);
        this.closeEditModal();
        this.loadOrders();
      })
      .catch(error => {
        this.setState({ alertmessage: error.response.data })
        this.setShowAlert(true);
        this.closeEditModal();
      });
  }

  onProductSelectionChange(productId, checked) {
    const selectedIds = [...this.state.selected_product_ids];
    const product = selectedIds.find(x => x.id == productId)
    product.checked = checked;

    this.setState({selected_product_ids: selectedIds})
  }

  async createOrder() {
    await axios.post(`${URL}/orders`, {
      orderDescription: this.state.orderDescription,
      product_ids: this.state.selected_product_ids.filter(x => x.checked).map(x => x.id).join(',')
    })
      .then(response => {
        this.setState({ alertmessage: response.data })
        this.setShowAlert(true);
        this.closeCreateModal();
        this.loadOrders();
      })
      .catch(error => {
        this.setState({ alertmessage: error.response.data })
        this.setShowAlert(true);
        this.closeCreateModal();
      });
  }

  getFilteredOrderList() {
    if (!this.state.searchTerm) {
      return this.state.orderList;
    }

    return this.state.orderList.filter(order => {
      return order.id.toString().includes(this.state.searchTerm) || order.orderDescription.toLowerCase().includes(this.state.searchTerm)
    })
  }

  render() {
    return (
      <div className="order-management-wrap">
        <h4>Order Management</h4>
        <div className="container">
          <input
            type="text"
            className="search-wrap"
            placeholder="Search by order ID or order description"
            onChange={(e) => { this.setState({ searchTerm: e.target.value }) }}
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
              {this.state.orderList && this.getFilteredOrderList().map(({ id, orderDescription, products_count, createdAt }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{orderDescription}</td>
                  <td>{products_count}</td>
                  <td>{createdAt}</td>
                  <td>
                    <Button variant="light" onClick={() => this.openEditModal({ id })}>
                      <i className="bi bi-pencil-fill"></i>
                    </Button></td>
                  <td><Button variant="light" onClick={() => this.deleteOrder({ id })}>
                    <i className="bi bi-trash3-fill"></i>
                  </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Button variant="secondary" size="lg" onClick={() => this.openCreateModal()}>
          New Order
        </Button>

        {/* New order */}
        <Modal show={this.state.showCreate} onHide={() => this.closeCreateModal()}>
          <Modal.Header closeButton>
            <Modal.Title>New Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <InputGroup.Checkbox aria-label="Checkbox for following text input" onChange={(e) => this.onProductSelectionChange(1, e.target.checked)} />
              <Form.Control className="product-text" aria-label="Text input with checkbox" placeholder="1" />
              <Form.Control aria-label="Text input with checkbox" placeholder="This is HP Laptop" />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Checkbox aria-label="Checkbox for following text input" onChange={(e) => this.onProductSelectionChange(2, e.target.checked)} />
              <Form.Control className="product-text" aria-label="Text input with checkbox" placeholder="2" />
              <Form.Control aria-label="Text input with checkbox" placeholder="This is Lenovo Laptop" />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Checkbox aria-label="Checkbox for following text input" onChange={(e) => this.onProductSelectionChange(3, e.target.checked)} />
              <Form.Control className="product-text" aria-label="Text input with checkbox" placeholder="3" />
              <Form.Control aria-label="Text input with checkbox" placeholder="This is car" />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Checkbox aria-label="Checkbox for following text input" onChange={(e) => this.onProductSelectionChange(4, e.target.checked)} />
              <Form.Control className="product-text" aria-label="Text input with checkbox" placeholder="4" />
              <Form.Control aria-label="Text input with checkbox" placeholder="This is bike" />
            </InputGroup>
            <input
              type="text"
              className="order-desc"
              placeholder="Enter Order Description"
              onChange={(e) => { this.setState({ orderDescription: e.target.value }) }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.closeCreateModal()}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => this.createOrder(this.state.orderDescription)}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit order */}
        <Modal show={this.state.showEdit} onHide={() => this.closeEditModal()}>
          <Modal.Dialog className="edit-dialog-margin">
            <Modal.Header closeButton>
              <Modal.Title>Edit order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                type="text"
                className="order-desc"
                placeholder="Enter Order Description"
                onChange={(e) => { this.setState({ editDescription: e.target.value }) }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.closeEditModal()}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => this.editOrder(this.state.editDescription)}>
                Edit
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal>

       {/* Toast */}
        {this.state.showAlert && (
          <ToastContainer className="p-3" position="top-end">
            <Toast onClose={() => this.setShowAlert(false)}>
              <Toast.Header>
                <strong className="me-auto">Info</strong>
              </Toast.Header>
              <Toast.Body>{this.state.alertmessage}</Toast.Body>
            </Toast>
          </ToastContainer>
        )}

      </div>
    );
  }
}

export default Order;