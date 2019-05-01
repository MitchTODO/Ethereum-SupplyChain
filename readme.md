# Parmigiano Reggiano blockchain

## Description

A supply chain smart contract written in Solidity and deployed on the Rinkeby test network. This Smart contract demonstrates how smart contracts will improve authenticity, efficiency and privacy between seller and buyer Supply Chains .

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

## Contract Architecture

### Activity Diagram

![Activity_Diagram](/Diagrams/Parmigiano_Reggiano_Activity_Diagram.png)


### Sequence Diagram

![Sequence_Diagram](/Diagrams/Parmigiano_Reggiano_Sequence_Diagram.png)

## State Diagram

![State Diagram](/Diagrams/Parmigiano_Reggiano_State_Diagram.png)

## DataModel Diagram

![DataModel Diagram](/Diagrams/Parmigiano_Reggiano_DataModel_Diagram.png)

---

## Solidity SupplyChain Functions

### produceItemByFarmer

### 

## Access Control

Contract owner allows for other address to be added

## Authenticity


## Versions

## Testing

## App.js

## Quick Start

### Deploying to ganache

### Deploying to Rinkeby


## Sources

Understanding Parmigiano Reggiano supply chain https://www.academia.edu/2722756/The_supply_chain_for_Parmigiano-Reggiano_cheese_in_the_United_States

Creating diagrams https://www.draw.io/
