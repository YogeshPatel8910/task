import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Spinner, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../common/Header';

const StoreOwnerDashboard = () => {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const storeResponse = await axios.get('/api/auth/me');
      setStore(storeResponse.data.user.store);
      const ratingsResponse = await axios.get(`/api/stores/${storeResponse.data.user.store.id}/ratings`);
      setRatings(ratingsResponse.data.ratings);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const ratingValue = parseFloat(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= ratingValue ? "text-warning" : "text-secondary"}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container className="mt-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </>
    );
  }

  if (error && !store) {
    return (
      <>
        <Header />
        <Container className="mt-5">
          <Alert variant="danger">
            {error}
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container className="mt-4">
        <h2 className="mb-4">Store Owner Dashboard</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Row>
          <Col lg={4} className="mb-4">
            <Card className="h-100">
              <Card.Header as="h5">Store Information</Card.Header>
              <Card.Body>
                <h4>{store.name}</h4>
                <p className="text-muted">{store.email}</p>
                <p><strong>Address:</strong></p>
                <p className="border p-2 rounded">{store.address}</p>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <span><strong>Average Rating:</strong></span>
                  <div>
                    {renderStarRating(store.averageRating)}
                    <span className="ms-2">({store.averageRating?.toFixed(1) || '0.0'})</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <span><strong>Total Ratings:</strong></span>
                  <Badge bg="primary" pill>{ratings.length || 0}</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header as="h5">Ratings Received</Card.Header>
              <Card.Body>
                {ratings.length === 0 ? (
                  <Alert variant="info">
                    No ratings received yet.
                  </Alert>
                ) : (
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Rating</th>
                          <th>Date Submitted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ratings.map(rating => (
                          <tr key={rating.id}>
                            <td>{rating.User.name}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                {renderStarRating(rating.rating)}
                                <span className="ms-2">({rating.rating})</span>
                              </div>
                            </td>
                            <td>{new Date(rating.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
            
            
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default StoreOwnerDashboard;