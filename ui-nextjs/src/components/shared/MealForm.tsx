import React, { useState } from 'react';
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useFormik } from 'formik';
import { mealSchema } from '../../validations/mealSchema';
import { MealRecipe } from '../../context/types';
import { useAppContext } from '../../context/AppContext';

interface MealFormProps {
  meal?: MealRecipe;
  onSubmit: (values: Omit<MealRecipe, 'id'>) => void;
  onCancel: () => void;
}

export const MealForm: React.FC<MealFormProps> = ({ meal, onSubmit, onCancel }) => {
  const { state } = useAppContext();

  const formik = useFormik({
    initialValues: {
      name: meal?.name || '',
      items: meal?.items || [],
    },
    validationSchema: mealSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const [newItem, setNewItem] = useState({
    itemId: '',
    usagePerPerson: 0,
  });

  const addItem = () => {
    if (newItem.itemId && newItem.usagePerPerson > 0) {
      formik.setFieldValue('items', [
        ...formik.values.items,
        { ...newItem },
      ]);
      setNewItem({ itemId: '', usagePerPerson: 0 });
    }
  };

  const removeItem = (index: number) => {
    const newItems = [...formik.values.items];
    newItems.splice(index, 1);
    formik.setFieldValue('items', newItems);
  };

  const availableItems = state.items.filter(
    item => !formik.values.items.some(i => i.itemId === item.id)
  );

  return (
    <form id="meal-form" onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Meal Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Items Required
          </Typography>
          
          {/* Add new item */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', mb: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Select Item</InputLabel>
              <Select
                value={newItem.itemId}
                label="Select Item"
                onChange={(e) => setNewItem({ ...newItem, itemId: e.target.value })}
              >
                {availableItems.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name} ({item.unit})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Usage per person"
              type="number"
              value={newItem.usagePerPerson}
              onChange={(e) => setNewItem({ ...newItem, usagePerPerson: parseFloat(e.target.value) || 0 })}
              inputProps={{ min: 0.01, step: 0.01 }}
              sx={{ width: 150 }}
            />
            
            <IconButton onClick={addItem} color="primary" disabled={!newItem.itemId || newItem.usagePerPerson <= 0}>
              <Add />
            </IconButton>
          </Box>

          {/* Added items */}
          {formik.values.items.map((item, index) => {
            const itemData = state.items.find(i => i.id === item.itemId);
            return (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <TextField
                  value={itemData?.name || 'Unknown Item'}
                  disabled
                  sx={{ flexGrow: 1 }}
                />
                <TextField
                  value={`${item.usagePerPerson} ${itemData?.unit || ''} per person`}
                  disabled
                  sx={{ width: 200 }}
                />
                <IconButton onClick={() => removeItem(index)} color="error">
                  <Delete />
                </IconButton>
              </Box>
            );
          })}

          {formik.touched.items && formik.errors.items && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {formik.errors.items as string}
            </Typography>
          )}
        </Grid>
      </Grid>
    </form>
  );
};