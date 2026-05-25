const BASE = "http://localhost:8000/api";

export const getDashboard = async () => {
  const res = await fetch(`${BASE}/dashboard`);
  if (!res.ok) throw new Error("Failed to fetch dashboard");
  return res.json();
};

export const predictCustomer = async (data) => {
  const res = await fetch(`${BASE}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Prediction failed");
  return res.json();
};

export const explainCustomer = async (data) => {
  const res = await fetch(`${BASE}/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Explanation failed");
  return res.json();
};