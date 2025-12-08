import React, { useState, useEffect } from 'react'
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
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { 
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Block as BlockIcon,
    CheckCircle as CheckCircleIcon,
    FilterList as FilterListIcon,
    Visibility as VisibilityIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import * as userService from '../../../api/userService';

const All_Customer = () => {
    // State for data
    const [customers, setCustomers] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        blockedUsers: 0,
        newUsersThisMonth: 0
    });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // State for filters & pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

    // State for UI
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [customerDetail, setCustomerDetail] = useState(null);

    // Snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getAllUsers({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch,
                status: filterStatus !== 'all' ? filterStatus : '',
                sortBy: 'createdAt',
                order: 'DESC'
            });

            if (response.success) {
                setCustomers(response.data.users);
                setTotalPages(response.data.pagination.totalPages);
                setTotalItems(response.data.pagination.totalItems);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            showSnackbar('Lỗi khi tải danh sách người dùng', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Fetch stats
    const fetchStats = async () => {
        try {
            const response = await userService.getUserStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, debouncedSearch, filterStatus]);

    useEffect(() => {
        fetchStats();
    }, []);

    // Snackbar helper
    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Menu handlers
    const handleMenuClick = (event, customer) => {
        setAnchorEl(event.currentTarget);
        setSelectedCustomer(customer);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // View customer detail
    const handleViewDetail = async () => {
        handleMenuClose();
        if (!selectedCustomer) return;

        setActionLoading(true);
        try {
            const response = await userService.getUserById(selectedCustomer.id);
            if (response.success) {
                setCustomerDetail(response.data);
                setDetailDialogOpen(true);
            }
        } catch (error) {
            showSnackbar('Lỗi khi tải thông tin chi tiết', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // Toggle status (Block/Unblock)
    const handleToggleStatus = async () => {
        handleMenuClose();
        if (!selectedCustomer) return;

        const newStatus = selectedCustomer.status === 'active' ? 'blocked' : 'active';
        setActionLoading(true);

        try {
            const response = await userService.toggleUserStatus(selectedCustomer.id, newStatus);
            if (response.success) {
                showSnackbar(response.message);
                fetchUsers();
                fetchStats();
            }
        } catch (error) {
            showSnackbar('Lỗi khi thay đổi trạng thái', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // Delete customer
    const handleDeleteClick = () => {
        handleMenuClose();
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedCustomer) return;

        setActionLoading(true);
        try {
            const response = await userService.deleteUser(selectedCustomer.id);
            if (response.success) {
                showSnackbar(response.message);
                setDeleteDialogOpen(false);
                setSelectedCustomer(null);
                fetchUsers();
                fetchStats();
            }
        } catch (error) {
            showSnackbar('Lỗi khi xóa người dùng', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // Format helpers
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'blocked': return 'error';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return 'ACTIVE';
            case 'blocked': return 'BLOCKED';
            case 'pending': return 'PENDING';
            default: return status?.toUpperCase();
        }
    };

    // Refresh data
    const handleRefresh = () => {
        fetchUsers();
        fetchStats();
    };

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

            {/* Header */}
            <div className='All_Customer_Header'>
                <div className='All_Customer_Header_Top'>
                    <h1 className='All_Customer_Title'>Customer Management</h1>
                    <IconButton onClick={handleRefresh} className='Refresh_Button'>
                        <RefreshIcon />
                    </IconButton>
                </div>
                <div className='All_Customer_Stats'>
                    <div className='Stat_Card'>
                        <h3>Total Customers</h3>
                        <p className='Stat_Number'>{stats.totalUsers}</p>
                    </div>
                    <div className='Stat_Card'>
                        <h3>Active</h3>
                        <p className='Stat_Number Active'>{stats.activeUsers}</p>
                    </div>
                    <div className='Stat_Card'>
                        <h3>Blocked</h3>
                        <p className='Stat_Number Blocked'>{stats.blockedUsers}</p>
                    </div>
                    <div className='Stat_Card'>
                        <h3>New This Month</h3>
                        <p className='Stat_Number New'>{stats.newUsersThisMonth}</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className='All_Customer_Controls'>
                <TextField
                    placeholder="Search by name, email, phone..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
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
                        onClick={() => { setFilterStatus('all'); setCurrentPage(1); }}
                    >
                        All ({stats.totalUsers})
                    </Button>
                    <Button 
                        startIcon={<CheckCircleIcon />}
                        variant={filterStatus === 'active' ? 'contained' : 'outlined'}
                        onClick={() => { setFilterStatus('active'); setCurrentPage(1); }}
                        color="success"
                    >
                        Active ({stats.activeUsers})
                    </Button>
                    <Button 
                        startIcon={<BlockIcon />}
                        variant={filterStatus === 'blocked' ? 'contained' : 'outlined'}
                        onClick={() => { setFilterStatus('blocked'); setCurrentPage(1); }}
                        color="error"
                    >
                        Blocked ({stats.blockedUsers})
                    </Button>
                </div>
            </div>

            {/* Table */}
            <TableContainer component={Paper} className='Customer_Table_Container'>
                {loading ? (
                    <div className='Loading_Container'>
                        <CircularProgress />
                        <p>Loading customers...</p>
                    </div>
                ) : customers.length === 0 ? (
                    <div className='Empty_Container'>
                        <p>No customers found</p>
                    </div>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Customer</TableCell>
                                <TableCell>Contact</TableCell>
                                <TableCell align="center">Orders</TableCell>
                                <TableCell align="center">Total Spent</TableCell>
                                <TableCell align="center">Email Verified</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Join Date</TableCell>
                                <TableCell align="center">Last Login</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer.id} className='Customer_Row'>
                                    <TableCell>
                                        <div className='Customer_Info'>
                                            <Avatar 
                                                src={customer.avatar} 
                                                alt={customer.fullName}
                                                className='Customer_Avatar'
                                            >
                                                {customer.fullName?.charAt(0)?.toUpperCase()}
                                            </Avatar>
                                            <div className='Customer_Details'>
                                                <span className='Customer_Name'>{customer.fullName}</span>
                                                <span className='Customer_ID'>ID: #{customer.id}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='Contact_Info'>
                                            <span className='Customer_Email'>{customer.email}</span>
                                            <span className='Customer_Phone'>{customer.phone || 'N/A'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <span className='Orders_Badge'>{customer.totalOrders}</span>
                                    </TableCell>
                                    <TableCell align="center">
                                        <span className='Total_Spent'>{formatCurrency(customer.totalSpent)}</span>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={customer.isEmailVerified ? 'Verified' : 'Unverified'} 
                                            color={customer.isEmailVerified ? 'success' : 'warning'}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={getStatusLabel(customer.status)} 
                                            color={getStatusColor(customer.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <span className='Join_Date'>{formatDate(customer.createdAt)}</span>
                                    </TableCell>
                                    <TableCell align="center">
                                        <span className='Last_Login'>{formatDate(customer.lastLoginDate)}</span>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton 
                                            onClick={(e) => handleMenuClick(e, customer)}
                                            size="small"
                                            disabled={actionLoading}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* Pagination */}
            {!loading && customers.length > 0 && (
                <div className='Pagination_Container'>
                    <span className='Pagination_Info'>
                        Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} customers
                    </span>
                    <Pagination 
                        count={totalPages}
                        page={currentPage}
                        onChange={(e, page) => setCurrentPage(page)}
                        color="primary"
                        size="large"
                    />
                </div>
            )}

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleViewDetail}>
                    <VisibilityIcon fontSize="small" style={{marginRight: '8px'}} />
                    View Details
                </MenuItem>
                <MenuItem onClick={handleToggleStatus}>
                    {selectedCustomer?.status === 'active' ? (
                        <>
                            <BlockIcon fontSize="small" style={{marginRight: '8px', color: '#f44336'}} />
                            Block Customer
                        </>
                    ) : (
                        <>
                            <CheckCircleIcon fontSize="small" style={{marginRight: '8px', color: '#4caf50'}} />
                            Unblock Customer
                        </>
                    )}
                </MenuItem>
                <MenuItem onClick={handleDeleteClick} style={{color: '#f44336'}}>
                    <DeleteIcon fontSize="small" style={{marginRight: '8px'}} />
                    Delete Customer
                </MenuItem>
            </Menu>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete customer <strong>{selectedCustomer?.fullName}</strong>?
                    <br /><br />
                    <small style={{color: '#f44336'}}>
                        Note: If the customer has orders, the account will be deactivated instead of deleted.
                    </small>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleDeleteConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={actionLoading}
                    >
                        {actionLoading ? <CircularProgress size={20} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Customer Detail Dialog */}
            <Dialog 
                open={detailDialogOpen} 
                onClose={() => setDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Customer Details</DialogTitle>
                <DialogContent>
                    {customerDetail && (
                        <div className='Customer_Detail_Content'>
                            <div className='Detail_Section'>
                                <h3>Basic Information</h3>
                                <div className='Detail_Grid'>
                                    <div className='Detail_Item'>
                                        <label>Full Name:</label>
                                        <span>{customerDetail.user.fullName}</span>
                                    </div>
                                    <div className='Detail_Item'>
                                        <label>Email:</label>
                                        <span>{customerDetail.user.email}</span>
                                    </div>
                                    <div className='Detail_Item'>
                                        <label>Phone:</label>
                                        <span>{customerDetail.user.phone || 'N/A'}</span>
                                    </div>
                                    <div className='Detail_Item'>
                                        <label>Status:</label>
                                        <Chip 
                                            label={getStatusLabel(customerDetail.user.status)} 
                                            color={getStatusColor(customerDetail.user.status)}
                                            size="small"
                                        />
                                    </div>
                                    <div className='Detail_Item'>
                                        <label>Join Date:</label>
                                        <span>{formatDate(customerDetail.user.createdAt)}</span>
                                    </div>
                                    <div className='Detail_Item'>
                                        <label>Last Login:</label>
                                        <span>{formatDate(customerDetail.user.lastLoginDate)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className='Detail_Section'>
                                <h3>Order Statistics</h3>
                                <div className='Stats_Grid'>
                                    <div className='Stat_Box'>
                                        <span className='Stat_Value'>{customerDetail.user.totalOrders}</span>
                                        <span className='Stat_Label'>Total Orders</span>
                                    </div>
                                    <div className='Stat_Box'>
                                        <span className='Stat_Value'>{formatCurrency(customerDetail.user.totalSpent)}</span>
                                        <span className='Stat_Label'>Total Spent</span>
                                    </div>
                                </div>
                            </div>

                            {customerDetail.recentOrders && customerDetail.recentOrders.length > 0 && (
                                <div className='Detail_Section'>
                                    <h3>Recent Orders</h3>
                                    <div className='Recent_Orders_List'>
                                        {customerDetail.recentOrders.map(order => (
                                            <div key={order.id} className='Order_Item'>
                                                <span className='Order_Code'>#{order.orderCode}</span>
                                                <span className='Order_Amount'>{formatCurrency(order.totalAmount)}</span>
                                                <Chip 
                                                    label={order.orderStatus} 
                                                    size="small"
                                                    color={order.orderStatus === 'completed' ? 'success' : 'default'}
                                                />
                                                <span className='Order_Date'>{formatDate(order.createdAt)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default All_Customer;