const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
          return new HDWalletProvider("uphold shell taste assist wrestle festival antique century gorilla lazy poverty vicious","https://rinkeby.infura.io/v3/77e04aa05e7442249070ecbc5e0552cc")
        },

        network_id: "4",
        from:"0x49d15e7c94B1ae3C273E29Bd8faF863157b2cf92"

       }
    }
};
