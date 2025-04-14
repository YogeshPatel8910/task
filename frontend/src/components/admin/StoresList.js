import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../common/Header';

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [sort, setSort] = useState({
    field: 'name',
    direction: 'asc'
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/stores', {
        params: {
          ...filters,
          sortField: sort.field,
          sortDirection: sort.direction
        }
      });
      setStores(response.data.stores);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSort = (field) => {
    const direction = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ field, direction });
    fetchStores();
  };

  const renderSortIcon = (field) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' ? '↑' : '↓';
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      email: '',
      address: ''
    });
    fetchStores();
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
    return (
      <div>
        {stars} <span className="ms-2">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <>
      <Header />
      <Container fluid className="mt-4">
        <h2>Stores Management</h2>
        
        <Form onSubmit={applyFilters} className="mb-4">
          <div className="bg-light p-3 rounded mb-3">
            <h5>Filter Stores</h5>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="Filter by name"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={filters.email}
                    onChange={handleFilterChange}
                    placeholder="Filter by email"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={filters.address}
                    onChange={handleFilterChange}
                    placeholder="Filter by address"
                  />
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
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    Name {renderSortIcon('name')}
                  </th>
                  <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                    Email {renderSortIcon('email')}
                  </th>
                  <th onClick={() => handleSort('address')} style={{ cursor: 'pointer' }}>
                    Address {renderSortIcon('address')}
                  </th>
                  <th onClick={() => handleSort('rating')} style={{ cursor: 'pointer' }}>
                    Rating {renderSortIcon('rating')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">No stores found</td>
                  </tr>
                ) : (
                  stores.map(store => (
                    <tr key={store.id}>
                      <td>{store.name}</td>
                      <td>{store.email}</td>
                      <td>{store.address}</td>
                      <td>{renderStarRating(store.averageRating || 0)}</td>
                      <td>
                        <Link to={`/admin/stores/${store.id}`} className="btn btn-sm btn-info me-2">
                          View Details
                        </Link>
                      </td>
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

export default StoresList;