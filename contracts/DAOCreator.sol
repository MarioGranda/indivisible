// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity 0.8.14;

/*
 
*/

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./DAO.sol";

contract DAOCreator is
    Initializable,
    UUPSUpgradeable,
    AccessControlUpgradeable
{
    address public beaconDAO;
    address public beaconToken;
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");

    function initialize(address admin) public initializer {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(CREATOR_ROLE, msg.sender);
        UpgradeableBeacon _beaconToken = new UpgradeableBeacon(address(new Token()));
        UpgradeableBeacon _beaconDAO = new UpgradeableBeacon(address(new DAO()));
         _beaconDAO.transferOwnership(admin);
        beaconDAO = address(_beaconDAO);
    }

    function createDAO(string memory _name, string memory _symbol, bytes32 _merkleRoot) external onlyRole(CREATOR_ROLE) {
        BeaconProxy dao = new BeaconProxy(
            beaconDAO,
            abi.encodeWithSignature(
                "initialize(address,address,string,string)",
                msg.sender,
                beaconToken,
                _name,
                _symbol,
                _merkleRoot
            )
        );
    }

    function _authorizeUpgrade(address)
        internal
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
    {}
}
