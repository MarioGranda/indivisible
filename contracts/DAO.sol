/*
This file is part of the DAO.

The DAO is free software: you can redistribute it and/or modify
it under the terms of the GNU lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The DAO is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU lesser General Public License for more details.

You should have received a copy of the GNU lesser General Public License
along with the DAO.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
Standard smart contract for a Decentralized Autonomous Organization (DAO)
to automate organizational governance and decision-making.
*/
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity 0.8.14;

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./Token.sol";

// The DAO contract itself
contract DAO is AccessControlUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _proposalIds;

    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");

    bytes32 public merkleRoot;

    uint256 public mintAmount;
    uint32 public minConsensusPeriod;
    uint32 public minVotingPeriod;
    // In basis points
    uint32 public minQuorum;

    address public token;

    mapping(uint256 => Proposal) public proposals;
    // user address -> proposal -> depositedAmount
    mapping(address => mapping(uint256 => uint256)) public depositedAmount;
    // user address -> bool is user
    mapping(address => bool) public isUser;

    struct Proposal {
        // A unix timestamp, denoting the end of the consensus period
        uint256 consensusDeadline;
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
        uint256 deposited;
        // Address of the shareholder who created the proposal
        address creator;
    }

    event ProposalAdded(
        uint256 indexed proposalID,
        address creator,
        uint256 minQuorum,
        uint256 consensusDeadline,
        uint256 votingDeadline
    );
    event ProposalExecuted(
        uint256 indexed proposalID,
        bool indexed proposalPassed
    );
    event Voted(
        uint256 indexed proposalID,
        bool position,
        address indexed voter
    );
    event NewMember(address indexed newMember);

    // Modifier that allows only shareholders to vote and create new proposals
    modifier onlyTokenholders(address _token, bytes32[] calldata _merkleProof) {
        if (Token(_token).owner() != address(this)) {
            require(
                _verify(_merkleProof, Token(_token).owner()),
                "DAO: Token does not belong to any subDao"
            );
        }
        require(
            Token(_token).balanceOf(msg.sender) > 0,
            "Only dao members can call this function."
        );
        _;
    }

    function initialize(
        address _creator,
        address _beacon,
        string memory _name,
        string memory _symbol,
        uint256 _mintAmount,
        uint32 _minConsensusPeriod,
        uint32 _minVotingPeriod,
        uint32 _minQuorum
    ) public initializer {
        _grantRole(DEFAULT_ADMIN_ROLE, _creator);
        //_grantRole("CURATOR_ROLE", _curator);
        _grantRole(CREATOR_ROLE, _creator);
        BeaconProxy _token = new BeaconProxy(
            _beacon,
            abi.encodeWithSignature("initialize(string,string)", _name, _symbol)
        );
        token = address(_token);
        mintAmount = _mintAmount;
        minConsensusPeriod = _minConsensusPeriod;
        minVotingPeriod = _minVotingPeriod;
        minQuorum = _minQuorum;
    }

    function receiveEther() external pure returns (bool) {
        return true;
    }

    function join() external {
        require(!isUser[msg.sender], "DAO: msg.sender is already a user");
        isUser[msg.sender] = true;
        Token(token).mint(msg.sender, mintAmount);
        emit NewMember(msg.sender);
    }

    function newProposal(
        uint256 _debatingPeriod,
        uint256 _votingPeriod,
        uint32 _minQuorum,
        address _token,
        bytes32[] calldata _merkleProof
    )
        external
        onlyTokenholders(_token, _merkleProof)
        returns (uint256 _proposalID)
    {
        require(
            _debatingPeriod >= minConsensusPeriod,
            "DAO: debating period must be greater than minConsensusPeriod"
        );
        require(
            _votingPeriod >= minVotingPeriod,
            "DAO: voting period must be greater than minVotingPeriod"
        );
        require(
            _minQuorum >= minQuorum,
            "DAO: min quorum must be greater than minQuorum"
        );
        proposals[_proposalIds.current()] = Proposal({
            consensusDeadline: block.timestamp + _debatingPeriod,
            votingDeadline: block.timestamp + _debatingPeriod + _votingPeriod,
            open: true,
            creator: msg.sender,
            minQuorum: _minQuorum,
            yea: 0,
            nay: 0,
            deposited: 0,
            proposalPassed: false
        });

        _proposalIds.increment();

        emit ProposalAdded(
            _proposalID,
            msg.sender,
            _minQuorum,
            block.timestamp + _debatingPeriod,
            block.timestamp + _votingPeriod
        );
    }

    function vote(
        uint256 _proposalID,
        bool _supportsProposal,
        uint256 _depositAmount,
        uint256 _lockPeriod,
        address _token,
        bytes32[] calldata _merkleProof
    ) external onlyTokenholders(_token, _merkleProof) {
        require(
            _proposalIds.current() > _proposalID,
            "DAO: Non existent proposal id"
        );
        Proposal storage p = proposals[_proposalID];
        //check inputs
        uint256 quorum = (10_000 * (p.deposited + _depositAmount)) /
            Token(token).totalSupply();
        require(
            block.timestamp >= p.consensusDeadline,
            "DAO: Voting has not started yet"
        );
        require(
            block.timestamp <= p.votingDeadline || p.minQuorum > quorum,
            "DAO: Voting has finished"
        );
        require(_depositAmount > 0, "DAO: Deposit has to be greater than 0");
        require(
            Token(token).allowance(msg.sender, address(this)) >= _depositAmount,
            "DAO: Invalid token allowance"
        );
        require(
            depositedAmount[msg.sender][_proposalID] == 0,
            "DAO: User has already voted"
        );

        uint256 _votePower = _depositAmount * _lockPeriod;
        depositedAmount[msg.sender][_proposalID] = _depositAmount;
        Token(token).transferFrom(msg.sender, address(this), _depositAmount);
        if (_supportsProposal) {
            p.yea += uint32(_votePower);
        } else {
            p.nay += uint32(_votePower);
        }
        p.deposited += _depositAmount;

        emit Voted(_proposalID, _supportsProposal, msg.sender);
    }

    function executeProposal(uint256 _proposalID) external {
        require(
            _proposalIds.current() > _proposalID,
            "DAO: Non existent proposal id"
        );
        Proposal memory p = proposals[_proposalID];

        // Check if the proposal can be executed
        require(
            p.creator == msg.sender,
            "DAO: Only proposal creator can execute this proposal"
        );
        require(
            block.timestamp >= p.votingDeadline,
            "DAO: Voting has not finished yet"
        );

        uint256 quorum = (10_000 * p.deposited) / Token(token).totalSupply();
        require(
            quorum >= _getQuorum(_proposalID),
            "DAO: Quorum must be greater than proposal's minQuorum"
        );
        p.proposalPassed = p.yea > p.nay ? true : false;
        _closeProposal(_proposalID);

        emit ProposalExecuted(_proposalID, p.proposalPassed);
    }

    function updateMerkleRoot(bytes32 _newMerkleRoot)
        external
        onlyRole(CREATOR_ROLE)
    {
        merkleRoot = _newMerkleRoot;
    }

    //Verify subDAO is under this DAO governance in case merkleRoot != ""
    function _verify(bytes32[] calldata _merkleProof, address _subDAO)
        internal
        view
        returns (bool)
    {
        if (merkleRoot != "") {
            bytes32 leaf = keccak256(abi.encodePacked(_subDAO));
            return MerkleProof.verify(_merkleProof, merkleRoot, leaf);
        } else {
            return true;
        }
    }

    function _getQuorum(uint256 _proposalID) internal view returns (uint32) {
        Proposal memory p = proposals[_proposalID];
        return p.minQuorum;
    }

    function _closeProposal(uint256 _proposalID) internal {
        Proposal storage p = proposals[_proposalID];
        if (p.open) {
            p.open = false;
        }
    }

    function getMyFunds(uint256 _proposalID) external {
        require(_withdrawFunds(_proposalID), "DAO: Withdraw funds failed");
    }

    function _withdrawFunds(uint256 _proposalID)
        internal
        returns (bool _success)
    {
        require(
            _proposalIds.current() > _proposalID,
            "DAO: Non existent proposal id"
        );
        Proposal memory p = proposals[_proposalID];
        require(p.open == false, "DAO: Proposal has not been closed yet");
        uint256 _depositedAmount = depositedAmount[msg.sender][_proposalID];
        require(
            _depositedAmount > 0,
            "DAO: No deposit was made for this proposal"
        );
        Token(token).transfer(msg.sender, _depositedAmount);
        return true;
    }
}
