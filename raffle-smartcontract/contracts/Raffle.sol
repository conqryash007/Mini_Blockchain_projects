// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// ERROR
error Raffle_notEnoughEth();

contract Raffle {
    // STATE VARIABLE

    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    // CONSTRUCTOR

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    // EVENT EMMITER

    event RaffleEnter(address indexed player);

    // FUNCTION
    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle_notEnoughEth();
        }
        s_players.push(payable(msg.sender));

        emit RaffleEnter(msg.sender);
    }

    // GETTER FUNCTION
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 playerIndex) public view returns (address) {
        return s_players[playerIndex];
    }
}
