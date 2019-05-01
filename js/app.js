App = {
    web3Provider: null,
    contracts: {},
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",


    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },


    readForm: function () {
        App.upc = $("#upc").val();
        App.originFarmName = $("#FN").val();
        App.originFarmInformation = $("#FI").val();
        App.originFarmLatitude = $("#FLA").val();
        App.originFarmLongitude = $("#FLO").val();
        App.productNotes = $("#PN").val();
        App.productPrice = $("#PP").val();


    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            console.log(App.web3Provider);
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        //App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        //App.getMetaskAccountID();
        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }

            App.metamaskAccountID = res[0];
            if (res.length > 1){
            document.getElementById("divType").innerText = "Ganache Address"
            console.log("Using Ganache");
            App.FarmerID = res[1];
            document.getElementById("farmerID").value = App.originFarmerID;
            App.DistributorID = res[2];
            document.getElementById("distributorID").value = App.DistributorID;
            App.RetailerID = res[3];
            document.getElementById("retailerID").value = App.RetailerID;
            App.ConsumerID = res[4];
            document.getElementById("consumerID").value = App.ConsumerID;
          }else{
            document.getElementById("divType").innerText = "Using MetaMask Address"
            App.originFarmerID = document.getElementById("farmerID").value;
            App.DistributorID = document.getElementById("distributorID").value;
            App.RetailerID = document.getElementById("retailerID").value;
            App.ConsumerID = document.getElementById("consumerID").value;
          }

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        //var json
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();
        App.getMetaskAccountID();
        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.addFarmer(event);
                break;
            case 2:
                return await App.addDistributor(event);
                break;
            case 3:
                return await App.addRetailer(event);
                break;
            case 4:
                return await App.addConsumer(event);
                break;
            case 5:
                return await App.fetchItemBufferOne(event);
                break;
            case 6:
                return await App.fetchItemBufferTwo(event);
                break;
            case 7:
                return await App.fetchItemHistory(event);
                break;
            case 8:
                return await App.produceItemByFarmer(event);
                break;
            case 9:
                return await App.sellItemByFarmer(event);
                break;

            case 10:
                return await App.purchaseItemByDistributor(event);
                break;

            case 11:
                return await App.shippedItemByFarmer(event);
                break;

            case 12:
                return await App.receivedItemByDistributor(event);
                break;

            case 13:
                return await App.processedItemByDistributor(event);
                break;

            case 14:
                return await App.packageItemByDistributor(event);
                break;

            case 15:
                return await App.sellItemByDistributor(event);
                break;

            case 16:
                return await App.purchaseItemByRetailer(event);
                break;

            case 17:
                return await App.shippedItemByDistributor(event);
                break;

            case 18:
                return await App.receivedItemByRetailer(event);
                break;

            case 19:
                return await App.sellItemByRetailer(event);
                break;

            case 20:
                return await App.purchaseItemByConsumer(event);
                break;

            }

    },
    //1
    addFarmer: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var resultTag = document.getElementById("isFarmer");
        App.contracts.SupplyChain.deployed().then( async function(instance) {
            resultTag.className = " loader";
            var checkRole = await instance.isFarmer(App.originFarmerID);
            if (checkRole == false){
              await instance.addFarmer(
                  App.originFarmerID,
                  {from: App.metamaskAccountID, gas:3000000}
              );
            }
            sleep(800);
            checkRole = await instance.isFarmer(App.originFarmerID);
            return checkRole;
        }).then(function(result) {
            resultTag.className = " inputFeilds";
            resultTag.innerText = result;
            if (result == true){
                resultTag.style.color = "green"
            }else{
                resultTag.style.color = "red"

            }
        }).catch(function(err) {
          resultTag.className = " inputFeilds";
          resultTag.innerText = "  Error: "+err.message;

        });
    },
    //2
    addDistributor: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var resultTag = document.getElementById("isDistributor");
        App.contracts.SupplyChain.deployed().then( async function(instance) {
            resultTag.className = " loader";
            var checkRole = await instance.isDistributor(App.DistributorID);
            if(checkRole == false){
              await instance.addDistributor(App.DistributorID,
                  {from: App.metamaskAccountID, gas:3000000}

              );
            }
            sleep(800);
            checkRole = await instance.isDistributor(App.DistributorID);
            return checkRole
        }).then(function(result) {
            resultTag.className = " inputFeilds";
            resultTag.innerText = result;
            if (result == true){
                resultTag.style.color = "green"
            }else{
                resultTag.style.color = "red"

            }

        }).catch(function(err) {
          resultTag.innerText = "  Error: "+err.message;
        });
    },
    //3
    addRetailer: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var resultTag = document.getElementById("isRetailer");
        App.contracts.SupplyChain.deployed().then(async function(instance) {
            resultTag.className = " loader";
            var checkRole = await instance.isRetailer(App.RetailerID);
            if (checkRole == false){
              await instance.addRetailer(
                  App.RetailerID,
                  {from: App.metamaskAccountID, gas:3000000}
              );
            }
            sleep(800);
            checkRole = await instance.isRetailer(App.RetailerID);
            return checkRole;
        }).then(function(result) {
            resultTag.className = " inputFeilds";
            resultTag.innerText = result;
            if (result == true){
                resultTag.style.color = "green"
            }else{
                resultTag.style.color = "red"
            }
        }).catch(function(err) {
          resultTag.className = " inputFeilds";
          resultTag.innerText = "  Error: "+err.message;
        });
    },
    //4
    addConsumer: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var resultTag = document.getElementById("isConsumer");
        App.contracts.SupplyChain.deployed().then(async function(instance) {
            resultTag.className = " loader";
            var checkRole = await instance.isConsumer(App.ConsumerID);
            if (checkRole == false){
              await instance.addConsumer(
                  App.ConsumerID,
                  {from: App.metamaskAccountID, gas:3000000}
              );
            }
            sleep(800);
            checkRole = await instance.isConsumer(App.ConsumerID);
            return checkRole;
        }).then(function(result) {
            resultTag.className = " inputFeilds";
            resultTag.innerText = result;
            if (result == true){
                resultTag.style.color = "green"
            }else{
                resultTag.style.color = "red"
            }
        }).catch(function(err) {
          resultTag.className = " inputFeilds";
          resultTag.innerText = "  Error: "+err.message;
        });
    },



    //5
    produceItemByFarmer: function(event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var resultTag = document.getElementById("pr");
        var upc = $("#upc").val();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            resultTag.className = " loader";
            return instance.produceItemByFarmer(
                upc,
                App.originFarmName,
                App.originFarmInformation,
                App.originFarmLatitude,
                App.originFarmLongitude,
                App.productNotes,
                App.productPrice,
                {from: App.originFarmerID, gas:3000000}
            );
        }).then(function(result) {
            resultTag.className = " font";
            resultTag.innerText = "  Tx Hash: "+result.tx;
        }).catch(function(err) {
          resultTag.className = " font";
          resultTag.innerText = "  Error: "+err.message;
        });
    },

    //6
    sellItemByFarmer: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var price = document.getElementById("sellprice").value;
        var upc = document.getElementById("sellupc").value;
        var resultTag = document.getElementById("srf");
        App.contracts.SupplyChain.deployed().then(function(instance) {
            resultTag.className = " loader";
            return instance.sellItemByFarmer(upc,price, {from: App.originFarmerID,gas:3000000});
        }).then(function(result) {
          resultTag.className = " font";
          resultTag.innerText = "  Tx Hash: "+result.tx;
        }).catch(function(err) {
          resultTag.className = " font";
          resultTag.innerText = "  Error: "+err.message;
        });
    },

    purchaseItemByDistributor: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var upc = document.getElementById("purchaseupc").value;
        var resultTag = document.getElementById("pid");
        App.contracts.SupplyChain.deployed().then(function(instance) {
            resultTag.className = " loader";
            return instance.fetchItemBufferTwo(upc);
          }).then(function(result) {
            var price = result[4].c[0];
            var balance = window.web3.toWei(price, 'ether');
            App.contracts.SupplyChain.deployed().then(function(instance) {
              return instance.purchaseItemByDistributor(upc, {from: App.DistributorID, value:balance });
            }).then(function(result) {
              resultTag.className = " font";
              resultTag.innerText = "  Tx Hash: "+result.tx;
          }).catch(function(err) {
              resultTag.className = " font";
              resultTag.innerText = "  Error: "+err.message;

          });
        }).catch(function(err) {
          resultTag.className = " font";
          resultTag.innerText = "  Error: "+err.message;

        });

    },


    shippedItemByFarmer: function (event) {
      event.preventDefault();
      var processId = parseInt($(event.target).data('id'));
      var upc = document.getElementById("shipupc").value;
      var resultTag = document.getElementById("sibf");
      App.contracts.SupplyChain.deployed().then(function(instance) {
          resultTag.className = " loader";
          return instance.shippedItemByFarmer(upc, {from: App.FarmerID,gas:3000000});
      }).then(function(result) {
          resultTag.className = " font";
          resultTag.innerText = "  Tx Hash: "+result.tx;
      }).catch(function(err) {
          resultTag.className = " font";
          resultTag.innerText = "  Error: "+err.message;
      });
    },

    receivedItemByDistributor: function (event) {
      event.preventDefault();
      var processId = parseInt($(event.target).data('id'));
      var upc = document.getElementById("receiveupc").value;
      var resultTag = document.getElementById("ribd");
      App.contracts.SupplyChain.deployed().then(function(instance) {
          resultTag.className = " loader";
          return instance.receivedItemByDistributor(upc, {from: App.DistributorID});
      }).then(function(result) {
        resultTag.className = " font";
        resultTag.innerText = "  Tx Hash: "+result.tx;
      }).catch(function(err) {
        resultTag.className = " font";
        resultTag.innerText = "  Error: "+err.message;
      });
    },

    processedItemByDistributor: function (event) {
      event.preventDefault();
      var processId = parseInt($(event.target).data('id'));
      var upc = document.getElementById("processupc").value;
      var sliceNumber = document.getElementById("processnumber").value;
      var resultTag = document.getElementById("pibd");
      App.contracts.SupplyChain.deployed().then(function(instance) {
          resultTag.className = " loader";
          return instance.processedItemByDistributor(upc,sliceNumber, {from: App.DistributorID});
      }).then(function(result) {
        resultTag.className = " font";
        resultTag.innerText = "  Tx Hash: "+result.tx;
      }).catch(function(err) {
          resultTag.className = " font";
          resultTag.innerText = "  Error: "+err.message;
      });
    },

    packageItemByDistributor: function (event) {
      event.preventDefault();
      var processId = parseInt($(event.target).data('id'));
      var upc = document.getElementById("packageupc").value;
      var resultTag = document.getElementById("paibd");
      App.contracts.SupplyChain.deployed().then(function(instance) {
          resultTag.className = " loader";
          return instance.packageItemByDistributor(upc, {from: App.DistributorID});
      }).then(function(result) {
        resultTag.className = " font";
        resultTag.innerText = "  Tx Hash: "+result.tx;
      }).catch(function(err) {
        resultTag.className = " font";
        resultTag.innerText = "  Error: "+err.message;
      });
    },

    sellItemByDistributor: function (event) {
      event.preventDefault();
      var processId = parseInt($(event.target).data('id'));
      var upc = document.getElementById("sellupc").value;
      var price = document.getElementById("sellprice").value;
      var resultTag = document.getElementById("srd");
      App.contracts.SupplyChain.deployed().then(function(instance) {
          resultTag.className = " loader";
          return instance.sellItemByDistributor(upc,price ,{from: App.DistributorID});
      }).then(function(result) {
          resultTag.className = " font";
          resultTag.innerText = "  Tx Hash: "+result.tx;
          console.log('sellItemByDistributor',result);
      }).catch(function(err) {
          resultTag.className = " font";
          resultTag.innerText = "  Error: "+err.message;
          console.log(err.message);
      });
    },

    purchaseItemByRetailer: function (event) {
      event.preventDefault();
      var processId = parseInt($(event.target).data('id'));
      var upc = document.getElementById("purchaseupc").value;
      var resultTag = document.getElementById("pir");
      App.contracts.SupplyChain.deployed().then(function(instance) {
          resultTag.className = " loader";
          return instance.fetchItemBufferTwo(upc);
        }).then(function(result) {
          var price = result[4].c[0];
          var balance = window.web3.toWei(price, 'ether');
          App.contracts.SupplyChain.deployed().then(function(instance) {
              return instance.purchaseItemByRetailer(upc, {from: App.RetailerID,value:balance,gas:3000000});
          }).then(function(result) {
              resultTag.className = " font";
              resultTag.innerText = "  Tx Hash: "+result.tx;
              console.log('purchaseItemByRetailer',result);
          }).catch(function(err) {
              resultTag.className = " font";
              resultTag.innerText = "  Error: "+err.message;
              console.log(err.message);
          });
        }).catch(function(err) {
            resultTag.className = " font";
            resultTag.innerText = "  Error: "+err.message;
            console.log(err.message);
        });
    },

    shippedItemByDistributor: function (event) {
      event.preventDefault();
      var processId = parseInt($(event.target).data('id'));
      var upc = document.getElementById("shipupc").value;
      var resultTag = document.getElementById("sibd");
      App.contracts.SupplyChain.deployed().then(function(instance) {
          resultTag.className = " loader";
          return instance.shippedItemByDistributor(upc, {from: App.DistributorID});
      }).then(function(result) {
          resultTag.className = " font";
          resultTag.innerText = "  Tx Hash: "+result.tx;
          console.log('shippedItemByDistributor',result);
      }).catch(function(err) {
          resultTag.className = " font";
          resultTag.innerText = "  Error: "+err.message;
          console.log(err.message);
      });
    },

    receivedItemByRetailer: function (event) {
      event.preventDefault();
      var processId = parseInt($(event.target).data('id'));
      var upc = document.getElementById("receiveupc").value;
      var resultTag = document.getElementById("ribr");
      App.contracts.SupplyChain.deployed().then(function(instance) {
          resultTag.className = " loader";
          return instance.receivedItemByRetailer(upc, {from: App.RetailerID});
      }).then(function(result) {
          resultTag.className = " font";
          resultTag.innerText = "  Tx Hash: "+result.tx;
          console.log('receivedItemByRetailer',result);
      }).catch(function(err) {
          resultTag.className = " font";
          resultTag.innerText = "  Error: "+err.message;
          console.log(err.message);
      });
    },
    sellItemByRetailer: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var upc = document.getElementById("sellupc").value;
        var resultTag = document.getElementById("sibr");
        var price = document.getElementById("sellprice").value;
        App.contracts.SupplyChain.deployed().then(function(instance) {
            resultTag.className = " loader";
            return instance.sellItemByRetailer(upc,price, {from: App.RetailerID});
        }).then(function(result) {
            resultTag.className = " font";
            resultTag.innerText = "  Tx Hash: "+result.tx;
            console.log('sellItemByRetailer',result);
        }).catch(function(err) {
            resultTag.className = " font";
            resultTag.innerText = "  Error: "+err.message;
            console.log(err.message);
        });
    },
    purchaseItemByConsumer: function (event) {
      event.preventDefault();
      var processId = parseInt($(event.target).data('id'));
      var upc = document.getElementById("purchaseupc").value;
      var resultTag = document.getElementById("pic")
      App.contracts.SupplyChain.deployed().then(function(instance) {
          resultTag.className = " loader";
          return instance.fetchItemBufferTwo(upc);
        }).then(function(result) {
          var price = result[4].c[0];
          var balance = window.web3.toWei(price, 'ether');
          App.contracts.SupplyChain.deployed().then(function(instance) {
              return instance.purchaseItemByConsumer(upc, {from: App.ConsumerID,value:balance,gas:3000000});
          }).then(function(result) {
              resultTag.className = " font";
              resultTag.innerText = "  Tx Hash: "+result.tx;
          }).catch(function(err) {
              resultTag.className = " font";
              resultTag.innerText = "  Error: "+err.message;
          });
        }).catch(function(err) {
            resultTag.className = " font";
            resultTag.innerText = "  Error: "+err.message;
        });
    },

    fetchItemBufferOne: function () {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var displayTo = document.getElementById("BlockInfoBufferOne");
        var upc = $('#upc1').val();
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne(upc);
        }).then(function(result) {
          while (displayTo.firstChild) {
              displayTo.removeChild(displayTo.firstChild);
          }
          var myDate = new Date(result[8].c[0] *1000);
          displayTo.innerHTML = (

          "SKU: "+result[0]+"<br>"+
          "UPC: "+result[1]+"<br>"+
          "Owner ID: "+result[2]+"<br>"+
          "Origin Farmer ID: "+result[3]+"<br>"+
          "Origin Farm Name: "+result[4]+"<br>"+
          "Origin Farm Information: "+result[5]+"<br>"+
          "Origin Farm Latitude: "+result[6]+"<br>"+
          "Origin Farm Longitude: "+result[7]+"<br>"+
          "Product Date: "+myDate+"<br>"+
          "Product Sliced: "+result[9]);

        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var displayTo = document.getElementById("BlockInfoBufferOne");
        var upc = $('#upc1').val();
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(upc,{from:App.metamaskAccountID,gas:3000000});
        }).then(function(result) {
          while (displayTo.firstChild) {
              displayTo.removeChild(displayTo.firstChild);
          }

          var myDate = new Date(result[5].c[0] *1000);

          displayTo.innerHTML = (
          "SKU: "+result[0]+"<br>"+
          "UPC: "+result[1]+"<br>"+
          "Product ID: "+result[2]+"<br>"+
          "Product Notes: "+result[3]+"<br>"+
          "Product Price: "+result[4]+"<br>"+
          "Product Date: "+myDate+"<br>"+
          "Item State: "+result[6]+"<br>"+
          "Distributor ID: "+result[7]+"<br>"+
          "Retailer ID: "+result[8]+"<br>"+
          "Consumer ID: "+result[9]);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemHistory: function () {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        var upc = $('#upc1').val();
        var displayTo = document.getElementById("BlockInfoBufferOne");
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.fetchitemHistory(upc);
        }).then(function(result) {
          displayTo.innerHTML = (
          "Farmer To Distributor transaction at block "+result[0]+"<br>"+
          "Distributor To Retailer transaction at block "+result[1]+"<br>"+
          "Retailer To Comsumer transaction at block "+result[2]+"<br>");
        }).catch(function(err) {
            console.log(err.message);
        });
    },

};

$(function () {
    $(window).load(function () {
        App.init();
    });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
