import * as yup from "yup";

export const itemSchema = yup.object({
  name: yup.string().required("Item name is required"),
  quantity: yup
    .number()
    .min(0, "Quantity must be at least 0")
    .required("Quantity is required"),
  unit: yup.string().required("Unit is required"),
  notes: yup.string(),
});
