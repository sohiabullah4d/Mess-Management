import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  // Paper,
  Alert,
  LinearProgress,
} from "@mui/material";
import { Download} from "@mui/icons-material";
import { useAppContext } from "../context/AppContext";
import { calculateMonthlyStats, exportToCSV } from "../utils/helpers";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { UserOptions } from "jspdf-autotable";

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
  lastAutoTable: { finalY: number };
}

const StatsPage: React.FC = () => {
  const { state } = useAppContext();
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);

  const stats = calculateMonthlyStats(
    state.usage,
    state.items,
    state.meals,
    year,
    month
  );

  const handleExportCSV = () => {
    const data = [
      { Metric: "Meals Prepared", Value: stats.mealsPrepared },
      ...stats.mostUsedItems.map((item, index) => ({
        Metric: `Top Used Item #${index + 1}`,
        Value: `${item.name} (${item.totalUsed} ${item.unit})`,
      })),
      ...stats.itemsNeedRestocking.map((item, index) => ({
        Metric: `Needs Restocking #${index + 1}`,
        Value: `${item.name} (only ${item.remaining} ${item.unit} left)`,
      })),
    ];
    exportToCSV(data, `stats-${year}-${month}`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text(`Monthly Report - ${month}/${year}`, 14, 22);

    // Summary
    doc.setFontSize(12);
    doc.text(`Meals Prepared: ${stats.mealsPrepared}`, 14, 32);

    // Most used items table
    doc.text("Most Used Items:", 14, 42);
    const mostUsedData = stats.mostUsedItems.map((item) => [
      item.name,
      `${item.totalUsed} ${item.unit}`,
    ]);
    (doc as jsPDFWithAutoTable).autoTable({
      head: [["Item", "Total Used"]],
      body: mostUsedData,
      startY: 47
    });

    // Items needing restocking
    const lastY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;
    doc.text("Items Needing Restocking:", 14, lastY);
    const restockingData = stats.itemsNeedRestocking.map((item) => [
      item.name,
      `${item.remaining} ${item.unit} remaining`,
    ]);
    (doc as jsPDFWithAutoTable).autoTable({
      startY: lastY + 5,
      head: [["Item", "Remaining"]],
      body: restockingData,
    });

    doc.save(`stats-${year}-${month}.pdf`);
  };

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
        <Typography variant="h4">Statistics & Reports</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportPDF}
            sx={{ mr: 2 }}
          >
            Export PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      {/* Date Filters */}
      <Box sx={{ mb: 3, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={year}
                label="Year"
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {[2022, 2023, 2024, 2025].map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={month}
                label="Month"
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m, index) => (
                  <MenuItem key={m} value={index + 1}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {stats.mealsPrepared}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Meals Prepared
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {stats.mostUsedItems.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Top Items Used
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {stats.itemsNeedRestocking.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Items Need Restocking
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {Object.keys(stats.itemUsage).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Different Items Used
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Most Used Items */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Most Used Items
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">Total Used</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.mostUsedItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">
                          {item.totalUsed} {item.unit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Items Needing Restocking */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Items Needing Restocking
              </Typography>
              {stats.itemsNeedRestocking.length === 0 ? (
                <Alert severity="success">
                  All items have sufficient stock!
                </Alert>
              ) : (
                <Box>
                  {stats.itemsNeedRestocking.map((item, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">{item.name}</Typography>
                        <Typography variant="body2">
                          {item.remaining} {item.unit} remaining
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (item.remaining / (item.remaining + item.used)) * 100
                        }
                        color="error"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsPage;
