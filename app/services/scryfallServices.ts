import axios from "axios";

export const getSetsFromCard = async (cardName: string) => {
  try {
    const response = await axios.get(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(
        cardName
      )}&unique=prints`
    );

    // If the card is not found in the API, return a specific error message
    if (response.data.data.length === 0) {
      return { cardName, sets: [`${cardName} not found`] };
    }

    // Extract set names directly from the initial response
    const sets = response.data.data
      .filter((card: any) => !card.promo)
      .map((card: any) => card.set_name);

    // Remove duplicate set names
    const uniqueSets = Array.from(new Set(sets));

    return { cardName, sets: uniqueSets };
  } catch (error) {
    console.error(`Error fetching information for card ${cardName}:`, error);
    // Return a specific error message when there's an issue fetching data from the API
    return { cardName, sets: [`Error fetching ${cardName}`] };
  }
};
