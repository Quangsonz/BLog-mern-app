import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  Grid
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import TableSkeleton from "../components/skeletons/TableSkeleton";

const ManageContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({ total: 0, pending: 0, replied: 0, closed: 0 });
  
  // cái này là dialog xem chi tiết và trả lời
  const [viewDialog, setViewDialog] = useState(false);
  const [replyDialog, setReplyDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);
  // áp dụng bộ lọc khi thay đổi tìm kiếm hoặc trạng thái
  useEffect(() => {
    handleFilter();
  }, [searchQuery, statusFilter, contacts]);
  // lấy danh sách liên hệ từ backend
  const fetchContacts = async () => {
    try {
      const { data } = await axios.get("/api/contacts");
      setContacts(data.contacts);
      setFilteredContacts(data.contacts);
      setStats(data.stats);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch contacts");
      setLoading(false);
    }
  };
  // xử lý lọc danh sách liên hệ
  const handleFilter = () => {
    let filtered = contacts;

    // Trạng thái lọc
    if (statusFilter !== "all") {
      filtered = filtered.filter((contact) => contact.status === statusFilter);
    }

    // dùng để tìm kiếm theo tên, email, subject
    if (searchQuery) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.subject.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContacts(filtered);
  };
  // xử lý xem chi tiết liên hệ
  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setViewDialog(true);
  };
  // xử lý mở dialog trả lời liên hệ
  const handleOpenReplyDialog = (contact) => {
    setSelectedContact(contact);
    setReplyMessage(contact.replyMessage || "");
    setNewStatus(contact.status);
    setReplyDialog(true);
  };
  // xử lý cập nhật trạng thái liên hệ
  const handleUpdateStatus = async () => {
    if (newStatus === "replied" && !replyMessage.trim()) {
      toast.error("Please provide a reply message");
      return;
    }

    try {
      const { data } = await axios.put(
        `/api/contact/status/${selectedContact._id}`,
        { status: newStatus, replyMessage: replyMessage }
      );

      toast.success(data.message);
      fetchContacts();
      setReplyDialog(false);
      setReplyMessage("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update status");
    }
  };
  // xử lý xóa liên hệ
  const handleDeleteContact = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the contact message from ${name}?`)) {
      try {
        const { data } = await axios.delete(`/api/contact/delete/${id}`);
        toast.success(data.message);
        fetchContacts();
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to delete contact");
      }
    }
  };
  // lấy màu sắc cho trạng thái liên hệ
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "replied":
        return "success";
      case "closed":
        return "default";
      default:
        return "default";
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 150
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200
    },
    {
      field: "subject",
      headerName: "Subject",
      flex: 1,
      minWidth: 150
    },
    {
      field: "message",
      headerName: "Message",
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          py: 1
        }}>
          {params.value}
        </Box>
      )
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      )
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 150,
      renderCell: (params) => moment(params.value).format("MMM DD, YYYY")
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleViewContact(params.row)}
              sx={{ color: "#667eea" }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reply/Update Status">
            <IconButton
              size="small"
              onClick={() => handleOpenReplyDialog(params.row)}
              sx={{ color: "#4caf50" }}
            >
              <ReplyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDeleteContact(params.row._id, params.row.name)}
              sx={{ color: "#f44336" }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Manage Contact Messages
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.total}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Messages</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.pending}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Pending</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.replied}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Replied</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{stats.closed}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Closed</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search by name, email, or subject..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="replied">Replied</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* DataGrid */}
      <Card>
        {loading ? (
          <TableSkeleton rows={10} columns={7} />
        ) : (
          <DataGrid
            rows={filteredContacts}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            loading={loading}
            getRowId={(row) => row._id}
            autoHeight
            disableSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:focus': {
                outline: 'none'
              }
            }}
          />
        )}
      </Card>

      {/* View Contact Dialog */}
      <Dialog
        open={viewDialog}
        onClose={() => setViewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700
        }}>
          Contact Message Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedContact && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedContact.name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{selectedContact.email}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Subject</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedContact.subject}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Message</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                  {selectedContact.message}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip
                  label={selectedContact.status}
                  color={getStatusColor(selectedContact.status)}
                  size="small"
                  sx={{ textTransform: 'capitalize', mt: 1 }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Received</Typography>
                <Typography variant="body2">
                  {moment(selectedContact.createdAt).format("MMMM DD, YYYY [at] h:mm A")}
                </Typography>
              </Box>
              {selectedContact.replied && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Reply Message</Typography>
                    <Alert severity="info" sx={{ mt: 1 }}>
                      {selectedContact.replyMessage}
                    </Alert>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Replied At</Typography>
                    <Typography variant="body2">
                      {moment(selectedContact.repliedAt).format("MMMM DD, YYYY [at] h:mm A")}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Reply/Update Status Dialog */}
      <Dialog
        open={replyDialog}
        onClose={() => setReplyDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700
        }}>
          Update Contact Status
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="replied">Replied</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>

          {newStatus === "replied" && (
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Reply Message"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Enter your reply message..."
              required
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              }
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageContacts;
