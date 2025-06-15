// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
contract Staking {

    address public owner;
    uint256 public totalStaked; // Total amount staked in the contract
    uint256 public maxStake; // Maximum amount that can be staked in the contract
    uint8 public APY; // Annual Percentage Yield for stakers
    mapping(address => uint256) private balances;
    string public title;
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event Slashed(address indexed user, uint256 amount);

    constructor(uint8 _APY, string memory _title, uint256 _maxStake) {
        // Initialize contract state if needed
        APY = _APY;
        owner = msg.sender;
        title = _title;
        maxStake = _maxStake;

    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }


    function stake() public payable {
        require(msg.value > 0, "Must stake a positive amount");
        balances[msg.sender] += msg.value;
        totalStaked += msg.value;
        emit Staked(msg.sender, msg.value);
    }

    function unstake(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance to unstake");
        balances[msg.sender] -= amount;
        totalStaked -= amount;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "IP transfer failed");
        emit Unstaked(msg.sender, amount);
    }

    function slash(address user, uint256 amount) public onlyOwner {
        require(balances[user] >= amount, "Insufficient balance to slash");
        require(address(this).balance >= amount, "Contract does not have enough balance to slash");
        balances[user] -= amount;
        totalStaked -= amount;
        emit Slashed(user, amount);
    }

    function ownerWithdraw() public onlyOwner {
        uint256 ownerBalance = address(this).balance - totalStaked;
        if (ownerBalance > 0) {
            (bool success, ) = payable(owner).call{value: ownerBalance}("");
            require(success, "Owner withdrawal failed");
        }
    }

    function getStakeBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    receive() external payable {} // The contract can now receive Ether from other EOAs and Smart Contracts

}
