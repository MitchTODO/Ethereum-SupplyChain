# Parmigiano Reggiano blockchain

## Description

A supply chain smart contract written in Solidity and deployed on the Rinkeby test network. This Smart contract demonstrates how smart contracts will improve authenticity, efficiency and privacy between seller and buyer Supply Chains.

 The supply chain used is the Parmigiano Reggiano supply chain.

## Directory Structor

```
Ethereum_SupplyChian--|
                      |--- Diagrams
                      |       |
                      |       |---Parmigiano_Reggiano_Activity_Diagram.png
                      |       |  
                      |       |---Parmigiano_Reggiano_DataModel_Diagram.png
                      |       |   
                      |       |---Parmigiano_Reggiano_Sequence_Diagram.png  
                      |       |
                      |       |---Parmigiano_Reggiano_State_Diagram.png
                      |
                      |  
                      |--- build/contracts (compiled contracts)
                      |       |      
                      |       |---ConsumerRole.json
                      |       |
                      |       |---DistributorRole.json
                      |       |
                      |       |---FarmerRole.json
                      |       |
                      |       |---Mirgations.json
                      |       |
                      |       |---Ownable.json
                      |       |
                      |       |---RetailerRole.json
                      |       |
                      |       |---Roles.json
                      |       |
                      |       |---SupplyChain.json
                      |
                      |
                      |--- contracts
                      |       |        
                      |       |---parmigianoaccesscontrol
                      |       |        |   
                      |       |        |---ConsumerRole.sol
                      |       |        |
                      |       |        |---Distributor.sol
                      |       |        |
                      |       |        |---FarmerRole.sol
                      |       |        |
                      |       |        |---RetailerRole.sol
                      |       |        |
                      |       |        |---Roles.sol
                      |       |
                      |       |---parmigianobase
                      |       |        |
                      |       |        |---SupplyChain.sol
                      |       |
                      |       |---parmigianocore
                      |       |        |
                      |       |        |---Ownable.sol
                      |       |
                      |       |---Migrations.sol
                      |       
                      |--- migrations
                      |       |
                      |       |---1_initial_migration.js
                      |       |
                      |       |---2_deploy_contracts.js
                      |
                      |--- js
                      |       |
                      |       |--app.js
                      |       |
                      |       |---truffle-contract.js
                      |
                      |
                      |--- test
                      |       |
                      |       |---TestSupplychain.js
                      |
                      |
                      |--- index.html
                      |
                      |
                      |--- package-lock.json
                      |
                      |
                      |--- package.json
                      |
                      |
                      |--- readme.md
                      |
                      |
                      |--- style.css
                      |
                      |
                      |--- truffle.js
                      |

```

---

## Contract Diagrams

### Activity Diagram

![Activity_Diagram](/Diagrams/Parmigiano_Reggiano_Activity_Diagram.png)


### Sequence Diagram

![Sequence_Diagram](/Diagrams/Parmigiano_Reggiano_Sequence_Diagram.png)

## State Diagram

![State Diagram](/Diagrams/Parmigiano_Reggiano_State_Diagram.png)

## DataModel Diagram

![DataModel Diagram](/Diagrams/Parmigiano_Reggiano_DataModel_Diagram.png)

---

## Solidity Functions

### modifiers

Modifiers can be split in to three groups,

1. Checking ownership and values payed

```js
// Define a modifer that checks to see if msg.sender == owner of the contract
modifier onlyOwner() {
  require(msg.sender == owner);
  _;
}

// Define a modifer that verifies the Caller
modifier verifyCaller (address _address) {
  require(msg.sender == _address);
  _;
}

// Define a modifier that checks if the paid amount is sufficient to cover the price
modifier paidEnough(uint _price) {
  require(msg.value >= _price);
  _;
}

// Define a modifier that checks the price and refunds the remaining balance
modifier checkValue(uint _upc, address payable addressToFund) { // ADDED address payable
  uint _price = items[_upc].productPrice;
  uint  amountToReturn = msg.value - _price;
  addressToFund.transfer(amountToReturn);
  _;
}
```

2. Check the item has passed the previous step of the supplychain.


```js
// itemState : 0
modifier producedByFarmer(uint _upc) {
  require(items[_upc].itemState == State.ProduceByFarmer);
  _;
}
// State : 1
modifier forSaleByFarmer(uint _upc) {
  require(items[_upc].itemState == State.ForSaleByFarmer);
  _;
}
// State : 2
modifier purchasedByDistributor(uint _upc) {
  require(items[_upc].itemState == State.PurchasedByDistributor);
  _;
}
// State : 3
modifier shippedByFarmer(uint _upc) {
  require(items[_upc].itemState == State.ShippedByFarmer);
  _;
}
// State : 4
modifier receivedByDistributor(uint _upc) {
  require(items[_upc].itemState == State.ReceivedByDistributor);
  _;
}
// State : 5
modifier processByDistributor(uint _upc) {
  require(items[_upc].itemState == State.ProcessedByDistributor);
  _;
}
// State : 6
modifier packagedByDistributor(uint _upc) {
  require(items[_upc].itemState == State.PackageByDistributor);
  _;
}
// State : 7
modifier forSaleByDistributor(uint _upc) {
  require(items[_upc].itemState == State.ForSaleByDistributor);
  _;
}

// State : 8
modifier shippedByDistributor(uint _upc) {
  require(items[_upc].itemState == State.ShippedByDistributor);
  _;
}
// State : 9
modifier purchasedByRetailer(uint _upc) {
  require(items[_upc].itemState == State.PurchasedByRetailer);
  _;
}
// State : 10
modifier receivedByRetailer(uint _upc) {
  require(items[_upc].itemState == State.ReceivedByRetailer);
  _;
}
// State : 11
modifier forSaleByRetailer(uint _upc) {
  require(items[_upc].itemState == State.ForSaleByRetailer);
  _;
}
// State : 12
modifier purchasedByConsumer(uint _upc) {
  require(items[_upc].itemState == State.PurchasedByConsumer);
  _;
}
```

3. Role based modifiers inherited from other contracts.

_Note: Used to implement Access Control_

```js
// FarmerRole.sol
modifier onlyFarmer() {
  require(isFarmer(msg.sender));
  _;
}
// DistributorRole.sol
modifier onlyDistributor() {
  require(isDistributor(msg.sender));
  _;
}
// RetailerRole.sol
modifier onlyRetailer() {
   require(isRetailer(msg.sender));
  _;
}
// ConsumerRole.sol
modifier onlyConsumer() {
  require(isConsumer(msg.sender));
  _;
}

```





### events

Each supply chain function emits its own event when successful.

```js
event ProduceByFarmer(uint upc);         //1
event ForSaleByFarmer(uint upc);         //2
event PurchasedByDistributor(uint upc);  //3
event ShippedByFarmer(uint upc);         //4
event ReceivedByDistributor(uint upc);   //5
event ProcessedByDistributor(uint upc);  //6
event PackagedByDistributor(uint upc);   //7
event ForSaleByDistributor(uint upc);    //8
event PurchasedByRetailer(uint upc);     //9
event ShippedByDistributor(uint upc);    //10
event ReceivedByRetailer(uint upc);      //11
event ForSaleByRetailer(uint upc);       //12
event PurchasedByConsumer(uint upc);     //13
```

### Access Control

Access control is implemented by contracts found within the parmigianoaccesscontrol directory that are inherited by the supplychain. Consisting of four contracts for each actor of the supply chain (Farmer,Distributor,Retailer and Consumer). Each contract contains a function that allows a address to be added to that role. This is only premitted by the contract owner. Contract modifiers are used to inforce access controls within the supplychain.



### Supply Chain

16 functions make up the Parmigiano Reggiano supply chain, including the validation functions (fetchItemBufferOne,fetchItemBufferTwo,fetchItemHistory) that are available to all roles.


__SupplyChain Functions__

|SupplyChain Functions                 | Modifiers | Event |
|:---------------------------:|:--------------------:|:-------------:|
|produceItemByFarmer()   |    OnlyFarmer() |         ProduceByFarmer(_upc)         |  
|SellItemByFarmer()      |    OnlyFarmer() <br> producedByFarmer() <br> verifyCaller(items[_upc].ownerID) |     ForSaleByFarmer(_upc)|  
|purchaseItemByDistributor()   | onlyDistributor() <br> forSaleByFarmer(_upc) <br> paidEnough(items[_upc].productPrice) <br> checkValue(_upc, msg.sender)|       PurchasedByDistributor(_upc)         |  
|shippedItemByFarmer()   |    onlyFarmer() <br> purchasedByDistributor(_upc) <br> verifyCaller(items[_upc].originFarmerID) |            ShippedByFarmer(_upc)             |      
|receivedItemByDistributor()   |    onlyDistributor() <br> shippedByFarmer(_upc) <br> verifyCaller(items[_upc].ownerID)| ReceivedByDistributor(_upc)   |  
|processedItemByDistributor()   |    onlyDistributor() <br> receivedByDistributor(_upc) <br> verifyCaller(items[_upc].ownerID) |   ProcessedByDistributor(_upc)           |  
|packageItemByDistributor()   |    onlyDistributor() <br> processByDistributor(_upc) <br> verifyCaller(items[_upc].ownerID) | PackagedByDistributor(_upc)   |  
|sellItemByDistributor()   |    onlyDistributor() <br> packagedByDistributor(_upc) <br> verifyCaller(items[_upc].ownerID)|  ForSaleByDistributor(upc)  |  
|purchaseItemByRetailer   |    onlyRetailer() <br> forSaleByDistributor(_upc) <br> paidEnough(items[_upc].productPrice) <br> checkValue(_upc, msg.sender) |        PurchasedByRetailer(_upc)               |  
|shippedItemByDistributor   |    onlyDistributor() <br> purchasedByRetailer(_upc) <br> verifyCaller(items[_upc].distributorID) |       ShippedByDistributor(_upc)     |  
|receivedItemByRetailer()   |  onlyRetailer() <br> shippedByDistributor(_upc) <br> verifyCaller(items[_upc].ownerID) |     ReceivedByRetailer(_upc)            |  
|sellItemByRetailer()   |    onlyRetailer() <br> receivedByRetailer(_upc) <br> verifyCaller(items[_upc].ownerID) |   ForSaleByRetailer(_upc)    |  
|purchaseItemByConsumer()   |    onlyConsumer() <br> forSaleByRetailer(_upc) <br> paidEnough(items[_upc].productPrice) <br>checkValue(_upc, msg.sender) |         PurchasedByConsumer(_upc)          |  
|fetchItemBufferOne() | Any|           None               |             
|fetchItemBufferTwo() | Any|             None             |                   
|fetchItemHistory() | Any|                  None          |               


### Check Authenticity

The consumer can check authenticity by calling out fetchItemBufferOne() with the upc as input, this will return essential consumer information

```
originFarmerID
originFarmName
originFarmInformation
originFarmLatitude
originFarmLongitude
productDate
projectSliced.
```

Additional information can be received by calling out fetchItemBufferTwo this will return information more essential to the supplychain.
```
sku
upc
productID,
productNotes
productDate
itemState
distributorID
retailerID
consumerID
```

ItemHistory returns three block-numbers of where ownership of the item changed.

```
farmerToDistributor
DistributorToRetailer
RetailerToConsumer
```

---


## TestSupplychain.js

Used to test the all 16 supply-chain functions, all test pass the requirements.

![alt text](/readmepic/pic1.png "All test pass")


## Dapp

I do find my UI a little difficult to used but being the third division I had to settle on something.

Follow the steps to purchase some cheese from the farmer to the consumer.


_Note HTML below does not have javascript enabled for security reasons, go to Quick start to launch this DApp_


<html lang="en"  style= '    height: 500px;
    width: 900px;'>

<head>
    <meta charset="UTF-8">
    <title>Parmigiano reggiano</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>

<body class = "font">
    <h1>Parmigiano Reggiano Supply Chain</h1>
  <div class = "step">
    <p class = "step"> Step 1: Add Address to appropriate role</p>
    <p class = "step" id = "divType"></p>
    <div class = "outline"style = "height: 100px; display: flex;">
        <button class = "button" data-id="1">Add Farmer</button>
        <input id = "farmerID" class = "inputFeilds">
        <p id = "isFarmer" class = "inputFeilds"></p>

    </div>

    <div class = "outline" style = "height: 100px; display: flex;">
        <button class = "button " data-id="2">Add Distributor</button>
        <input id = "distributorID" class = "inputFeilds">
        <p id = "isDistributor" class = "inputFeilds"></p>
    </div>

    <div class = "outline" style = "height: 100px; display: flex;">
        <button class = "button" data-id="3">Add Retailer</button>
        <input id = "retailerID" class = "inputFeilds">
        <p id = "isRetailer" class = "inputFeilds"></p>
    </div>

    <div class = "outline" style = "height: 100px; display: flex;">
        <button class = "button" data-id="4">Add Consumer</button>
        <input id = "consumerID" class = "inputFeilds">
        <p id = "isConsumer" class = "inputFeilds"></p>
    </div>
</div>

<div class = "step">
    <p class = "step ">Validate the authenticity of the product</p>
    <div class = "outline">
        <div class = "contain">
            <p class = 'font'>Universal Product Code:</p><input class = "inputFeilds" id = "upc1">
        </div>
    </div>
    <div class = "outline" style="
    margin: 1%;">
        <button class = "button" data-id="5" style="height: 40px; margin: auto;">Fetch Item BufferOne</button>
        <button class = "button" data-id="6" style="height: 40px; margin: auto;">Fetch Item BufferTwo</button>
        <button class = "button" data-id="7" style="height: 40px; margin: auto;">Fetch Item History</button>
    </div>
    <div id = "BlockInfoBufferOne">

    </div>
</div>

<div class = "step">
    <p class = "step">Farmer Produced Product (ONLY FARMER)</p>
    <div class = "outline">
        <div class = "contain font">
            <p>Origin Farm Name:</p><input id = "FN" class = "inputFeilds" value="Gonzaga P.pe Corrado" >
            <p>Origin Farm Information:</p><input id = "FI" class = "inputFeilds" value="Province of Parma, Italy" >
            <p>Origin Farm Latitude:</p><input id = "FLA" class = "inputFeilds" value="44 48 01.5">
            <p>Origin Farm Longitiude:</p><input id = "FLO" class = "inputFeilds" value="10 19 51.4">
            <p>Product Notes:</p><input id = "PN" class = "inputFeilds" value="Grade A">
            <p>Product Price:</p><input id = "PP" class = "inputFeilds" value="899" >
            <p>Universal Product Code:</p><input  id = "upc" class = "inputFeilds" value = "1" type="number">
        </div>
    </div>
    <div class = "outline" style="
    margin: 1%;">
        <button class = "button" data-id="8">Step 2: Produce Item By Farmer</button>
        <p id = "pr" class = "font">
        </p>
    </div>
</div>

<div class = "step">
    <p class = "step">Process Product (ONLY DISTRIBUTOR) </p>
    <div class = "outline">
        <div class = "contain font">
            <p>Universal Product Code:</p><input id = "processupc" class = "inputFeilds">
            <p>Number of cheese slices:</p><input id = "processnumber" type="number" class = "inputFeilds">
        </div>
    </div>
    <div>
    <div class = "outline" style="margin: 1%;">
        <button class = "button" data-id="13"> Step 7: Process Item By Distributor</button>
        <p id = "pibd" class = "font"></p>
    </div>
  </div>
</div>

<div class = "step">
    <p class = "step">Package Product (ONLY DISTRIBUTOR) </p>
    <div class = "outline">
        <div class = "contain font">
            <p>Universal Product Code:</p><input id = "packageupc" class = "inputFeilds">
        </div>
    </div>
    <div class = "outline" style="margin: 1%; display: flex;">
        <button class = "button" data-id="14"> Step 8: Package Item By Distributor</button>
        <p id = "paibd" class = "font"></p>
    </div>
</div>

<div class = "step">
    <p class = "step">Sell Product </p>
    <div class = "outline">
        <div class = "contain font">
            <p>Universal Product Code:</p><input id = "sellupc" class = "inputFeilds">
            <p>Product Price:</p><input id = "sellprice"  class = "inputFeilds">
        </div>
    </div>
    <div class = "outline" style="margin: 1%; display: flex;">
        <button class = "button" data-id="9">Step 3: Sell Item By Farmer</button>
        <p id = "srf" class = "font"></p>
    </div>
    <div class = "outline" style="margin: 1%; display: flex;">
        <button class = "button" data-id="15">Step 9: Sell Item By Distributor</button>
        <p id = "srd" class = "font"></p>
    </div>
    <div class = "outline" style="margin: 1%; display: flex;">
        <button class = "button" data-id="19">Step 13: Sell Item By Retailer</button>
          <p id = "sibr" class = "font"></p>
    </div>
</div>
<div class = "step">
    <p class = "step">Purchased Product </p>
    <div class = "outline">
        <div class = "contain">
            <p>Universal Product Code:</p><input id = "purchaseupc" class = "inputFeilds">
        </div>
    </div>

      <div class = "outline" style="margin: 1%; display: flex;">
        <button class = "button" data-id="10">Step 4: Purchase Item By Distributor</button>
        <p id = "pid" class = "font"></p>
      </div>
      <div class = "outline" style="margin: 1%; display: flex;">
        <button class = "button" data-id="16" >Step 10: Purchase Item By Retailer</button>
        <p id = "pir" class = "font"></p>
      </div>
      <div class = "outline" style="margin: 1%; display: flex;">
        <button class = "button" data-id="20">Step 14: Purchase Item By Consumer</button>
        <p id = "pic" class = "font"></p>
      </div>
  </div>

<div class = "step">
    <p class = "step">Ship Product </p>
    <div class = "outline">
        <div class = "contain">
            <p>Universal Product Code:</p><input id = "shipupc" class = "inputFeilds">
        </div>
    </div>
    <div class = "outline" style="margin: 1%;">
        <button class = "button" data-id="11" >Step 5: Ship Item By Farmer</button>
        <p id = "sibf" class = "font"></p>
    </div>
    <div class = "outline" style="margin: 1%;">
        <button class = "button" data-id="17" >Step 11: Ship Item By Distributor</button>
        <p id = "sibd" class = "font"></p>
    </div>
</div>

<div class = "step">
    <p class = "step">Received Product </p>
    <div class = "outline">
        <div class = "contain">
            <p>Universal Product Code:</p><input id = "receiveupc" class = "inputFeilds">
        </div>
    </div>
    <div class = "outline" style="margin: 1%;">
        <button class = "button" data-id="12">Step 6: Received Item By Distributor</button>
        <p id = "ribd" class = "font"></p>
    </div>
    <div class = "outline" style="margin: 1%;">
        <button class = "button" data-id="18">Step 12: Received Item By Retailer</button>
        <p id = "ribr" class = "font"></p>
    </div>
</div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- <script src="js/web3.min.js"></script> -->
    <script src="js/truffle-contract.js"></script>
    <script src="js/app.js"></script>
</body>


</html>


## Versions

Compiler: solc: 0.5.0+commit.1d4f565a.Emscripten.clang

Truffle: v5.0.14

Node: v11.3.0

## Deployed to Rinkeby

Contract Address: https://rinkeby.etherscan.io/address/0xfd5f80e2a7cd15b011c7f1ce7e74a89e2c97fbd8

Contract Creator: https://rinkeby.etherscan.io/address/0x49d15e7c94b1ae3c273e29bd8faf863157b2cf92

## Quick Start

1. Go into project repro

        cd Ethereum_SupplyChain

2. download node libraries

        npm install

3. Download/Start ganache

https://truffleframework.com/ganache

4. Compiling contracts

        truffle compile


5. Migrating to ganache

_Note depending on ganache cli/ui you my need to change truffle.js port settings Current listing on port : 7545_

        truffle migrate --network development  --reset --all

6. Testing

        truffle test


7. Start FrontEnd DApp on ganache

          npm run dev

8. Migrating to Rinkeby

        truffle migrate --network rinkeby  --reset --all

9. Start FrontEnd DApp on Rinkeby

        npm run dev


## Sources

Understanding Parmigiano Reggiano supply chain https://www.academia.edu/2722756/The_supply_chain_for_Parmigiano-Reggiano_cheese_in_the_United_States

Creating diagrams https://www.draw.io/
