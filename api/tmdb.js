const API_URL = "https://api.themoviedb.org/3";

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "TMDB API key is not configured.",
    });
  }

  const { action, page, query } = req.query;

  const endpoints = {
    popular: "/movie/popular",
    search: "/search/movie",
    genres: "/genre/movie/list",
  };

  if (!endpoints[action]) {
    return res.status(400).json({
      error: "Invalid TMDB action.",
    });
  }

  const params = new URLSearchParams();
  params.set("api_key", apiKey);

  if (action === "popular") {
    const pageNumber = Number(page || 1);

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      pageNumber > 500
    ) {
      return res.status(400).json({ error: "Invalid page number." });
    }

    params.set("page", String(pageNumber));
  }

  if (action === "search") {
    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Search query is required." });
    }

    params.set("query", query.trim());
  }

  try {
    const url = `${API_URL}${endpoints[action]}?${params.toString()}`;

    const response = await fetch(url, {
  headers: {
    accept: "application/json",
  },
});

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "TMDB request failed.",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("TMDB request failed:", error.message);

    return res.status(500).json({
      error: "Unable to retrieve movie data.",
    });
  }
};
```
