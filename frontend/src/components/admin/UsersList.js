import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button, Row, Col  } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  });
  const [sort, setSort] = useState({
    field: 'name',
    direction: 'asc'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users', {
        params: {
          ...filters,
          sortField: sort.field,
          sortDirection: sort.direction
        }
      });
      
      setUsers(response.data.users);

    } catch (error) {
      console.error('Error fetching users:', error);
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
    fetchUsers();
  };

  const renderSortIcon = (field) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' ? '↑' : '↓';
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      email: '',
      address: '',
      role: ''
    });
    fetchUsers();
  };

  return (
    <>
      <Container fluid className="mt-4">
        <h2>Users Management</h2>
        
        <Form onSubmit={applyFilters} className="mb-4">
          <div className="bg-light p-3 rounded mb-3">
            <h5>Filter Users</h5>
            <Row>
              <Col md={3}>
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
              <Col md={3}>
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
              <Col md={3}>
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
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="store_owner">Store Owner</option>
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
        
        <div className="mb-3 text-end">
          <Link to="/admin/add-user" className="btn btn-success">
            Add New User
          </Link>
        </div>

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
                  <th onClick={() => handleSort('role')} style={{ cursor: 'pointer' }}>
                    Role {renderSortIcon('role')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">No users found</td>
                  </tr>
                ) : (
                  users?.map(user => (
                    <tr key={user['id']}>
                      <td>{user['name']}</td>
                      <td>{user['email']}</td>
                      <td>{user['address']}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'store_owner' ? 'bg-warning' : 'bg-info'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/users/${user.id}`} className="btn btn-sm btn-info me-2">
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

export default UsersList;

