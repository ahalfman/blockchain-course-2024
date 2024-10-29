// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment the line to use openzeppelin/ERC721,ERC20
// You can use this dependency directly because it has been installed by TA already
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract ERCPoint is ERC20 {

    event evEthToPoints(address buyer, uint256 eth);
    event evPointsToEth(address buyer, uint256 points);
    
    address private deployer;

    constructor() ERC20("ERCPoint", "EPT") {
        deployer = msg.sender;
    }

    function getMyPoints() public view returns (uint256) {
        return balanceOf(msg.sender);
    }

    function EthToPoints() public payable {
        // 1 eth => 1 points
        uint256 points = msg.value / 1 ether;
        _mint(msg.sender, points);
        emit evEthToPoints(msg.sender, points);
    }

    function PointsToEth(uint256 points) public {
        // 1 points => 1 eth
        _burn(msg.sender, points);
        payable(msg.sender).transfer(points * 1 ether);
        emit evPointsToEth(msg.sender, points);
    }
}