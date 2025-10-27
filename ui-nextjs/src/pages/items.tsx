import { Add, Delete, Edit, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { ItemForm } from "../components/shared/ItemForm";
import { Modal } from "../components/ui/Modal";
import { Column, Table } from "../components/ui/Table";
import { useAppContext } from "../context/AppContext";
import { Item } from "../context/types";
import { exportToCSV, filterItems, formatDate } from "../utils/helpers";

const ItemsPage: React.FC = () => {
  const { state, addItem, updateItem, deleteItem } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>();
  const [filters, setFilters] = useState({ name: "", status: "", unit: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const filteredItems = filterItems(state.items, filters);

  // const sortedItems = filteredItems.sort((a, b) => {
  //   if (order === "asc") {
  //     return a[orderBy as keyof Item] > b[orderBy as keyof Item] ? 1 : -1;
  //   } else {
  //     return a[orderBy as keyof Item] < b[orderBy as keyof Item] ? 1 : -1;
  //   }
  // });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aValue = a[orderBy as keyof Item];
    const bValue = b[orderBy as keyof Item];

    if (aValue == null || bValue == null) return 0; // handle undefined/null safely

    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedItems = sortedItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSubmit = (values: Omit<Item, "id" | "createdAt" | "status">) => {
    if (editingItem) {
      updateItem({ ...editingItem, ...values });
    } else {
      addItem(values);
    }
    setModalOpen(false);
    setEditingItem(undefined);
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteItem(id);
    }
  };

  const handleExport = () => {
    const data = state.items.map((item) => ({
      Name: item.name,
      Quantity: item.quantity,
      Unit: item.unit,
      Status: item.status,
      "Created Date": formatDate(item.createdAt),
      Notes: item.notes || "",
    }));
    exportToCSV(data, "items-export");
  };

  const columns: Column<Item>[] = [
    { id: "name", label: "Name", sortable: true },
    { id: "quantity", label: "Quantity", sortable: true, align: "right" },
    { id: "unit", label: "Unit", sortable: true },
    {
      id: "status",
      label: "Status",
      sortable: true,
      format: (value: string | number | undefined) => (
        <Chip
          label={value?.toString() || ""}
          color={value === "in-stock" ? "success" : "error"}
          size="small"
          className="capitalize"
        />
      ),
    },
    {
      id: "createdAt",
      label: "Created Date",
      sortable: true,
      format: (value) => (typeof value === "string" ? formatDate(value) : ""),
    },
    { id: "notes", label: "Notes", sortable: false },
    {
      id: "actions",
      label: "Actions",
      sortable: false,
      align: "center",
      format: (value: unknown, row?: Item) => (
        <Box className="flex space-x-1">
          <IconButton
            size="small"
            onClick={() => handleEdit(row!)}
            className="text-blue-500 hover:bg-blue-50"
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(row!.id)}
            className="text-red-500 hover:bg-red-50"
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box className="p-4">
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Typography variant="h4" className="font-bold text-gray-800 ">
          Items Management
        </Typography>
        <Box className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outlined"
            onClick={handleExport}
            className="border-primary-500 text-primary-500 hover:bg-primary-50"
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setModalOpen(true)}
            className="bg-primary-500 hover:bg-primary-600"
          >
            Add Item
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper className="p-4 mb-6 bg-white  shadow-sm rounded-lg">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search by name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              InputProps={{
                startAdornment: <Search className="mr-2 text-gray-400" />,
              }}
              className="bg-white "
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="bg-white "
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="in-stock">In Stock</MenuItem>
                <MenuItem value="out-of-stock">Out of Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Unit</InputLabel>
              <Select
                value={filters.unit}
                label="Unit"
                onChange={(e) =>
                  setFilters({ ...filters, unit: e.target.value })
                }
                className="bg-white "
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="kg">kg</MenuItem>
                <MenuItem value="litre">litre</MenuItem>
                <MenuItem value="piece">piece</MenuItem>
                <MenuItem value="pack">pack</MenuItem>
                <MenuItem value="dozen">dozen</MenuItem>
                <MenuItem value="bottle">bottle</MenuItem>
                <MenuItem value="can">can</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedItems}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={filteredItems.length}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        orderBy={orderBy}
        order={order}
        onSort={handleSort}
      />

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(undefined);
        }}
        title={editingItem ? "Edit Item" : "Add New Item"}
        actions={
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              onClick={() => {
                setModalOpen(false);
                setEditingItem(undefined);
              }}
              variant="outlined"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="item-form"
              variant="contained"
              className="bg-primary-500 hover:bg-primary-600"
            >
              {editingItem ? "Update" : "Add"} Item
            </Button>
          </Box>
        }
      >
        <ItemForm
          item={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditingItem(undefined);
          }}
        />
      </Modal>
    </Box>
  );
};

export default ItemsPage;

// import { Add, Delete, Edit, Search } from "@mui/icons-material";
// import {
//   Box,
//   Button,
//   Chip,
//   FormControl,
//   Grid,
//   IconButton,
//   InputLabel,
//   MenuItem,
//   Paper,
//   Select,
//   TextField,
//   Typography,
// } from "@mui/material";
// import React, { useState } from "react";
// // import { ItemForm } from "../components/shared/ItemForm";
// import { Modal } from "../components/ui/Modal";
// import { Column, Table } from "../components/ui/Table";
// import { useAppContext } from "../context/AppContext";
// import { Item } from "../context/types";
// import { exportToCSV, filterItems, formatDate } from "../utils/helpers";

// // Temporary ItemForm component - paste this in your ../components/shared/ItemForm file
// export const ItemForm: React.FC<{
//   item?: Item;
//   onSubmit: (values: Omit<Item, "id" | "createdAt">) => void;
//   onCancel: () => void;
// }> = ({ item, onSubmit }) => {
//   const [formData, setFormData] = React.useState({
//     name: item?.name || "",
//     quantity: item?.quantity || 0,
//     unit: item?.unit || "",
//     notes: item?.notes || "",
//   });

//   React.useEffect(() => {
//     if (item) {
//       setFormData({
//         name: item.name || "",
//         quantity: item.quantity || 0,
//         unit: item.unit || "",
//         notes: item.notes || "",
//       });
//     }
//   }, [item]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.name.trim() || !formData.unit) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     const submitData = {
//       ...formData,
//       name: formData.name.trim(),
//       quantity: Number(formData.quantity),
//       notes: formData.notes.trim(),
//       status:
//         Number(formData.quantity) > 0
//           ? ("in-stock" as const)
//           : ("out-of-stock" as const),
//     };

//     onSubmit(submitData);
//   };

//   return (
//     <form id="item-form" onSubmit={handleSubmit}>
//       <Box className="space-y-4">
//         <TextField
//           fullWidth
//           label="Item Name"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           required
//           margin="normal"
//         />

//         <Box className="flex gap-4 items-start">
//           <TextField
//             label="Quantity"
//             type="number"
//             value={formData.quantity}
//             onChange={(e) =>
//               setFormData({ ...formData, quantity: Number(e.target.value) })
//             }
//             required
//             inputProps={{ min: 0 }}
//             margin="normal"
//           />

//           <FormControl className="min-w-32" margin="normal">
//             <InputLabel>Unit *</InputLabel>
//             <Select
//               value={formData.unit}
//               label="Unit *"
//               onChange={(e) =>
//                 setFormData({ ...formData, unit: e.target.value })
//               }
//               required
//             >
//               <MenuItem value="kg">kg</MenuItem>
//               <MenuItem value="litre">litre</MenuItem>
//               <MenuItem value="piece">piece</MenuItem>
//               <MenuItem value="pack">pack</MenuItem>
//               <MenuItem value="dozen">dozen</MenuItem>
//               <MenuItem value="bottle">bottle</MenuItem>
//               <MenuItem value="can">can</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>

//         <TextField
//           fullWidth
//           label="Notes"
//           multiline
//           rows={3}
//           value={formData.notes}
//           onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//           margin="normal"
//         />
//       </Box>
//     </form>
//   );
// };

// const ItemsPage: React.FC = () => {
//   const { state, addItem, updateItem, deleteItem } = useAppContext();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState<Item | undefined>();
//   const [filters, setFilters] = useState({ name: "", status: "", unit: "" });
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [orderBy, setOrderBy] = useState("createdAt");
//   const [order, setOrder] = useState<"asc" | "desc">("desc");

//   const filteredItems = filterItems(state.items, filters);

//   const sortedItems = [...filteredItems].sort((a, b) => {
//     const aValue = a[orderBy as keyof Item];
//     const bValue = b[orderBy as keyof Item];

//     if (aValue == null || bValue == null) return 0;

//     if (aValue < bValue) return order === "asc" ? -1 : 1;
//     if (aValue > bValue) return order === "asc" ? 1 : -1;
//     return 0;
//   });

//   const paginatedItems = sortedItems.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   const handleSort = (property: string) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   const handleSubmit = (values: Omit<Item, "id" | "createdAt">) => {
//     if (editingItem) {
//       updateItem({ ...editingItem, ...values });
//     } else {
//       addItem(values);
//     }
//     setModalOpen(false);
//     setEditingItem(undefined);
//   };

//   const handleEdit = (item: Item) => {
//     setEditingItem(item);
//     setModalOpen(true);
//   };

//   const handleDelete = (id: string) => {
//     if (window.confirm("Are you sure you want to delete this item?")) {
//       deleteItem(id);
//     }
//   };

//   const handleExport = () => {
//     const data = state.items.map((item) => ({
//       Name: item.name,
//       Quantity: item.quantity,
//       Unit: item.unit,
//       Status: item.status,
//       "Created Date": formatDate(item.createdAt),
//       Notes: item.notes || "",
//     }));
//     exportToCSV(data, "items-export");
//   };

//   const columns: Column<Item>[] = [
//     { id: "name", label: "Name", sortable: true },
//     { id: "quantity", label: "Quantity", sortable: true, align: "right" },
//     { id: "unit", label: "Unit", sortable: true },
//     {
//       id: "status",
//       label: "Status",
//       sortable: true,
//       format: (value: string | number | undefined) => (
//         <Chip
//           label={value?.toString() || ""}
//           color={value === "in-stock" ? "success" : "error"}
//           size="small"
//           className="capitalize"
//         />
//       ),
//     },
//     {
//       id: "createdAt",
//       label: "Created Date",
//       sortable: true,
//       format: (value) => (typeof value === "string" ? formatDate(value) : ""),
//     },
//     { id: "notes", label: "Notes", sortable: false },
//     {
//       id: "actions",
//       label: "Actions",
//       sortable: false,
//       align: "center",
//       format: (value: unknown, row?: Item) => (
//         <Box className="flex space-x-1">
//           <IconButton
//             size="small"
//             onClick={() => handleEdit(row!)}
//             className="text-blue-500 hover:bg-blue-50"
//           >
//             <Edit />
//           </IconButton>
//           <IconButton
//             size="small"
//             onClick={() => handleDelete(row!.id)}
//             className="text-red-500 hover:bg-red-50"
//           >
//             <Delete />
//           </IconButton>
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <Box className="p-4">
//       <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <Typography variant="h4" className="font-bold text-gray-800 ">
//           Items Management
//         </Typography>
//         <Box className="flex flex-col sm:flex-row gap-2">
//           <Button
//             variant="outlined"
//             onClick={handleExport}
//             className="border-primary-500 text-primary-500 hover:bg-primary-50"
//           >
//             Export CSV
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={() => setModalOpen(true)}
//             className="bg-primary-500 hover:bg-primary-600"
//           >
//             Add Item
//           </Button>
//         </Box>
//       </Box>

//       {/* Filters */}
//       <Paper className="p-4 mb-6 bg-white  shadow-sm rounded-lg">
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               fullWidth
//               label="Search by name"
//               value={filters.name}
//               onChange={(e) => setFilters({ ...filters, name: e.target.value })}
//               InputProps={{
//                 startAdornment: <Search className="mr-2 text-gray-400" />,
//               }}
//               className="bg-white "
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormControl fullWidth>
//               <InputLabel>Status</InputLabel>
//               <Select
//                 value={filters.status}
//                 label="Status"
//                 onChange={(e) =>
//                   setFilters({ ...filters, status: e.target.value })
//                 }
//                 className="bg-white "
//               >
//                 <MenuItem value="">All</MenuItem>
//                 <MenuItem value="in-stock">In Stock</MenuItem>
//                 <MenuItem value="out-of-stock">Out of Stock</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormControl fullWidth>
//               <InputLabel>Unit</InputLabel>
//               <Select
//                 value={filters.unit}
//                 label="Unit"
//                 onChange={(e) =>
//                   setFilters({ ...filters, unit: e.target.value })
//                 }
//                 className="bg-white "
//               >
//                 <MenuItem value="">All</MenuItem>
//                 <MenuItem value="kg">kg</MenuItem>
//                 <MenuItem value="litre">litre</MenuItem>
//                 <MenuItem value="piece">piece</MenuItem>
//                 <MenuItem value="pack">pack</MenuItem>
//                 <MenuItem value="dozen">dozen</MenuItem>
//                 <MenuItem value="bottle">bottle</MenuItem>
//                 <MenuItem value="can">can</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Table */}
//       <Table
//         columns={columns}
//         data={paginatedItems}
//         page={page}
//         rowsPerPage={rowsPerPage}
//         totalRows={filteredItems.length}
//         onPageChange={setPage}
//         onRowsPerPageChange={setRowsPerPage}
//         orderBy={orderBy}
//         order={order}
//         onSort={handleSort}
//       />

//       {/* Modal */}
//       <Modal
//         open={modalOpen}
//         onClose={() => {
//           setModalOpen(false);
//           setEditingItem(undefined);
//         }}
//         title={editingItem ? "Edit Item" : "Add New Item"}
//         actions={
//           <Box className="flex space-x-2">
//             <Button
//               onClick={() => setModalOpen(false)}
//               variant="outlined"
//               className="border-gray-300 text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               form="item-form"
//               variant="contained"
//               className="bg-primary-500 hover:bg-primary-600"
//             >
//               {editingItem ? "Update" : "Add"} Item
//             </Button>
//           </Box>
//         }
//       >
//         <ItemForm
//           item={editingItem}
//           onSubmit={handleSubmit}
//           onCancel={() => setModalOpen(false)}
//         />
//       </Modal>
//     </Box>
//   );
// };

// export default ItemsPage;

// import { Add, Delete, Edit, Search } from "@mui/icons-material";
// import {
//   Box,
//   Button,
//   Chip,
//   FormControl,
//   Grid,
//   IconButton,
//   InputLabel,
//   MenuItem,
//   Paper,
//   Select,
//   TextField,
//   Typography,
// } from "@mui/material";
// import React, { useState } from "react";
// import { ItemForm } from "../components/shared/ItemForm";
// import { Modal } from "../components/ui/Modal";
// import { Column, Table } from "../components/ui/Table";
// import { useAppContext } from "../context/AppContext";
// import { Item } from "../context/types";
// import { exportToCSV, filterItems, formatDate } from "../utils/helpers";

// const ItemsPage: React.FC = () => {
//   const { state, addItem, updateItem, deleteItem } = useAppContext();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState<Item | undefined>();
//   const [filters, setFilters] = useState({ name: "", status: "", unit: "" });
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [orderBy, setOrderBy] = useState("createdAt");
//   const [order, setOrder] = useState<"asc" | "desc">("desc");

//   const filteredItems = filterItems(state.items, filters);

//   const sortedItems = [...filteredItems].sort((a, b) => {
//     const aValue = a[orderBy as keyof Item];
//     const bValue = b[orderBy as keyof Item];

//     if (aValue == null || bValue == null) return 0;

//     if (aValue < bValue) return order === "asc" ? -1 : 1;
//     if (aValue > bValue) return order === "asc" ? 1 : -1;
//     return 0;
//   });

//   const paginatedItems = sortedItems.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   const handleSort = (property: string) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   const handleSubmit = (values: Omit<Item, "id" | "createdAt" | "status">) => {
//     if (editingItem) {
//       updateItem({
//         ...editingItem,
//         ...values,
//       });
//     } else {
//       addItem(values);
//     }
//     setModalOpen(false);
//     setEditingItem(undefined);
//   };

//   const handleEdit = (item: Item) => {
//     setEditingItem(item);
//     setModalOpen(true);
//   };

//   const handleDelete = (id: string) => {
//     if (window.confirm("Are you sure you want to delete this item?")) {
//       deleteItem(id);
//     }
//   };

//   const handleExport = () => {
//     const data = state.items.map((item) => ({
//       Name: item.name,
//       Quantity: item.quantity,
//       Unit: item.unit,
//       Status: item.status,
//       "Created Date": formatDate(item.createdAt),
//       Notes: item.notes || "",
//     }));
//     exportToCSV(data, "items-export");
//   };

//   const handleAddItem = () => {
//     setEditingItem(undefined);
//     setModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setModalOpen(false);
//     setEditingItem(undefined);
//   };

//   const columns: Column<Item>[] = [
//     { id: "name", label: "Name", sortable: true },
//     { id: "quantity", label: "Quantity", sortable: true, align: "right" },
//     { id: "unit", label: "Unit", sortable: true },
//     {
//       id: "status",
//       label: "Status",
//       sortable: true,
//       format: (value: string | number | undefined) => (
//         <Chip
//           label={value?.toString() || ""}
//           color={value === "in-stock" ? "success" : "error"}
//           size="small"
//           className="capitalize"
//         />
//       ),
//     },
//     {
//       id: "createdAt",
//       label: "Created Date",
//       sortable: true,
//       format: (value) => (typeof value === "string" ? formatDate(value) : ""),
//     },
//     { id: "notes", label: "Notes", sortable: false },
//     {
//       id: "actions",
//       label: "Actions",
//       sortable: false,
//       align: "center",
//       format: (value: unknown, row?: Item) => (
//         <Box className="flex space-x-1">
//           <IconButton
//             size="small"
//             onClick={() => handleEdit(row!)}
//             className="text-blue-500 hover:bg-blue-50"
//           >
//             <Edit />
//           </IconButton>
//           <IconButton
//             size="small"
//             onClick={() => handleDelete(row!.id)}
//             className="text-red-500 hover:bg-red-50"
//           >
//             <Delete />
//           </IconButton>
//         </Box>
//       ),
//     },
//   ];

//   return (
//     <Box className="p-4">
//       <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <Typography variant="h4" className="font-bold text-gray-800 ">
//           Items Management
//         </Typography>
//         <Box className="flex flex-col sm:flex-row gap-2">
//           <Button
//             variant="outlined"
//             onClick={handleExport}
//             className="border-primary-500 text-primary-500 hover:bg-primary-50"
//           >
//             Export CSV
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={handleAddItem}
//             className="bg-primary-500 hover:bg-primary-600"
//           >
//             Add Item
//           </Button>
//         </Box>
//       </Box>

//       {/* Filters */}
//       <Paper className="p-4 mb-6 bg-white  shadow-sm rounded-lg">
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               fullWidth
//               label="Search by name"
//               value={filters.name}
//               onChange={(e) => setFilters({ ...filters, name: e.target.value })}
//               InputProps={{
//                 startAdornment: <Search className="mr-2 text-gray-400" />,
//               }}
//               className="bg-white "
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormControl fullWidth>
//               <InputLabel>Status</InputLabel>
//               <Select
//                 value={filters.status}
//                 label="Status"
//                 onChange={(e) =>
//                   setFilters({ ...filters, status: e.target.value })
//                 }
//                 className="bg-white "
//               >
//                 <MenuItem value="">All</MenuItem>
//                 <MenuItem value="in-stock">In Stock</MenuItem>
//                 <MenuItem value="out-of-stock">Out of Stock</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <FormControl fullWidth>
//               <InputLabel>Unit</InputLabel>
//               <Select
//                 value={filters.unit}
//                 label="Unit"
//                 onChange={(e) =>
//                   setFilters({ ...filters, unit: e.target.value })
//                 }
//                 className="bg-white "
//               >
//                 <MenuItem value="">All</MenuItem>
//                 <MenuItem value="kg">kg</MenuItem>
//                 <MenuItem value="litre">litre</MenuItem>
//                 <MenuItem value="piece">piece</MenuItem>
//                 <MenuItem value="pack">pack</MenuItem>
//                 <MenuItem value="dozen">dozen</MenuItem>
//                 <MenuItem value="bottle">bottle</MenuItem>
//                 <MenuItem value="can">can</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Table */}
//       <Table
//         columns={columns}
//         data={paginatedItems}
//         page={page}
//         rowsPerPage={rowsPerPage}
//         totalRows={filteredItems.length}
//         onPageChange={setPage}
//         onRowsPerPageChange={setRowsPerPage}
//         orderBy={orderBy}
//         order={order}
//         onSort={handleSort}
//       />

//       {/* Modal */}
//       <Modal
//         open={modalOpen}
//         onClose={handleModalClose}
//         title={editingItem ? "Edit Item" : "Add New Item"}
//         actions={
//           <Box className="flex space-x-2">
//             <Button
//               onClick={handleModalClose}
//               variant="outlined"
//               className="border-gray-300 text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               form="item-form"
//               variant="contained"
//               className="bg-primary-500 hover:bg-primary-600"
//             >
//               {editingItem ? "Update" : "Add"} Item
//             </Button>
//           </Box>
//         }
//       >
//         <ItemForm
//           item={editingItem}
//           onSubmit={handleSubmit}
//           onCancel={handleModalClose}
//         />
//       </Modal>
//     </Box>
//   );
// };

// export default ItemsPage;
