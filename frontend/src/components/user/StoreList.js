import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const StoreList = ({ stores = [] }) => {
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

  const renderUserRating = (userRating) => {
    if (!userRating) {
      return <Badge bg="secondary">Not Rated</Badge>;
    }
    return (
      <Badge bg="info">Your Rating: {userRating} ★</Badge>
    );
  };

  if (stores.length === 0) {
    return (
      <Card className="text-center p-5">
        <Card.Body>
          <h4>No stores found</h4>
          <p>Try adjusting your search criteria</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Row>
      {stores.map(store => (
        <Col key={store.id} sm={12} md={6} lg={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>{store.name}</Card.Title>
              <Card.Text className="text-muted small">
                {store.address}
              </Card.Text>
              <div className="mb-2">
                {renderStarRating(store.averageRating)}
                <span className="ms-2">({store.averageRating ? parseFloat(store.averageRating).toFixed(1) : 0})</span>
              </div>
              <div className="mb-3">
                {renderUserRating(store.userRating)}
              </div>
            </Card.Body>
            <Card.Footer className="bg-white border-top-0">
              <Link to={`/user/stores/${store.id}`} className="btn btn-primary w-100">
                View Details
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StoreList;