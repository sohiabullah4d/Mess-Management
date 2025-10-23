import React from "react";
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import { usageSchema } from "../../validations/usageSchema";
import { useAppContext } from "../../context/AppContext";

interface MealUsageFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export const MealUsageForm: React.FC<MealUsageFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const { state } = useAppContext();

  const formik = useFormik({
    initialValues: {
      mealId: "",
      date: new Date().toISOString().split("T")[0],
      peopleCount: 1,
    },
    validationSchema: usageSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const selectedMeal = state.meals.find(
    (meal) => meal.id === formik.values.mealId
  );

  return (
    <form id="usage-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Select Meal</InputLabel>
            <Select
              id="mealId"
              name="mealId"
              value={formik.values.mealId}
              onChange={formik.handleChange}
              error={formik.touched.mealId && Boolean(formik.errors.mealId)}
              label="Select Meal"
            >
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
            id="date"
            name="date"
            label="Date"
            type="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="peopleCount"
            name="peopleCount"
            label="Number of People"
            type="number"
            value={formik.values.peopleCount}
            onChange={formik.handleChange}
            error={
              formik.touched.peopleCount && Boolean(formik.errors.peopleCount)
            }
            helperText={formik.touched.peopleCount && formik.errors.peopleCount}
            inputProps={{ min: 1 }}
          />
        </Grid>

        {selectedMeal && (
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Required Items
            </Typography>
            <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
              {selectedMeal.items.map((item, index) => {
                const itemData = state.items.find((i) => i.id === item.itemId);
                const totalRequired =
                  item.usagePerPerson * formik.values.peopleCount;
                const hasEnoughStock =
                  itemData && itemData.quantity >= totalRequired;

                return (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      {itemData?.name}: {item.usagePerPerson} {itemData?.unit}{" "}
                      per person × {formik.values.peopleCount} people ={" "}
                      {totalRequired} {itemData?.unit}
                    </Typography>
                    {!hasEnoughStock && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        Insufficient stock! Only {itemData?.quantity}{" "}
                        {itemData?.unit} available.
                      </Alert>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Grid>
        )}
      </Grid>
    </form>
  );
};
