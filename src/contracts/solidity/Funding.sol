// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract Funding {
    address public owner;
    uint256 public maxFunding; // Maximum amount that can be funded in the contract
    event Funded(address indexed user, uint256 amount);
    event Withdrawn(address indexed owner, uint256 amount);
    event Payback(address indexed funder, uint256 amount);

    address[] private funderAddresses;
    mapping(address => uint256) private funders;
    constructor(uint256 _maxFunding) {
        maxFunding = _maxFunding;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function setMaxFunding(uint256 _maxFunding) public onlyOwner {
        require(_maxFunding > 0, "Maximum funding must be greater than zero");
        maxFunding = _maxFunding;
    }
    function getFunderBalance(address _funder) public view returns (uint256) {
        return funders[_funder];
    }
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw() public onlyOwner {
        require(address(this).balance > 0, "No funds to withdraw");
        require(address(this).balance >= maxFunding, "Fundraising goal not reached");
        (bool success, ) = payable(owner).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
        emit Withdrawn(owner, address(this).balance);
    }

    function paybackFunders() public onlyOwner {
        for (uint i = 0; i < funderAddresses.length; i++) {
            address funderAddress = funderAddresses[i];
            uint256 amount = funders[funderAddress];
            if (amount > 0) {
                funders[funderAddress] = 0; // Reset the balance before transferring
                (bool success, ) = payable(funderAddress).call{value: amount}("");
                require(success, "Payback failed");
                emit Payback(funderAddress, amount);
            }
        }
    }


    receive() external payable {
        require(msg.value > 0, "Must send a positive amount");
        require(address(this).balance + msg.value <= maxFunding, "Funding limit exceeded");
        if (funders[msg.sender] == 0) {
            funderAddresses.push(msg.sender); // Add new funder to the list
        }
        funders[msg.sender] += msg.value; // Update the funder's balance
        emit Funded(msg.sender, msg.value);
    }
}
