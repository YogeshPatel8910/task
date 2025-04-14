import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user',
    storeName: '',
    storeEmail: '',
    storeAddress: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const isStoreOwner = formData.role === 'store_owner';

  const validateForm = () => {
    const newErrors = {};
    if (formData.name.length < 20) {
      newErrors.name = 'Name must be at least 20 characters';
    } else if (formData.name.length > 60) {
      newErrors.name = 'Name cannot exceed 60 characters';
    }
    
    if (formData.address.length > 400) {
      newErrors.address = 'Address cannot exceed 400 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[\w!@#$%^&*(),.?":{}|<>]{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be 8-16 characters with at least one uppercase letter and one special character';
    }
    
    if (isStoreOwner) {
      if (formData.storeName.length < 20) {
        newErrors.storeName = 'Store name must be at least 20 characters';
      } else if (formData.storeName.length > 60) {
        newErrors.storeName = 'Store name cannot exceed 60 characters';
      }
      
      if (!emailRegex.test(formData.storeEmail)) {
        newErrors.storeEmail = 'Please enter a valid store email address';
      }
      
      if (formData.storeAddress.length > 400) {
        newErrors.storeAddress = 'Store address cannot exceed 400 characters';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (validateForm()) {
      setLoading(true);
      try {
        const dataToSubmit = { ...formData };
        
        if (isStoreOwner) {
          dataToSubmit.store = {
            name: formData.storeName,
            email: formData.storeEmail,
            address: formData.storeAddress
          };
        }
        
        delete dataToSubmit.storeName;
        delete dataToSubmit.storeEmail;
        delete dataToSubmit.storeAddress;
        
        await axios.post('/api/users', dataToSubmit);
        navigate('/admin/users', { state: { message: 'User added successfully!' } });
      } catch (err) {
        setServerError(err.response?.data?.message || 'Failed to add user');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!isStoreOwner) {
      setFormData(prevData => ({
        ...prevData,
        storeName: '',
        storeEmail: '',
        storeAddress: ''
      }));
    }
  }, [isStoreOwner]);

  return (
    <>
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Header as="h4" className="text-center">Add New User</Card.Header>
              <Card.Body>
                {serverError && <Alert variant="danger">{serverError}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                      required
                      placeholder="Enter full name (20-60 characters)"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      required
                      placeholder="Enter email"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      isInvalid={!!errors.address}
                      required
                      placeholder="Enter address (max 400 characters)"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      required
                      placeholder="8-16 characters with at least one uppercase letter and one special character"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="store_owner">Store Owner</option>
                    </Form.Select>
                  </Form.Group>

                  {isStoreOwner && (
                    <>
                      <hr className="my-4" />
                      <h5>Store Details</h5>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Store Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="storeName"
                          value={formData.storeName}
                          onChange={handleChange}
                          isInvalid={!!errors.storeName}
                          required={isStoreOwner}
                          placeholder="Enter store name (20-60 characters)"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.storeName}
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Store Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="storeEmail"
                          value={formData.storeEmail}
                          onChange={handleChange}
                          isInvalid={!!errors.storeEmail}
                          required={isStoreOwner}
                          placeholder="Enter store email"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.storeEmail}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Store Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="storeAddress"
                          value={formData.storeAddress}
                          onChange={handleChange}
                          isInvalid={!!errors.storeAddress}
                          required={isStoreOwner}
                          placeholder="Enter store address (max 400 characters)"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.storeAddress}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </>
                  )}

                  <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => navigate('/admin/users')}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add User'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddUser;