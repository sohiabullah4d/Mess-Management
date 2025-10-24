import { Add, Delete, Edit, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  // Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { MealForm } from "../components/shared/MealForm";
import { Modal } from "../components/ui/Modal";
import { Table } from "../components/ui/Table";
import { useAppContext } from "../context/AppContext";
import { MealRecipe } from "../context/types";
// import { formatDate } from "../utils/helpers";
import { Column } from "../components/ui/Table";
import { exportToCSV } from "../utils/helpers";

const MealsPage: React.FC = () => {
  const { state, addMeal, updateMeal, deleteMeal } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealRecipe | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const filteredMeals = state.meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMeals = filteredMeals.sort((a, b) => {
    if (order === "asc") {
      return a[orderBy as keyof MealRecipe] > b[orderBy as keyof MealRecipe]
        ? 1
        : -1;
    } else {
      return a[orderBy as keyof MealRecipe] < b[orderBy as keyof MealRecipe]
        ? 1
        : -1;
    }
  });

  const paginatedMeals = sortedMeals.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSubmit = (values: Omit<MealRecipe, "id">) => {
    if (editingMeal) {
      updateMeal({ ...editingMeal, ...values });
    } else {
      addMeal(values);
    }
    setModalOpen(false);
    setEditingMeal(undefined);
  };

  const handleEdit = (meal: MealRecipe) => {
    setEditingMeal(meal);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      deleteMeal(id);
    }
  };

  const handleExport = () => {
    const data = state.meals.map((meal) => ({
      Name: meal.name,
      "Number of Ingredients": meal.items.length,
      "Items Required": meal.items
        .map((item) => {
          const itemData = state.items.find((i) => i.id === item.itemId);
          return `${itemData?.name} (${item.usagePerPerson} ${itemData?.unit}/person)`;
        })
        .join(", "),
    }));
    exportToCSV(data, "meals-export");
  };

  const columns: Column<MealRecipe>[] = [
    { id: "name", label: "Meal Name", sortable: true },
    {
      id: "items",
      label: "Items Required",
      sortable: false,
      format: (value: unknown, row?: MealRecipe) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {row?.items.map((item, index) => {
            const itemData = state.items.find((i) => i.id === item.itemId);
            return (
              <Chip
                key={index}
                label={`${itemData?.name} (${item.usagePerPerson} ${itemData?.unit}/person)`}
                size="small"
                variant="outlined"
              />
            );
          })}
        </Box>
      ),
    },
    {
      id: "actions",
      label: "Actions",
      sortable: false,
      align: "center",
      format: (value: unknown, row?: MealRecipe) => (
        <Box>
          <IconButton size="small" onClick={() => handleEdit(row!)}>
            <Edit />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(row!.id)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Box
        className='flex justify-between items-center'
      >
        <Typography variant="h4">Meal Recipes</Typography>
        <Box>
          <Button variant="outlined" onClick={handleExport} sx={{ mr: 2 }}>
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setModalOpen(true)}
          >
            Add Meal
          </Button>
        </Box>
      </Box>

      {/* Search */}
      <Box >
        <TextField
          fullWidth
          label="Search meals"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
          }}
        />
      </Box>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedMeals}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={filteredMeals.length}
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
          setEditingMeal(undefined);
        }}
        title={editingMeal ? "Edit Meal" : "Add New Meal"}
        actions={
          <Box>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="meal-form" variant="contained">
              {editingMeal ? "Update" : "Add"} Meal
            </Button>
          </Box>
        }
      >
        <MealForm
          meal={editingMeal}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </Stack>
  );
};

export default MealsPage;
