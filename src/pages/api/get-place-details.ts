// src/pages/api/get-place-details.ts

import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  const { businessName } = req.query;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (typeof businessName !== 'string' || !businessName) {
    return res.status(400).json({ error: 'businessName query parameter is required.' });
  }

  if (!apiKey) {
    console.error('Google Places API key is not configured.');
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  // This is the URL for the Google Places "Text Search" API.
  // We're asking it to find a place that matches the business name.
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    businessName
  )}&key=${apiKey}`;

  try {
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK' || !searchData.results || searchData.results.length === 0) {
      console.warn(`No results found for business: ${businessName}`);
      return res.status(404).json({ error: 'No Google Place found for that business name.' });
    }

    // We'll take the first result Google gives us.
    const place = searchData.results[0];
    const placeId = place.place_id;

    if (!placeId) {
      return res.status(404).json({ error: 'Could not find a Place ID for the top result.' });
    }

    // The magic link format for a direct "Write a Review" popup.
    const reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;

    // Send back the Place ID and the direct review URL.
    res.status(200).json({
      placeId: placeId,
      reviewUrl: reviewUrl,
      businessName: place.name, // Return the official name from Google
    });

  } catch (error) {
    console.error('Error fetching from Google Places API:', error);
    res.status(500).json({ error: 'Failed to fetch data from Google Places API.' });
  }
};

export default handler;

