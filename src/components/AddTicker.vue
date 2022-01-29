<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            @keydown.enter="add"
            @input="handleInput"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>
        <div
          v-if="autocompleteList.length"
          class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
        >
          <template v-for="(ticker, i) in autocompleteList">
            <span
              v-if="i < 4"
              :key="i"
              @click="autocomplete(ticker)"
              class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
            >
              {{ ticker }}
            </span>
          </template>
        </div>
        <div v-if="error" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <button
      @click="add"
      type="button"
      :disabled="tooManyTickers"
      class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      :class="{
        'opacity-50': disabled
      }"
    >
      <!-- Heroicon name: solid/mail -->
      <svg
        class="-ml-0.5 mr-2 h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="#ffffff"
      >
        <path
          d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        ></path>
      </svg>
      Добавить
    </button>
  </section>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }, 
    tickerList: {
      type: Array,
      required: true
    },
    tickers: {
      type: Array,
      required: true
    }
  },
  emits: {
    "add-ticker": value => typeof value === "string"
  },
  data() {
    return {
      ticker: "",
      autocompleteList: [],
      error: false
    };
  },
  methods: {
    add() {
       if (this.tickers.find(t => t.name === this.ticker.toUpperCase())) {
        this.error = true;
        return;
      } else {
        this.error = false;
        this.autocompleteList = [];
         this.$emit("add-ticker", this.ticker);
        this.ticker = "";
      }     
    },
    handleInput() {
      this.error = false;
      if (this.ticker === "") {
        this.autocompleteList = [];
      } else {
        this.autocompleteList = this.tickerList.filter(t => {
          if (t.toUpperCase().includes(this.ticker.toUpperCase())) return t;
        });
      }
    },
     autocomplete(ticker) {
      this.ticker = ticker;
      this.add();
    },
  },
  computed: {
     tooManyTickers() {
      return this.tickers.length > 4;
    }
  }
};
</script>
