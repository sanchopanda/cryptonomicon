const API_KEY =
  "5ee49f669c83916ffe960a68640e5c4812f4d8ceac618f85cdf03cb66e54b1a1";

export const loadTicker = tickers => {
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers.join(
      ","
    )}&api_key=${API_KEY}`
  )
    .then(r => r.json())
    .then(rawData => {
      return Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, 1 / value])
      );
    });
};
