import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { Add, Delete, Event } from "@mui/icons-material";
import { Modal } from "../components/ui/Modal";
import { Table } from "../components/ui/Table";
import { MealUsageForm } from "../components/shared/MealUsageForm";
import { useAppContext } from "../context/AppContext";
import { MealUsage } from "../context/types";
import { formatDate } from "../utils/helpers";
import { exportToCSV } from "../utils/helpers";
import { Column } from "../components/ui/Table";

const UsagePage: React.FC = () => {
  const { state, addMealUsage } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ mealId: "", date: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("date");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const filteredUsage = state.usage.filter((usage) => {
    if (filters.mealId && usage.mealId !== filters.mealId) return false;
    if (filters.date && usage.date !== filters.date) return false;
    return true;
  });

  const sortedUsage = filteredUsage.sort((a, b) => {
    if (order === "asc") {
      return a[orderBy as keyof MealUsage] > b[orderBy as keyof MealUsage]
        ? 1
        : -1;
    } else {
      return a[orderBy as keyof MealUsage] < b[orderBy as keyof MealUsage]
        ? 1
        : -1;
    }
  });

  const paginatedUsage = sortedUsage.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSubmit = (values: Omit<MealUsage, "id" | "itemsUsed">) => {
    try {
      addMealUsage(values);
      setModalOpen(false);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  const handleExport = () => {
    const data = state.usage.map((usage) => {
      const meal = state.meals.find((m) => m.id === usage.mealId);
      return {
        Date: formatDate(usage.date),
        Meal: meal?.name || "Unknown",
        "People Served": usage.peopleCount,
        "Items Used": usage.itemsUsed
          .map((iu) => {
            const item = state.items.find((i) => i.id === iu.itemId);
            return `${item?.name} (${iu.totalUsed} ${item?.unit})`;
          })
          .join(", "),
      };
    });
    exportToCSV(data, "usage-export");
  };

  const columns: Column<MealUsage>[] = [
    { id: "date", label: "Date", sortable: true, format: formatDate },
    {
      id: "mealId",
      label: "Meal",
      sortable: true,
      format: (value: string) => {
        const meal = state.meals.find((m) => m.id === value);
        return meal?.name || "Unknown";
      },
    },
    {
      id: "peopleCount",
      label: "People Served",
      sortable: true,
      align: "right",
    },
    {
      id: "itemsUsed",
      label: "Items Used",
      sortable: false,
      format: (value: MealUsage["itemsUsed"], row?: MealUsage) => (
        <Box>
          {row?.itemsUsed.map((item, index) => {
            const itemData = state.items.find((i) => i.id === item.itemId);
            return (
              <Box key={index} sx={{ fontSize: "0.875rem" }}>
                {itemData?.name}: {item.totalUsed} {itemData?.unit}
              </Box>
            );
          })}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Meal Usage Tracking</Typography>
        <Box>
          <Button variant="outlined" onClick={handleExport} sx={{ mr: 2 }}>
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setModalOpen(true)}
          >
            Record Meal Usage
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Filter by Meal</InputLabel>
              <Select
                value={filters.mealId}
                label="Filter by Meal"
                onChange={(e) =>
                  setFilters({ ...filters, mealId: e.target.value })
                }
              >
                <MenuItem value="">All Meals</MenuItem>
                {state.meals.map((meal) => (
                  <MenuItem key={meal.id} value={meal.id}>
                    {meal.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Filter by Date"
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedUsage}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={filteredUsage.length}
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
          setError(null);
        }}
        title="Record Meal Usage"
        actions={
          <Box>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="usage-form" variant="contained">
              Record Usage
            </Button>
          </Box>
        }
      >
        <MealUsageForm
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </Box>
  );
};

export default UsagePage;
