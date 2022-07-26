interface DAOInterface {
    // Contract that is able to create a new DAO (with the same code as
    // this one), used for splits
    // DAO_Creator public daoCreator;

    // A proposal with `newCurator == false` represents a transaction
    // to be issued by this DAO
    // A proposal with `newCurator == true` represents a DAO split
    struct Proposal {
        // A unix timestamp, denoting the end of the voting period
        uint256 votingDeadline;
        // True if the proposal's votes have yet to be counted, otherwise False
        bool open;
        // True if quorum has been reached, the votes have been counted, and
        // the majority said yes
        bool proposalPassed;
        // Number of Tokens in favor of the proposal
        uint32 yea;
        // Number of Tokens opposed to the proposal
        uint32 nay;
        uint32 minQuorum;
        uint32 deposited;
        // Address of the shareholder who created the proposal
        address creator;
    }




    /// @dev This function is used to send ether back
    /// to the DAO, it can also be used to receive payments that should not be
    /// counted as rewards (donations, grants, etc.)
    /// @return Whether the DAO received the ether successfully
    function receiveEther() external returns(bool);

    function newProposal(
        address _recipient,
        uint _amount,
        uint _debatingPeriod
    ) external returns (uint _proposalID);

    /// @notice Vote on proposal `_proposalID` with `_supportsProposal`
    /// @param _proposalID The proposal ID
    /// @param _supportsProposal Yes/No - support of the proposal
    /// @return _voteID vote ID.
    function vote(
        uint _proposalID,
        bool _supportsProposal
    ) external returns (uint _voteID);

    function executeProposal(
        uint _proposalID
    ) external returns (bool _success);

    /// @notice Get my portion of the reward that was sent to `rewardAccount`
    /// @return _success the call was successful
    function getMyReward() external returns(bool _success);

    /// @notice Withdraw `_account`'s portion of the reward from `rewardAccount`
    /// to `_account`'s balance
    /// @return _success the call was successful
    function withdrawRewardFor(address _account) external returns (bool _success);

    event ProposalAdded(
        uint256 indexed proposalID,
        address creator,
        uint256 minQuorum,
        uint256 votingDeadline
    );
    event Voted(uint indexed proposalID, bool position, address indexed voter);
}
