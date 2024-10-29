import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://localhost:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0x67c7ef55dbe93671e7cadbe9f87c38511c5785db33601764880b9def41649e6a',
        '0x7b112c9fe33b36123ff44479e13f74abbfde81bbf1cb38e6ff494d91f4c2d93a',
        '0x6022b9c500b59cb2d3d1c94927c86066c60c13bf8a69b6a4abd6e16950bf4faf',
        '0xf077907dbad3d516172aee32fbe429348415728c2826a587fc940a05cbd2ff26',
        '0x329a26528e4026781dc5f940fccabf33ae6064cb1cd14998a9d3e5538307a803',
        '0xf4715fb3e14bfd3558a0c64b4280cfdef23e084d5a5cfebd6ecc9d4c9c0540de',
        '0xe7e9e01d44423fbae6bd1fc7177e290d7f8ff96b4f0793d9d0169a1dff92657f',
        '0x12796cf045b66b1e6874ac8b7aedc8ccf10fb09b63d4d0399e3d8eb235911a1e',
        '0x1673cc1832c92a44d7859dd2e3f5ff09e9b98c7bdd230778b9239767a01ca040',
        '0x4444fe90eb02995b068a00dfc7016f3cd1b178807586fb54b2c4354ee7d17d08'
      ]
    },
  },
};

export default config;
