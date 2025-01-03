import type { NextApiRequest, NextApiResponse } from "next";

// API handler
// processes search requests for lyrics
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, artist } = req.query;

  // check if a query is provided
  if (!query) {
    return res.status(400).json({ error: "Query is required." });
  }
  try {
    // build an API endpoint URL based on the input parameters
    const apiUrl = `https://api.lyrics.ovh/v1/${artist || ""}/${query}`;

    // fetch the lyrics from the external API
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch lyrics: ${response.statusText}`);
    }

    // parse the json response from the API
    const data = await response.json();

    // send the lyrics back to the frontend
    res.status(200).json(data);
  } catch (error) {
    // handle errors
    res.status(500).json({ error });
  }
}
