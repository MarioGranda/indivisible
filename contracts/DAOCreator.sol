// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity 0.8.14;

/*
 
*/

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract DAOCreator is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable
{
    address public beaconDAO;
    address public beaconToken;

    event DAOCreated(
        address indexed daoCreator,
        address indexed dao
    );

    function initialize(address admin, address _beaconDAO, address _beaconToken) public initializer {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        beaconDAO = _beaconDAO;
        beaconToken = _beaconToken;
    }

    function createDAO(string memory _name, string memory _symbol, uint256 _mintAmount, uint32 _minConsensusPeriod, uint32 _minVotingPeriod, uint32 _minQuorum) external {
        BeaconProxy dao = new BeaconProxy(
            beaconDAO,
            abi.encodeWithSignature(
                "initialize(address,address,string,string,uint256,uint32,uint32,uint32)",
                msg.sender,
                beaconToken,
                _name,
                _symbol,
                _mintAmount, 
                _minConsensusPeriod,
                _minVotingPeriod,
                _minQuorum
            )
        );

        emit DAOCreated(msg.sender, address(dao));
    }

    function _authorizeUpgrade(address)
        internal
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {}
}
