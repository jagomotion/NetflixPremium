const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.post("/api/generate", async (req, res) => {
  try {
    const { data } = await axios.post(
      "https://api.zyvor.my.id/api/fun/netflix",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        timeout: 30000,
      }
    );

    if (!data || !data.status || !data.result) {
      return res.status(500).json({
        status: false,
        message: "Failed to fetch data from provider.",
      });
    }

    return res.json({ status: true, result: data.result });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message:
        err.response?.data?.message ||
        err.message ||
        "Internal server error.",
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: true, message: "Netflix Premium API is running" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;