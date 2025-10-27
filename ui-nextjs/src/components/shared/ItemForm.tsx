import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useFormik } from "formik";
import { itemSchema } from "../../validations/itemSchema";
import { Item } from "../../context/types";
import { useAppContext } from "../../context/AppContext";

interface ItemFormProps {
  item?: Item;
  onSubmit: (values: Omit<Item, "id" | "createdAt" | "status">) => void;
  onCancel: () => void;
}

const units = ["kg", "litre", "piece", "pack", "dozen", "bottle", "can"];

export const ItemForm: React.FC<ItemFormProps> = ({
  item,
  onSubmit,
  // onCancel,
}) => {
  const { state } = useAppContext();
  const [existingNames, setExistingNames] = useState<string[]>([]);

  useEffect(() => {
    setExistingNames(state.items.map((i) => i.name.toLowerCase()));
  }, [state.items]);

  const formik = useFormik({
    initialValues: {
      name: item?.name || "",
      quantity: item?.quantity || 0,
      unit: item?.unit || "",
      notes: item?.notes || "",
    },
    validationSchema: itemSchema,
    onSubmit: (values) => {
      // Check for duplicate name (excluding current item if editing)
      const isDuplicate = existingNames.some(
        (name) =>
          name === values.name.toLowerCase() &&
          (!item || item.name.toLowerCase() !== values.name.toLowerCase())
      );

      if (isDuplicate) {
        formik.setFieldError("name", "Item with this name already exists");
        return;
      }

      onSubmit(values);
    },
  });

  return (
    <form id="item-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Item Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="quantity"
            name="quantity"
            label="Quantity"
            type="number"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
            inputProps={{ min: 0, step: 0.01 }}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl
            fullWidth
            error={formik.touched.unit && Boolean(formik.errors.unit)}
          >
            <InputLabel id="unit-label">Unit</InputLabel>
            <Select
              labelId="unit-label"
              id="unit"
              name="unit"
              value={formik.values.unit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Unit"
            >
              {units.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="notes"
            name="notes"
            label="Notes"
            multiline
            rows={3}
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.notes && Boolean(formik.errors.notes)}
            helperText={formik.touched.notes && formik.errors.notes}
          />
        </Grid>
      </Grid>
    </form>
  );
};
