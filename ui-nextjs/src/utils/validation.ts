export const validateItem = (values: any) => {
  const errors: any = {};

  if (!values.name) {
    errors.name = "Item name is required";
  }

  if (values.quantity === undefined || values.quantity === null) {
    errors.quantity = "Quantity is required";
  } else if (values.quantity < 0) {
    errors.quantity = "Quantity must be at least 0";
  }

  if (!values.unit) {
    errors.unit = "Unit is required";
  }

  return errors;
};

export const validateMeal = (values: any) => {
  const errors: any = {};

  if (!values.name) {
    errors.name = "Meal name is required";
  }

  if (!values.items || values.items.length === 0) {
    errors.items = "At least one item is required";
  }

  return errors;
};

export const validateUsage = (values: any) => {
  const errors: any = {};

  if (!values.mealId) {
    errors.mealId = "Meal is required";
  }

  if (!values.date) {
    errors.date = "Date is required";
  }

  if (!values.peopleCount) {
    errors.peopleCount = "Number of people is required";
  } else if (values.peopleCount < 1) {
    errors.peopleCount = "Must serve at least 1 person";
  }

  return errors;
};
