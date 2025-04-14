import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const UserDetails = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${id}`);
        setUser(response.data.user);
      } catch (err) {
        setError('Failed to load user details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const renderRoleLabel = (role) => {
    switch(role) {
      case 'admin':
        return <Badge bg="danger">Administrator</Badge>;
      case 'store_owner':
        return <Badge bg="warning">Store Owner</Badge>;
      default:
        return <Badge bg="info">User</Badge>;
    }
  };

  if (loading) {
    return (
      <>
        <Container className="mt-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </>
    );
  }

  if (error || !user) {
    return (
      <>
        <Container className="mt-5">
          <Alert variant="danger">
            {error || 'User not found'}
          </Alert>
          <Link to="/admin/users" className="btn btn-primary">Back to Users List</Link>
        </Container>
      </>
    );
  }

  return (
    <>
      <Container className="mt-4">
        <div className="mb-3">
          <Link to="/admin/users" className="btn btn-primary">
            Back to Users List
          </Link>
        </div>
        
        <Card>
          <Card.Header as="h4">
            User Details
            <span className="float-end">
              {renderRoleLabel(user['role'])}
            </span>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Name:</strong> {user['name']}</p>
                <p><strong>Email:</strong> {user['email']}</p>
                <p><strong>Role:</strong> {user['role']}</p>
              </Col>
              <Col md={6}>
                <p><strong>Address:</strong></p>
                <p className="border rounded p-2">{user['address']}</p>
              </Col>
            </Row>
            
            {user['role'] === 'store_owner'  && (
              <div className="mt-4">
                <h5>Store Information</h5>
                <Row>
                  <Col md={6}>
                    <p><strong>Store Name:</strong> {user.Store?.name}</p>
                    <p><strong>Store Email:</strong> {user.Store?.email}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Store Rating:</strong> {user.Store?.averageRating ??  'No ratings yet'} / 5</p>
                    <p><strong>Total Ratings:</strong> {user.Store?.totalRatings || 0}</p>
                  </Col>
                </Row>
                {/* <Link to={`/admin/stores/${user.Store?.id}`} className="btn btn-info btn-sm">
                  View Store Details
                </Link> */}
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default UserDetails;
