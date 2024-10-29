import Addresses from './contract-addresses.json'
import BuyMyRoom from './abis/BuyMyRoom.json'
import ERCPoint from './abis/ERCPoint.json'
import Web3 from 'web3';

// @ts-ignore
// 创建web3实例
// 可以阅读获取更多信息https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3
let web3 = new Web3(window.ethereum)

// 修改地址为部署的合约地址
const BuyMyRoomAddress = Addresses.BuyMyRoom
const BuyMyRoomABI = BuyMyRoom.abi
const ERCPointAddress = Addresses.ercPoint
const ERCPointABI = ERCPoint.abi

// 获取合约实例
const BMRContract = new web3.eth.Contract(BuyMyRoomABI, BuyMyRoomAddress);
const ERCContract = new web3.eth.Contract(ERCPointABI, ERCPointAddress);

// 导出web3实例和其它部署的合约
export {web3, BMRContract, ERCContract}