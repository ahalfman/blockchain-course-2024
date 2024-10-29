// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment the line to use openzeppelin/ERC721,ERC20
// You can use this dependency directly because it has been installed by TA already
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "hardhat/console.sol";
import "./ERCPoint.sol";


contract BuyMyRoom is ERC721 {

    // use a event if you want
    // to represent time you can choose block.timestamp
    event HouseList(uint256 tokenId, uint256 price, address owner);
    event HouseDelist(uint256 tokenId, address owner);
    event HouseSell(uint256 tokenId, uint256 price, address seller, address buyer);

    // maybe you need a struct to store house information
    struct House {
        uint256 tokenId;
        address owner;
        bool isListed;
        uint256 listedTimestamp;
        uint256 price;
    }

    address private deployer;
    uint256 private allocatedId = 0;
    mapping(uint256 => House) public houses;

    uint256 private feeRate = 1; // 手续费比例 1‰

    ERCPoint public ercPoint;

    constructor() ERC721("BuyMyRoom", "BYMR") {
        // maybe you need a constructor
        deployer = msg.sender;
        ercPoint = new ERCPoint();
    }

    // 创建房屋
    function createHouse(address owner) public returns(uint256) {
        require(deployer == msg.sender, "Invalid deployer");
        uint256 newId = allocatedId ++;
        _safeMint(owner, newId);
        houses[newId] = House({
            tokenId: newId,
            owner: owner,
            isListed: false,
            listedTimestamp: 0,
            price: 0
        });
        return newId;
    }
    
    // 获取我的房屋列表
    function getMyHouses() public view returns(House[] memory) {
        uint count = 0;
        for (uint i = 0; i < allocatedId; i++) {
            if (houses[i].owner == msg.sender) {
                count++;
            }
        }
        uint counter = 0;
        House[] memory myhouses = new House[](count);
        for (uint i = 0; i < allocatedId; i++) {
            if (houses[i].owner == msg.sender) {
                myhouses[counter++] = House({
                    tokenId: houses[i].tokenId,
                    owner: houses[i].owner,
                    isListed: houses[i].isListed,
                    listedTimestamp: houses[i].listedTimestamp,
                    price: houses[i].price
                });
            }
        }
        return myhouses;
    }

    // 获取已上架房屋列表
    function getHousesListed() public view returns(House[] memory) {
        uint count = 0;
        for (uint i = 0; i < allocatedId; i++) {
            if (houses[i].isListed) {
                count++;
            }
        }
        uint counter = 0;
        House[] memory listedhouses = new House[](count);
        for (uint i = 0; i < allocatedId; i++) {
            if (houses[i].isListed) {
                listedhouses[counter++] = House({
                    tokenId: houses[i].tokenId,
                    owner: houses[i].owner,
                    isListed: houses[i].isListed,
                    listedTimestamp: houses[i].listedTimestamp,
                    price: houses[i].price
                });
            }
        }
        return listedhouses;
    }

    // 上架房屋
    function listHouse(uint256 tokenId, uint256 price) public {
        require(houses[tokenId].owner == msg.sender, "You are not the owner of this house");
        houses[tokenId].price = price;
        houses[tokenId].isListed = true;
        houses[tokenId].listedTimestamp = block.timestamp;
        emit HouseList(tokenId, price, msg.sender);
    }

    // 下架房屋
    function delistHouse(uint256 tokenId) public {
        require(houses[tokenId].owner == msg.sender, "You are not the owner of this house");
        houses[tokenId].price = 0;
        houses[tokenId].isListed = false;
        houses[tokenId].listedTimestamp = 0;
        emit HouseDelist(tokenId, msg.sender);
    }

    // 购买房屋
    function buyHouse(uint256 tokenId) public payable {
        uint256 price = houses[tokenId].price;
        address seller = houses[tokenId].owner;

        uint256 fee = (block.timestamp - houses[tokenId].listedTimestamp) * feeRate * price / 1000;
        if (fee > price) fee = price;
        uint256 amount = price - fee;

        // 所有权转移
        _transfer(seller, msg.sender, tokenId);
        // 支付
        payable(seller).transfer(amount * 1 ether);
        payable(deployer).transfer(fee * 1 ether);

        houses[tokenId].owner = msg.sender;
        houses[tokenId].isListed = false;
        houses[tokenId].listedTimestamp = 0;
        houses[tokenId].price = 0;

        emit HouseSell(tokenId, price, seller, msg.sender);
    }

    // 购买房屋(使用ERCPoint代币)
    function buyHouseWithPoint(uint256 tokenId) public {
        uint256 price = houses[tokenId].price;
        address seller = houses[tokenId].owner;

        uint256 fee = (block.timestamp - houses[tokenId].listedTimestamp) * feeRate * price / 1000;
        if (fee > price) fee = price;
        uint256 amount = price - fee;

        // 所有权转移
        _transfer(seller, msg.sender, tokenId);
        // 支付
        ercPoint.transferFrom(msg.sender, seller, amount);
        ercPoint.transferFrom(msg.sender, deployer, fee);

        houses[tokenId].owner = msg.sender;
        houses[tokenId].isListed = false;
        houses[tokenId].listedTimestamp = 0;
        houses[tokenId].price = 0;

        emit HouseSell(tokenId, price, seller, msg.sender);
    }


    function helloworld() pure external returns(string memory) {
        return "hello world";
    }

    // ...
    // TODO add any logic if you want
}