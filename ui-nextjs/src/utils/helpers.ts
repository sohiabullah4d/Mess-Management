import { Item, MealRecipe, MealUsage } from "../context/types";

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const filterItems = (
  items: Item[],
  filters: { name?: string; status?: string; unit?: string }
) => {
  return items.filter((item) => {
    if (
      filters.name &&
      !item.name.toLowerCase().includes(filters.name.toLowerCase())
    ) {
      return false;
    }
    if (filters.status && item.status !== filters.status) {
      return false;
    }
    if (filters.unit && item.unit !== filters.unit) {
      return false;
    }
    return true;
  });
};

export const calculateMonthlyStats = (
  usage: MealUsage[],
  items: Item[],
  meals: MealRecipe[],
  year: number,
  month: number
) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const monthlyUsage = usage.filter((u) => {
    const date = new Date(u.date);
    return date >= startDate && date <= endDate;
  });

  const mealsPrepared = monthlyUsage.length;

  const itemUsage: Record<string, number> = {};
  monthlyUsage.forEach((u) => {
    u.itemsUsed.forEach((iu) => {
      if (!itemUsage[iu.itemId]) {
        itemUsage[iu.itemId] = 0;
      }
      itemUsage[iu.itemId] += iu.totalUsed;
    });
  });

  const itemsNeedRestocking = items
    .map((item) => {
      const used = itemUsage[item.id] || 0;
      const remaining = item.quantity - used;
      return {
        ...item,
        used,
        remaining,
        needsRestocking: remaining < item.quantity * 0.2, // Less than 20% remaining
      };
    })
    .filter((item) => item.needsRestocking);

  const mostUsedItems = Object.entries(itemUsage)
    .map(([itemId, totalUsed]) => {
      const item = items.find((i) => i.id === itemId);
      return {
        name: item?.name || "Unknown",
        totalUsed,
        unit: item?.unit || "",
      };
    })
    .sort((a, b) => b.totalUsed - a.totalUsed)
    .slice(0, 5);

  return {
    mealsPrepared,
    itemUsage,
    itemsNeedRestocking,
    mostUsedItems,
  };
};

export const exportToCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0] || {}).join(",");
  const rows = data
    .map((row) =>
      Object.values(row)
        .map((value) =>
          typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value
        )
        .join(",")
    )
    .join("\n");

  const csvContent = `${headers}\n${rows}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
