// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @notice SCESI Coin: token no transferible. Solo la directiva (MINTER_ROLE) emite.
contract SCESICoin is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    error NonTransferable();

    constructor(address admin) ERC20("SCESI Coin", "SCC") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function decimals() public pure override returns (uint8) {
        return 0;
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    /// Solo se permite emitir (from == 0); cualquier transferencia o quema revierte.
    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0)) revert NonTransferable();
        super._update(from, to, value);
    }
}
