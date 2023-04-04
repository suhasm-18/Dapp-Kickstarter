const assert = require("assert");
const ganache = require("ganache-cli");
const options = { gasLimit: 100000000 };
const Web3 = require("web3");
const web3 = new Web3(ganache.provider(options));
 
const compiledFactory = require("../ethereum/build/Factory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");
 
let accounts;
let factory;
let campaignAddress;
let campaign;
 
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "10000000" });
 
  const initial = await web3.eth.getBalance(accounts[0]);
 
  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "10000000",
  });
 
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
 
  const final = await web3.eth.getBalance(accounts[0]);
  console.log("*******COST :", initial - final);
});
 
describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  
});