import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
} from "@mui/material";
import { Inventory, Restaurant, History, Warning } from "@mui/icons-material";
import { useAppContext } from "../context/AppContext";
import { formatDate } from "../utils/helpers";

const HomePage: React.FC = () => {
  const { state } = useAppContext();

  const lowStockItems = state.items.filter(
    (item) => item.status === "out-of-stock" || item.quantity < 10
  );

  const recentUsage = state.usage
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Inventory
                  sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
                />
                <Box>
                  <Typography variant="h4">{state.items.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Items
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Restaurant
                  sx={{ fontSize: 40, color: "secondary.main", mr: 2 }}
                />
                <Box>
                  <Typography variant="h4">{state.meals.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Meal Recipes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <History sx={{ fontSize: 40, color: "success.main", mr: 2 }} />
                <Box>
                  <Typography variant="h4">{state.usage.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Meals Prepared
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Warning sx={{ fontSize: 40, color: "warning.main", mr: 2 }} />
                <Box>
                  <Typography variant="h4">{lowStockItems.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Low Stock Items
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Low Stock Items Need Attention
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {lowStockItems.map((item) => (
              <Box
                key={item.id}
                sx={{ display: "flex", alignItems: "center", mr: 2 }}
              >
                <Typography variant="body2">
                  {item.name} ({item.quantity} {item.unit})
                </Typography>
              </Box>
            ))}
          </Box>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Recent Meal Preparations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Meal Preparations
              </Typography>
              {recentUsage.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No meals prepared yet.
                </Typography>
              ) : (
                <Box>
                  {recentUsage.map((usage) => {
                    const meal = state.meals.find((m) => m.id === usage.mealId);
                    return (
                      <Box
                        key={usage.id}
                        sx={{ mb: 2, pb: 2, borderBottom: "1px solid #eee" }}
                      >
                        <Typography variant="subtitle2">
                          {meal?.name || "Unknown Meal"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(usage.date)} • {usage.peopleCount} people
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Stock Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Overview
              </Typography>
              {state.items.slice(0, 5).map((item) => (
                <Box key={item.id} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="body2">
                      {item.quantity} {item.unit}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      item.status === "out-of-stock"
                        ? 0
                        : Math.min(100, (item.quantity / 50) * 100)
                    }
                    color={item.status === "out-of-stock" ? "error" : "primary"}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
