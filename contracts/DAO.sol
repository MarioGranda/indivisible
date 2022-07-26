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
import "./DAOInterface.sol";
import "./Token.sol";

// The DAO contract itself
contract DAO is AccessControlUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _proposalIds;

    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");

    bytes32 public merkleRoot;

    address public token;

    // The quorum needed for each proposal is partially calculated by
    // totalSupply / minQuorumDivisor
    uint public minQuorumDivisor;
    // The unix time of the last time quorum was reached on a proposal
    uint  public lastTimeMinQuorumMet;

    mapping(uint256 => Proposal) public proposals;
    // user address -> proposal -> votePower = lockPeriod * depositedAmount
    mapping(address => mapping(uint256 => uint256)) public votePower;
    // user address -> proposal -> depositedAmount
    mapping(address => mapping(uint256 => uint256)) public depositedAmount;

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

    event ProposalAdded(
        uint256 indexed proposalID,
        address creator,
        uint256 minQuorum,
        uint256 votingDeadline
    );
    event ProposalExecuted(
        uint256 indexed proposalID,
        bool indexed proposalPassed 
    );
    event Voted(uint indexed proposalID, bool position, address indexed voter);

    // Modifier that allows only shareholders to vote and create new proposals
    modifier onlyTokenholders {
        require(
            ERC20Upgradeable(token).balanceOf(msg.sender) > 0,
            "Only owner can call this function."
        );
        _;
    }

    function initialize(address _creator, address _beacon, string memory _name, string memory _symbol, bytes32 _merkleRoot) public initializer {
        _grantRole(DEFAULT_ADMIN_ROLE, _creator);
        //_grantRole("CURATOR_ROLE", _curator);
        _grantRole(CREATOR_ROLE, _creator);
        BeaconProxy _token = new BeaconProxy(
            _beacon,
            abi.encodeWithSignature(
                "initialize(string,string)",
                _name,
                _symbol
            )
        );
        token = address(_token);
        merkleRoot = _merkleRoot;
        minQuorumDivisor = 5;
        lastTimeMinQuorumMet = block.timestamp;
    }


    function receiveEther() external returns (bool) {
        return true;
    }

    function exchangeTokens(uint256 _amount, address _tokenIn, bytes32[] calldata _merkleProof) external returns (bool) {
        Token tokenIn = Token(_tokenIn);
        //check tokens correspond to _subDAO
        require(_verify(_merkleProof, tokenIn.owner()));
        //Check amount and allowance
        require(_amount > 0, "DAO: Deposit has to be greater than 0");
        require(tokenIn.allowance(msg.sender, address(this)) >= _amount, "DAO: Invalid token allowance");
        tokenIn.transferFrom(msg.sender, address(this), _amount);
        Token(token).mint(msg.sender, _amount);
        return true;
    }


    function newProposal(
        uint256 _debatingPeriod,
        uint32 _minQuorum
    ) onlyTokenholders external returns (uint256 _proposalID) {
        proposals[_proposalIds.current()] = Proposal({
            votingDeadline: block.timestamp + _debatingPeriod,
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
            block.timestamp + _debatingPeriod
        );
    }


    function vote(
        uint256 _proposalID,
        bool _supportsProposal,
        uint256 _depositAmount,
        uint256 _lockPeriod
    ) onlyTokenholders external {
        Proposal memory p = proposals[_proposalID];
        //check inputs
        require(block.timestamp < p.votingDeadline, "DAO: Voting has finished");
        require(_depositAmount > 0, "DAO: Deposit has to be greater than 0");
        require(Token(token).allowance(msg.sender, address(this)) >= _depositAmount, "DAO: Invalid token allowance");
        require(votePower[msg.sender][_proposalID] == 0, "DAO: User has already voted");

        uint256 _votePower = _depositAmount * _lockPeriod;
        votePower[msg.sender][_proposalID] = _votePower;
        Token(token).transferFrom(msg.sender, address(this), _depositAmount);
        if (_supportsProposal) {
            p.yea += uint32(_depositAmount * _lockPeriod);
        } else {
            p.nay += uint32(_depositAmount * _lockPeriod);
        }

        emit Voted(_proposalID, _supportsProposal, msg.sender);
    }


    function executeProposal(
        uint256 _proposalID
    ) external returns (bool _success) {

        Proposal memory p = proposals[_proposalID];

        // Check if the proposal can be executed
        require(p.creator == msg.sender, "DAO: Only proposal creator can execute this proposal");
        require(block.timestamp <= p.votingDeadline, "DAO: Voting has not finished yet");

        uint256 quorum = p.deposited / Token(token).totalSupply();
        require(quorum >= minQuorum(_proposalID));   
        p.proposalPassed = p.yea > p.nay ? true : false;
        closeProposal(_proposalID);

        emit ProposalExecuted(_proposalID, p.proposalPassed);
    }

    function updateMerkleRoot(bytes32 _newMerkleRoot) external {
        merkleRoot = _newMerkleRoot;
    }

    //Verify subDAO is under this DAO governance in case merkleRoot != ""
    function _verify(bytes32[] calldata _merkleProof, address _subDAO) view internal returns (bool) {
            if (merkleRoot != "") {
                bytes32 leaf = keccak256(abi.encodePacked(_subDAO));
                return MerkleProof.verify(_merkleProof, merkleRoot, leaf);
            } else {
                return true;
            }
    }

    function minQuorum(uint256 _proposalID) internal returns (uint32) {
        Proposal memory p = proposals[_proposalID];
        return p.minQuorum;
    }


    function closeProposal(uint256 _proposalID) internal {
        Proposal memory p = proposals[_proposalID];
        if (p.open) {
        p.open = false;
        }
    }


    function getMyFunds(uint256 _proposalID) external returns (bool _success) {
        return withdrawFundsFor(_proposalID, msg.sender);
    }


    function withdrawFundsFor(uint256 _proposalID, address _account) internal returns (bool _success) {
        Proposal memory p = proposals[_proposalID];
        require(p.open == false, "DAO: Proposal has not been closed yet");
        uint256 _depositedAmount = depositedAmount[msg.sender][_proposalID];
        require(_depositedAmount > 0, "DAO: No deposit was made for this proposal");
        Token(token).transferFrom(address(this), msg.sender, _depositedAmount);
        return true;
    }

}
