const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');
 
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); //remove build directory if it already exists
 
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
 
const input = {
    language: 'Solidity',
    sources: {
      'Campaign.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
};
 
output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    'Campaign.sol'
];
 
fs.ensureDirSync(buildPath); //create build directory if it does not exist yet
 
for(let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}