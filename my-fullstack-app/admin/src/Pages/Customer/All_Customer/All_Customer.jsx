import React, { useState } from 'react'
import './All_Customer.css'
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Avatar,
    Chip,
    IconButton,
    TextField,
    InputAdornment,
    Button,
    Menu,
    MenuItem,
    Rating,
    Pagination
} from '@mui/material';
import { 
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Block as BlockIcon,
    CheckCircle as CheckCircleIcon,
    FilterList as FilterListIcon
} from '@mui/icons-material';

const All_Customer = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Sample customer data based on ProductDetails reviews
    const customers = [
        { 
            id: 1, 
            name: 'Austrian Artist', 
            email: 'artist@austria.com',
            phone: '+43 123 456 789',
            avatar: '/src/assets/User/User_Avatar/Austrian artist-1933.webp',
            totalOrders: 15,
            totalSpent: 245000000,
            status: 'blocked',
            joinDate: 'Jan 15, 2024',
            lastOrder: 'Nov 28, 2025',
            rating: 5
        },
        { 
            id: 2, 
            name: 'Albert Einstein', 
            email: 'einstein@physics.com',
            phone: '+41 987 654 321',
            avatar: '/src/assets/User/User_Avatar/Albert_Einstein.jpg',
            totalOrders: 23,
            totalSpent: 456000000,
            status: 'active',
            joinDate: 'Mar 20, 2024',
            lastOrder: 'Nov 25, 2025',
            rating: 5
        },
        { 
            id: 3, 
            name: 'Elon Musk', 
            email: 'elon@spacex.com',
            phone: '+1 555 123 4567',
            avatar: '/src/assets/User/User_Avatar/Elon_Musk.jpg',
            totalOrders: 47,
            totalSpent: 1200000000,
            status: 'active',
            joinDate: 'Feb 10, 2024',
            lastOrder: 'Nov 29, 2025',
            rating: 4
        },
        { 
            id: 4, 
            name: 'Soltuné Montepré', 
            email: 'soltune@noble.fr',
            phone: '+33 612 345 678',
            avatar: '/src/assets/User/User_Avatar/Soltuné Montepré.jpg',
            totalOrders: 8,
            totalSpent: 189000000,
            status: 'active',
            joinDate: 'May 5, 2024',
            lastOrder: 'Nov 20, 2025',
            rating: 5
        },
        { 
            id: 5, 
            name: 'Vanga', 
            email: 'vanga@mystic.bg',
            phone: '+359 888 777 666',
            avatar: '/src/assets/User/User_Avatar/Vanga.jpg',
            totalOrders: 12,
            totalSpent: 298000000,
            status: 'blocked',
            joinDate: 'Apr 12, 2024',
            lastOrder: 'Oct 15, 2025',
            rating: 5
        },
        { 
            id: 6, 
            name: 'Gia Cát Lượng', 
            email: 'zhuge@strategist.cn',
            phone: '+86 138 0013 8000',
            avatar: '/src/assets/User/User_Avatar/Gia Cát Lượng.jpg',
            totalOrders: 34,
            totalSpent: 678000000,
            status: 'active',
            joinDate: 'Jan 8, 2024',
            lastOrder: 'Nov 27, 2025',
            rating: 5
        },
    ];

    const handleMenuClick = (event, customer) => {
        setAnchorEl(event.currentTarget);
        setSelectedCustomer(customer);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedCustomer(null);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getStatusColor = (status) => {
        return status === 'active' ? 'success' : 'error';
    };

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            customer.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || customer.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        
        <div className='All_Customer_Container'>
            {/* Animated Background */}
            <div className='cyber-bg'>
                <div className='cyber-grid'></div>
                <div className='floating-particles'>
                {[...Array(20)].map((_, i) => (
                    <div key={i} className='particle' style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 4}s`
                    }}></div>
                ))}
                </div>
            </div>
            <div className='All_Customer_Header'>
                <h1 className='All_Customer_Title'>Customer Management</h1>
                <div className='All_Customer_Stats'>
                    <div className='Stat_Card'>
                        <h3>Total Customers</h3>
                        <p className='Stat_Number'>{customers.length}</p>
                    </div>
                    <div className='Stat_Card'>
                        <h3>Active</h3>
                        <p className='Stat_Number Active'>{customers.filter(c => c.status === 'active').length}</p>
                    </div>
                    <div className='Stat_Card'>
                        <h3>Blocked</h3>
                        <p className='Stat_Number Blocked'>{customers.filter(c => c.status === 'blocked').length}</p>
                    </div>
                </div>
            </div>

            <div className='All_Customer_Controls'>
                <TextField
                    placeholder="Search customers..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='Search_Input'
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <div className='Filter_Buttons'>
                    <Button 
                        startIcon={<FilterListIcon />}
                        variant={filterStatus === 'all' ? 'contained' : 'outlined'}
                        onClick={() => setFilterStatus('all')}
                    >
                        All
                    </Button>
                    <Button 
                        startIcon={<CheckCircleIcon />}
                        variant={filterStatus === 'active' ? 'contained' : 'outlined'}
                        onClick={() => setFilterStatus('active')}
                        color="success"
                    >
                        Active
                    </Button>
                    <Button 
                        startIcon={<BlockIcon />}
                        variant={filterStatus === 'blocked' ? 'contained' : 'outlined'}
                        onClick={() => setFilterStatus('blocked')}
                        color="error"
                    >
                        Blocked
                    </Button>
                </div>
            </div>

            <TableContainer component={Paper} className='Customer_Table_Container'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Customer</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell align="center">Total Orders</TableCell>
                            <TableCell align="center">Total Spent</TableCell>
                            <TableCell align="center">Rating</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Join Date</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedCustomers.map((customer) => (
                            <TableRow key={customer.id} className='Customer_Row'>
                                <TableCell>
                                    <div className='Customer_Info'>
                                        <Avatar 
                                            src={customer.avatar} 
                                            alt={customer.name}
                                            className='Customer_Avatar'
                                        />
                                        <div className='Customer_Details'>
                                            <span className='Customer_Name'>{customer.name}</span>
                                            <span className='Customer_ID'>ID: #{customer.id}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='Contact_Info'>
                                        <span className='Customer_Email'>{customer.email}</span>
                                        <span className='Customer_Phone'>{customer.phone}</span>
                                    </div>
                                </TableCell>
                                <TableCell align="center">
                                    <span className='Orders_Badge'>{customer.totalOrders}</span>
                                </TableCell>
                                <TableCell align="center">
                                    <span className='Total_Spent'>{formatCurrency(customer.totalSpent)}</span>
                                </TableCell>
                                <TableCell align="center">
                                    <Rating value={customer.rating} readOnly size="small" />
                                </TableCell>
                                <TableCell align="center">
                                    <Chip 
                                        label={customer.status.toUpperCase()} 
                                        color={getStatusColor(customer.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <span className='Join_Date'>{customer.joinDate}</span>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton 
                                        onClick={(e) => handleMenuClick(e, customer)}
                                        size="small"
                                    >
                                        <MoreVertIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className='Pagination_Container'>
                <Pagination 
                    count={Math.ceil(filteredCustomers.length / itemsPerPage)}
                    page={currentPage}
                    onChange={(e, page) => setCurrentPage(page)}
                    color="primary"
                    size="large"
                />
            </div>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>
                    <EditIcon fontSize="small" style={{marginRight: '8px'}} />
                    Edit Customer
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <BlockIcon fontSize="small" style={{marginRight: '8px'}} />
                    {selectedCustomer?.status === 'active' ? 'Block' : 'Unblock'} Customer
                </MenuItem>
                <MenuItem onClick={handleMenuClose} style={{color: '#f44336'}}>
                    <DeleteIcon fontSize="small" style={{marginRight: '8px'}} />
                    Delete Customer
                </MenuItem>
            </Menu>
        </div>
    );
};

export default All_Customer;