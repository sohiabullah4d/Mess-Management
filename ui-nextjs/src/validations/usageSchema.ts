import * as yup from "yup";

export const usageSchema = yup.object({
  mealId: yup.string().required("Meal is required"),
  date: yup.string().required("Date is required"),
  peopleCount: yup
    .number()
    .min(1, "Must serve at least 1 person")
    .required("People count is required"),
});
