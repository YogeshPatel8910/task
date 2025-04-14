import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StoreDetail = () => {
  const [store, setStore] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  
  const fetchStoreDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/stores/${id}`);
      setStore(response.data.store);
      setUserRating(response.data.userRating || 0);
    } catch (err) {
      setError('Failed to load store details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStoreDetails();
  }, [id]);

  const handleRatingChange = (e) => {
    setUserRating(parseInt(e.target.value));
  };

  const submitRating = async () => {
    try {
      setSubmitting(true);
      setSuccessMessage('');
      setError('');
      
      await axios.post(`/api/stores/${id}/ratings`, {
        storeId: id,
        rating: userRating
      });
      
      setSuccessMessage('Rating submitted successfully!');
      fetchStoreDetails();
    } catch (err) {
      setError('Failed to submit rating. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const ratingValue = parseFloat(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= ratingValue ? "text-warning" : "text-secondary"} style={{ fontSize: '1.5rem' }}>
          ★
        </span>
      );
    }
    return (
      <div>
        {stars} <span className="ms-2">({ratingValue.toFixed(1)})</span>
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

  if (error && !store) {
    return (
      <>
        <Container className="mt-5">
          <Alert variant="danger">
            {error}
          </Alert>
          <Button variant="primary" onClick={() => navigate('/user')}>
            Back to Stores
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Container className="mt-4">
        <div className="mb-3">
          <Link to="/user" className="btn btn-primary">
            Back to Stores
          </Link>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        
        <Card className="mb-4">
          <Card.Header as="h4">{store.name}</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Email:</strong> {store.email}</p>
                <p><strong>Address:</strong></p>
                <p className="border p-2 rounded">{store.address}</p>
              </Col>
              <Col md={6}>
                <p><strong>Overall Rating:</strong></p>
                {renderStarRating(store.averageRating)}
                <p className="mt-3"><strong>Total Ratings:</strong> {store.totalRatings || 0}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Header as="h5">Rate this Store</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Your Rating</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Select 
                    value={userRating} 
                    onChange={handleRatingChange}
                    style={{ maxWidth: '100px' }}
                    className="me-3"
                  >
                    <option value="0">Select</option>
                    <option value="1">1 ★</option>
                    <option value="2">2 ★</option>
                    <option value="3">3 ★</option>
                    <option value="4">4 ★</option>
                    <option value="5">5 ★</option>
                  </Form.Select>
                  
                  <Button 
                    variant="primary" 
                    onClick={submitRating} 
                    disabled={userRating === 0 || submitting}
                  >
                    {submitting ? 'Submitting...' : userRating === store.userRating ? 'Update Rating' : 'Submit Rating'}
                  </Button>
                </div>
                
                {userRating > 0 && (
                  <div className="mt-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index} className={index < userRating ? "text-warning" : "text-secondary"} style={{ fontSize: '1.5rem' }}>
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </Form.Group>
            </Form>
            
            {store.userRating > 0 && (
              <div className="mt-3 p-2 bg-light rounded">
                <p className="mb-1"><strong>Your current rating:</strong></p>
                <div>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className={index < store.userRating ? "text-warning" : "text-secondary"} style={{ fontSize: '1.2rem' }}>
                      ★
                    </span>
                  ))}
                  <span className="ms-2">({store.userRating})</span>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default StoreDetail;