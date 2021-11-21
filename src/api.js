const API_KEY =
  "5ee49f669c83916ffe960a68640e5c4812f4d8ceac618f85cdf03cb66e54b1a1";

const tickersHandlers = new Map();
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const AGGREGATE_INDEX = "5";

const CROSS_CURRENCY = "BTC";

let CROSS_CURRENCY_PRICE = 0;

socket.addEventListener("message", e => {
  let {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
    MESSAGE: message
  } = JSON.parse(e.data);

  if (currency === CROSS_CURRENCY) {
    CROSS_CURRENCY_PRICE = newPrice;
  }

  if (type !== AGGREGATE_INDEX || newPrice === undefined) return;

  if (currency !== CROSS_CURRENCY) {
    newPrice = newPrice * CROSS_CURRENCY_PRICE;
  }

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach(fn => fn(newPrice, message !== "INVALID_SUB"));
});

const sendToWebSocket = message => {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    {
      once: true
    }
  );
};

const subscribeToTickerOnWs = (ticker, currency = "BTC") => {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~${currency}`]
  });
};

const unsubscribeToTickerOnWs = ticker => {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~BTC`]
  });
};

subscribeToTickerOnWs(CROSS_CURRENCY, "USD");

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = ticker => {
  tickersHandlers.delete(ticker);
  unsubscribeToTickerOnWs(ticker);
};
