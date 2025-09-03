// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DragonballCoin (DBC)
 * @dev Standard ERC20 token with minting & burning, based on OpenZeppelin
 */
contract DragonballCoin is ERC20, Ownable {
    uint8 private constant DECIMALS = 18;

    constructor(uint256 initialSupply) ERC20("DragonballCoin", "DBC") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** DECIMALS); // Mint initial supply to owner
    }

    /**
     * @notice Mint new tokens (only owner)
     * @param to Recipient address
     * @param amount Amount to mint (without decimals)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount * 10 ** DECIMALS);
    }

    /**
     * @notice Burn tokens from caller's balance
     * @param amount Amount to burn (without decimals)
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount * 10 ** DECIMALS);
    }

    /**
     * @notice Burn tokens from an account (requires allowance)
     * @param from Account to burn from
     * @param amount Amount to burn (without decimals)
     */
    function burnFrom(address from, uint256 amount) external {
        _spendAllowance(from, msg.sender, amount * 10 ** DECIMALS);
        _burn(from, amount * 10 ** DECIMALS);
    }

    /**
     * @dev Override decimals to return 18
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }
}
