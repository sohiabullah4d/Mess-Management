import * as yup from "yup";

export const mealSchema = yup.object({
  name: yup.string().required("Meal name is required"),
  items: yup
    .array()
    .of(
      yup.object({
        itemId: yup.string().required("Item is required"),
        usagePerPerson: yup
          .number()
          .min(0.01, "Usage must be at least 0.01")
          .required("Usage is required"),
      })
    )
    .min(1, "At least one item is required"),
});
