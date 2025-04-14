import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button, Spinner, Alert, Table } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StoreDetails = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('')
  const [ratings, setRatings] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/stores/${id}`);
        setStore(response.data.store);
        const ratingsResponse = await axios.get(`/api/stores/${id}/ratings`);
        setRatings(ratingsResponse.data.ratings)
      } catch (err) {
        setError('Failed to load store details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetails();
  }, [id]);

  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-warning" : "text-secondary"}>
          ★
        </span>
      );
    }
    return (
      <div>
        {stars} <span className="ms-2">({rating.toFixed(1)})</span>
      </div>
    );
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

  if (error || !store) {
    return (
      <>
        <Container className="mt-5">
          <Alert variant="danger">
            {error || 'Store not found'}
          </Alert>
          <Link to="/admin/stores" className="btn btn-primary">Back to Stores List</Link>
        </Container>
      </>
    );
  }

  return (
    <>
      <Container className="mt-4">
        <div className="mb-3">
          <Link to="/admin/stores" className="btn btn-primary">
            Back to Stores List
          </Link>
        </div>
        
        <Card className="mb-4">
          <Card.Header as="h4">
            Store Details
            <span className="float-end">
              {store.owner ? (
                <Badge bg="info">Has Owner</Badge>
              ) : (
                <Badge bg="warning">No Owner</Badge>
              )}
            </span>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Store Name:</strong> {store.name}</p>
                <p><strong>Email:</strong> {store.email}</p>
                {store.owner && (
                  <p>
                    <strong>Owner:</strong>{' '}
                    <Link to={`/admin/users/${store.owner.id}`}>
                      {store.owner.name}
                    </Link>
                  </p>
                )}
              </Col>
              <Col md={6}>
                <p><strong>Address:</strong></p>
                <p className="border rounded p-2">{store.address}</p>
                <p>
                  <strong>Rating:</strong>{' '}
                  {store.averageRating ? renderStarRating(store.averageRating) : 'No ratings yet'}
                </p>
              </Col>
            </Row>
            
            <div className="mt-3">
              {store.owner ? (
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate(`/admin/users/${store.owner.id}`)}
                >
                  View Owner Details
                </Button>
              ) : (
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate('/admin/add-user', { 
                    state: { 
                      presetRole: 'store_owner',
                      presetStore: store
                    } 
                  })}
                >
                  Assign Owner
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
        
        <Card className="mb-4">
          <Card.Header as="h5">Recent Ratings</Card.Header>
          <Card.Body>
            {ratings.length === 0 ? (
              <p className="text-center">No ratings yet for this store.</p>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Rating</th>
                    <th>User</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map(rating => (
                    <tr key={rating.id}>
                      <td>{renderStarRating(rating.rating)}</td>
                      <td>
                          {rating.User.name}
                      </td>
                      <td>{new Date(rating.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Header as="h5">Statistics</Card.Header>
          <Card.Body>
            <Row>
              <Col md={4} className="mb-3">
                <Card className="text-center h-100 bg-light">
                  <Card.Body>
                    <h3>{ratings.length || 0}</h3>
                    <Card.Title>Total Ratings</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="text-center h-100 bg-light">
                  <Card.Body>
                    <h3>{store.averageRating?.toFixed(1) || 'N/A'}</h3>
                    <Card.Title>Average Rating</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="text-center h-100 bg-light">
                  <Card.Body>
                    <h3>{new Date(store.createdAt).toLocaleDateString()}</h3>
                    <Card.Title>Created On</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default StoreDetails;