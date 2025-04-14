import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';

const RatingsList = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    storeId: '',
    userId: '',
    minRating: '',
    maxRating: ''
  });
  const [sort, setSort] = useState({
    field: 'createdAt',
    direction: 'desc'
  });

 

  const fetchRatings = async () => {  
    try {
      setLoading(true);
      const response = await axios.get(`/api/stores/allratings`, {
        params: {
          ...filters,
          sortField: sort.field,
          sortDirection: sort.direction
        }
      });
      setRatings(response.data.ratings);
    } catch (err) {
      setError('Failed to load ratings');
      console.error(err);
    } finally {
      setLoading(false);
    }
    
  };
  useEffect(() => {
   
    fetchRatings();
  },[]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSort = (field) => {
    const direction = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ field, direction });
    fetchRatings();
  };

  const renderSortIcon = (field) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' ? '↑' : '↓';
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchRatings();
  };

  const resetFilters = () => {
    setFilters({
      storeId:'',
      userId: '',
      minRating: '',
      maxRating: ''
    });
    fetchRatings();
  };

  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-warning" : "text-secondary"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <>
      <Container fluid className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Ratings Management</h2>
          
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={applyFilters} className="mb-4">
          <div className="bg-light p-3 rounded mb-3">
            <h5>Filter Ratings</h5>
            <Row>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>User ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="userId"
                    value={filters.userId}
                    onChange={handleFilterChange}
                    placeholder="Filter by user ID"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Min Rating</Form.Label>
                  <Form.Select
                    name="minRating"
                    value={filters.minRating}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Rating</Form.Label>
                  <Form.Select
                    name="maxRating"
                    value={filters.maxRating}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">Apply Filters</Button>
              <Button type="button" variant="secondary" onClick={resetFilters}>Reset</Button>
            </div>
          </div>
        </Form>
        
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                    ID {renderSortIcon('id')}
                  </th>
                  <th onClick={() => handleSort('rating')} style={{ cursor: 'pointer' }}>
                    Rating {renderSortIcon('rating')}
                  </th>
                  <th onClick={() => handleSort('userName')} style={{ cursor: 'pointer' }}>
                    User {renderSortIcon('userName')}
                  </th>
                  <th onClick={() => handleSort('storeName')} style={{ cursor: 'pointer' }}>
                    Store {renderSortIcon('storeName')}
                  </th>
                  <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                    Date {renderSortIcon('createdAt')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ratings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No ratings found</td>
                  </tr>
                ) : (
                  ratings.map(rating => (
                    <tr key={rating.id}>
                      <td>{rating.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {renderStarRating(rating.rating)}
                          <span className="ms-2">({rating.rating})</span>
                        </div>
                      </td>
                      <td>
                          {rating.User.name}
                      </td>
                      <td>
                          {rating.Store.name}
                      </td>
                      <td>{new Date(rating.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </>
  );
};

export default RatingsList;