// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
contract StakingDapp is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
 constructor() Ownable(msg.sender) {}

    struct UserInfo {
        uint256 amount;
        uint256 lastRewardAt;
        uint256 lockUntil;
    }

    struct PoolInfo {
        IERC20 depositToken;
        IERC20 rewardToken;
        uint256 depositedAmount;
        uint256 apy;
        uint256 lockDays;
        uint256 rewardFund; 
    }

    uint256 decimals = 10**18;
    uint256 public poolCount;
    PoolInfo[] public poolInfo;

    mapping(address => uint256) public depositedTokens;
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;

   
    event Notification(
        uint256 indexed poolID,
        uint256 amount,
        address indexed user,
        string typeOf,
        uint256 timestamp
    );

    
    function addPool(
        IERC20 _depositToken,
        IERC20 _rewardToken,
        uint256 _apy,
        uint256 _lockDays
    ) public onlyOwner {
        poolInfo.push(
            PoolInfo({
                depositToken: _depositToken,
                rewardToken: _rewardToken,
                depositedAmount: 0,
                apy: _apy,
                lockDays: _lockDays,
                rewardFund: 0
            })
        );
        poolCount++;
    }

    
    function fundRewards(uint256 _pid, uint256 _amount) external onlyOwner {
        PoolInfo storage pool = poolInfo[_pid];
        pool.rewardToken.safeTransferFrom(msg.sender, address(this), _amount);
        pool.rewardFund += _amount;
    }

    function deposit(uint256 _pid, uint256 _amount) public nonReentrant {
        require(_amount > 0, "Amount should be greater than 0!");
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        if (user.amount > 0) {
            uint256 pending = _calcPendingReward(user, _pid);
            if (pending > 0 && pool.rewardFund >= pending) {
                pool.rewardFund -= pending;
                pool.rewardToken.safeTransfer(msg.sender, pending);
                emit Notification(_pid, pending, msg.sender, "Claim", block.timestamp);
            }
        }

        pool.depositToken.safeTransferFrom(msg.sender, address(this), _amount);
        pool.depositedAmount += _amount;
        user.amount += _amount;
        user.lastRewardAt = block.timestamp;
        user.lockUntil = block.timestamp + (pool.lockDays * 60); 
      
        depositedTokens[address(pool.depositToken)] += _amount;
        emit Notification(_pid, _amount, msg.sender, "Deposit", block.timestamp);
    }

    function withdraw(uint256 _pid, uint256 _amount) public nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        require(user.amount >= _amount, "Withdraw amount exceeds balance");
        require(user.lockUntil <= block.timestamp, "Lock is Active!");

        uint256 pending = _calcPendingReward(user, _pid);

        if (pending > 0 && pool.rewardFund >= pending) {
            pool.rewardFund -= pending;
            pool.rewardToken.safeTransfer(msg.sender, pending);
            emit Notification(_pid, pending, msg.sender, "Claim", block.timestamp);
        }

        if (_amount > 0) {
            user.amount -= _amount;
            pool.depositedAmount -= _amount;
            depositedTokens[address(pool.depositToken)] -= _amount;

            pool.depositToken.safeTransfer(msg.sender, _amount);
            emit Notification(_pid, _amount, msg.sender, "Withdraw", block.timestamp);
        }

        user.lastRewardAt = block.timestamp;
    }

    function _calcPendingReward(UserInfo storage user, uint256 _pid) internal view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];

        uint256 daysPassed = (block.timestamp - user.lastRewardAt) / 60; 
        // ⚠️ testing: 60 sec = 1 day, change to 86400 for mainnet

        if (daysPassed > pool.lockDays) {
            daysPassed = pool.lockDays;
        }

        return (user.amount * daysPassed * pool.apy) / 365 / 100;
    }

    function pendingReward(uint256 _pid, address _user) public view returns (uint256) {
        UserInfo storage user = userInfo[_pid][_user];
        return _calcPendingReward(user, _pid);
    }

    // ✅ Safer sweep: protect deposit + reward pools
    function sweep(address token, uint256 amount) external onlyOwner {
        uint256 token_balance = IERC20(token).balanceOf(address(this));

        require(amount <= token_balance, "Amount exceeds balance");

        // Don't allow sweeping staked tokens
        require(token_balance - amount >= depositedTokens[token], "Can't withdraw deposited tokens");

        // Don't allow sweeping reward pool tokens
        for (uint256 i = 0; i < poolInfo.length; i++) {
            if (address(poolInfo[i].rewardToken) == token) {
                require(token_balance - amount >= poolInfo[i].rewardFund, "Can't withdraw reward tokens");
            }
        }

        IERC20(token).safeTransfer(msg.sender, amount);
    }

    function modifyPool(uint256 _pid, uint256 _apy) public onlyOwner {
        PoolInfo storage pool = poolInfo[_pid];
        pool.apy = _apy;
    }

    function claimReward(uint256 _pid) public nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        uint256 pending = _calcPendingReward(user, _pid);
        require(pending > 0, "No rewards to claim");
        require(pool.rewardFund >= pending, "Insufficient reward fund");

        user.lastRewardAt = block.timestamp;
        pool.rewardFund -= pending;

        pool.rewardToken.safeTransfer(msg.sender, pending);
        emit Notification(_pid, pending, msg.sender, "Claim", block.timestamp);
    }
}
