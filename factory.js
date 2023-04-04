import Web3 from "./web3";

import Factory from './build/Factory.json';

cost instance = new web3.eth.Contract(
  JSON.parse(Factory.interface),

  // adress 163 video //
);

export default instance;