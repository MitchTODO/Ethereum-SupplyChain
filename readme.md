# Parmigiano Reggiano blockchain

## Description

A supplychain smart contract written in Solidity and deployed on the Rinkeby test network. This Smart contract demonstrates how supplychains can improve authenticity, efficiency and privacy between seller and buyer.

 The smart Contracts simulates the Parmigiano Reggiano supplychain.

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

### Modifiers

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





### Events

Each supplychain function emits its own event.

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

Access control is implemented by contracts found within the "parmigianoaccesscontrol" directory that are inherited by the supplychain. Consisting of four contracts for each actor of the supplychain (Farmer,Distributor,Retailer and Consumer). Each contract contains a function that allows an address to be added to that role and is only permitted by the contract owner. Contract modifiers are used to enforce access controls within the supplychain.



### Supplychain

16 functions make up the Parmigiano Reggiano supplychain, including the validation functions.


__SupplyChain Function Modifiers and Events__

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

The consumer can check authenticity by calling out fetchItemBufferOne() with the upc as input, this will return essential consumer information.

![alt text](/readmepic/pic3.png "Pic")

Additional information can be received by calling out fetchItemBufferTwo this will return information essential to the supplychain.

![alt text](/readmepic/pic4.png "Pic")

ItemHistory returns three block numbers of where ownership of the item changed.

![alt text](/readmepic/pic5.png "Pic")

---


## TestSupplychain.js

Used to test the all 16 supplychain functions, all test pass the requirements.

![alt text](/readmepic/pic1.png "All test pass")


## Dapp

I do find my UI a little difficult to use, but settled on the third revision.

### Adding roles to address (simulating users)

_Note must be sent from the contract owner_

![alt text](/readmepic/pic8.png "Pic")


### SupplyChain

![alt text](/readmepic/pic2.png "Pic")

![alt text](/readmepic/pic6.png "Pic")

![alt text](/readmepic/pic7.png "Pic")

## Versions

Compiler: solc: 0.5.0+commit.1d4f565a.Emscripten.clang

Truffle: v5.0.14

Node: v11.3.0

## Deployed to Rinkeby

Contract Address: https://rinkeby.etherscan.io/address/0xfd5f80e2a7cd15b011c7f1ce7e74a89e2c97fbd8

Contract Creator: https://rinkeby.etherscan.io/address/0x49d15e7c94b1ae3c273e29bd8faf863157b2cf92

Tx Hash of contract creation :https://rinkeby.etherscan.io/tx/0xec2a4f9210ff68ff6b3227575ce9719a02198e0d64612263263b005f94b8f3a3

## Quick Start

1. cd into project repro

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

6. Testing on ganache

        truffle test


7. Start FrontEnd DApp on ganache

          npm run dev

8. Migrating to Rinkeby

_Note Change truffle settings to your Contract Creator address within the "from" rinkeby configuration_

        truffle migrate --network rinkeby  --reset --all

9. Start FrontEnd DApp on Rinkeby

        npm run dev


## Sources

Understanding Parmigiano Reggiano supplychain https://www.academia.edu/2722756/The_supply_chain_for_Parmigiano-Reggiano_cheese_in_the_United_States

Creating diagrams https://www.draw.io/
