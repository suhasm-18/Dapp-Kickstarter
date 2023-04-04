// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.13;
 
contract Factory {
 
    address[] public deployedCampaigns;
 
    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }
 
    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }
 
}
 
contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
 
    Request[] public requests;
    address public manager;
    uint public minimumContribution;  
    mapping(address => bool) public approvers;
    uint approversCount;
 
    modifier restricted() {
        require(msg.sender == manager, "Only managers can execute this function");
        _;
    }
 
    constructor(uint minimum, address creator) {
        minimumContribution = minimum;
        manager = creator;
    }
 
    function contribute() public payable {
        require(msg.value > minimumContribution, "Not meeting minimum contribution");
 
        approvers[msg.sender] = true;
        approversCount++;
    }
 
    function createRequest(string memory description, uint value, address recipient) 
        public restricted {
        
        // Request storage newRequest = Request({
        //     description: description,
        //     value: value,
        //     recipient: recipient,
        //     complete: false,
        //     approvalCount: 0,
        // });
    
        uint _index = requests.length;
 
        Request[] storage r = requests;
 
        r.push();
 
        r[_index].description = description;
        r[_index].value = value;
        r[_index].recipient = recipient;
        r[_index].complete = false;
        r[_index].approvalCount = 0;
    }
 
    function approveRequest(uint index) public {
        Request storage request = requests[index];
 
        require(approvers[msg.sender] , "You are not a contributor");
        require(!request.approvals[msg.sender], "You already voted!");
 
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
 
    
function finalizeRequest(uint index) public restricted {

Request storage request = requests[index];

require(request.approvalCount > (approversCount / 2));

require(!request.complete);

request.complete = true;

payable(request.recipient).transfer(request.value);

}
}