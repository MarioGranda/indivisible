// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity 0.8.14;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

contract Token is OwnableUpgradeable, ERC20Upgradeable {
    function initialize(string memory _name, string memory _symbol)
        public
        initializer
    {
        __ERC20_init_unchained(_name, _symbol);
        __Ownable_init_unchained();
    }

    function mint(address _account, uint256 _amount) external onlyOwner {
        _mint(_account, _amount);
    }
}
