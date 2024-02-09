import axios from "axios";

export const getSetsFromCard = async (
  cardName: string,
  printOption: string
) => {
  try {
    const response = await axios.get(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(
        cardName
      )}&unique=prints`
    );

    // If the card is not found in the API, return a specific error message
    if (response.data.data.length === 0) {
      return { cardName, set: `${cardName} not found` };
    }

    // Extract set names directly from the initial response
    const setNames = response.data.data
      .filter((card: any) => !card.promo)
      .map((card: any) => card.set_name);

    // Sort the set names in chronological order (newest first)
    setNames.sort((a, b) => {
      const dateA = new Date(
        response.data.data.find((c: any) => c.set_name === a)?.released_at
      );
      const dateB = new Date(
        response.data.data.find((c: any) => c.set_name === b)?.released_at
      );
      return dateB.getTime() - dateA.getTime();
    });

    const chosenSet =
      printOption === "Original Printing"
        ? setNames[setNames.length - 1]
        : setNames[0];

    return { cardName, set: chosenSet };
  } catch (error) {
    console.error(`Error fetching information for card ${cardName}:`, error);
    // Return a specific error message when there's an issue fetching data from the API
    return { cardName, set: `Error fetching ${cardName}` };
  }
};
