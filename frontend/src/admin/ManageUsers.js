import React, { useEffect, useState } from "react";
import { 
  Box, 
  Paper, 
  Typography, 
  Chip,
  Avatar,
  Tooltip,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import ArticleIcon from "@mui/icons-material/Article";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import TableSkeleton from "../components/skeletons/TableSkeleton";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async (currentPage = 1, limit = 10) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `/api/users?page=${currentPage}&limit=${limit}`, 
        { withCredentials: true }
      );
      setUsers(data.users || []);
      if (data.pagination) {
        setTotalUsers(data.pagination.totalUsers);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, pageSize);
  }, [page, pageSize]);

  // Delete user
  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        const { data } = await axios.delete(`/api/user/delete/${userId}`);
        if (data.success) {
          toast.success(data.message || "User deleted successfully");
          fetchUsers();
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  // Open role change dialog
  const handleOpenRoleDialog = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || 'user');
    setOpenRoleDialog(true);
  };

  // Change user role
  const handleChangeRole = async () => {
    try {
      const { data } = await axios.put(`/api/user/role/${selectedUser._id}`, { role: newRole });
      if (data.success) {
        toast.success("User role updated successfully");
        setOpenRoleDialog(false);
        fetchUsers();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      field: "user",
      headerName: "User",
      width: 280,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar 
            src={params.row.avatar?.url}
            sx={{ 
              width: 40, 
              height: 40,
              fontSize: '1rem',
              background: params.row.avatar?.url ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 700
            }}
          >
            {!params.row.avatar?.url && params.row.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {params.row.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      renderCell: (params) => (
        <Chip 
          icon={params.value === 'admin' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
          label={params.value || 'user'} 
          size="small"
          sx={{ 
            bgcolor: params.value === 'admin' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(0,0,0,0.05)',
            color: params.value === 'admin' ? '#667eea' : 'text.secondary',
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase'
          }}
        />
      ),
    },
    {
      field: "postsCount",
      headerName: "Posts",
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ArticleIcon sx={{ fontSize: 16, color: '#667eea' }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {params.row.postsCount || 0}
          </Typography>
        </Box>
      ),
    },
    {
      field: "totalLikes",
      headerName: "Total Likes",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <FavoriteIcon sx={{ fontSize: 16, color: '#f44336' }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {params.row.totalLikes || 0}
          </Typography>
        </Box>
      ),
    },
    {
      field: "totalComments",
      headerName: "Total Comments",
      width: 140,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CommentIcon sx={{ fontSize: 16, color: '#4caf50' }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {params.row.totalComments || 0}
          </Typography>
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Joined",
      width: 150,
      renderCell: (params) => (
        <Tooltip title={moment(params.row.createdAt).format("MMMM DD, YYYY HH:mm")}>
          <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
            {moment(params.row.createdAt).format("MMM DD, YYYY")}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const isActive = moment().diff(moment(params.row.updatedAt), 'days') < 7;
        return (
          <Chip 
            label={isActive ? 'Active' : 'Inactive'} 
            size="small"
            sx={{ 
              bgcolor: isActive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(158, 158, 158, 0.1)',
              color: isActive ? '#4caf50' : '#9e9e9e',
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Change Role">
            <IconButton 
              size="small"
              onClick={() => handleOpenRoleDialog(params.row)}
              sx={{
                bgcolor: 'rgba(102, 126, 234, 0.1)',
                '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' }
              }}
            >
              <SwapHorizIcon sx={{ color: "#667eea", fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete User">
            <IconButton
              size="small"
              onClick={() => handleDeleteUser(params.row._id, params.row.name)}
              sx={{
                bgcolor: 'rgba(244, 67, 54, 0.1)',
                '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' }
              }}
            >
              <DeleteIcon sx={{ color: "#f44336", fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        mb: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        p: 4,
        color: 'white',
      }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          👥 Manage Users
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          View and manage all registered users
        </Typography>
      </Box>

      {/* Users Table */}
      <Paper sx={{ 
        borderRadius: 3, 
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <Box sx={{ 
          p: 3, 
          bgcolor: '#fafafa',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              All Users ({filteredUsers.length})
            </Typography>
          </Box>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'white',
              }
            }}
          />
        </Box>

        <Box sx={{ height: 600, width: "100%", bgcolor: 'white' }}>
          {loading ? (
            <TableSkeleton rows={10} columns={8} />
          ) : (
            <DataGrid
              getRowId={(row) => row._id}
              rowHeight={70}
              sx={{
                border: 0,
                "& .MuiDataGrid-cell": {
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                },
                "& .MuiDataGrid-columnHeaders": {
                  bgcolor: '#f8f9fa',
                  color: 'text.secondary',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  borderBottom: '2px solid rgba(102, 126, 234, 0.2)',
                },
                "& .MuiDataGrid-row": {
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.02)',
                  }
                },
              }}
              rows={filteredUsers}
              columns={columns}
              loading={loading}
              pagination
              page={page - 1}
              pageSize={pageSize}
              rowsPerPageOptions={[10, 25, 50]}
              rowCount={totalUsers}
              paginationMode="server"
              onPageChange={(newPage) => setPage(newPage + 1)}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              checkboxSelection
            />
          )}
        </Box>
      </Paper>

      {/* Change Role Dialog */}
      <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Change User Role
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Change role for: <strong>{selectedUser?.name}</strong>
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={newRole}
                label="Role"
                onChange={(e) => setNewRole(e.target.value)}
              >
                <MuiMenuItem value="user">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" />
                    User
                  </Box>
                </MuiMenuItem>
                <MuiMenuItem value="admin">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AdminPanelSettingsIcon fontSize="small" />
                    Admin
                  </Box>
                </MuiMenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenRoleDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleChangeRole}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
              }
            }}
          >
            Update Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageUsers;
