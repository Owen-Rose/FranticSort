import axios from "axios";

export const getSetsFromCard = async (
  cardName: string
): Promise<{
  cardName: string;
  sets: { set: string; released_at: string; image_url: string }[];
}> => {
  try {
    const response = await axios.get(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(
        cardName
      )}&unique=prints`
    );

    // If the card is not found in the API, return a specific error message
    if (response.data.data.length === 0) {
      return {
        cardName,
        sets: [{ set: `${cardName} not found`, released_at: "" }],
      };
    }

    // Extract set names directly from the initial response
    const sets = response.data.data
      .filter((card: any) => {
        // Exclude digital, promo cards, "The List", and "Secret Lair Drop" sets
        return (
          !card.digital &&
          !card.promo &&
          card.set_name !== "The List" &&
          card.set !== "sld"
        );
      })
      .map((card: any) => ({
        set: card.set_name,
        released_at: card.released_at,
        image_url: card.image_uris?.normal || "",
      }));

    return { cardName, sets };
  } catch (error) {
    console.error(`Error fetching information for card ${cardName}:`, error);
    // Return a specific error message when there's an issue fetching data from the API
    return {
      cardName,
      sets: [{ set: `Error fetching ${cardName}`, released_at: "" }],
    };
  }
};
