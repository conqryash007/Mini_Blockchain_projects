// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// IMPORT
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

// ERROR
error Raffle_notEnoughEth();

contract Raffle is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;

    // STATE VARIABLE

    uint256 private immutable i_entranceFee;
    address payable[] private s_players;

    // CONSTRUCTOR

    constructor(address VrfCordinator, uint256 entranceFee) VRFConsumerBaseV2(VrfCordinator) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(VrfCordinator);
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

    function getRandomWinner() external {
        i_vrfCoordinator.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {}

    // GETTER FUNCTION
    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 playerIndex) public view returns (address) {
        return s_players[playerIndex];
    }
}
