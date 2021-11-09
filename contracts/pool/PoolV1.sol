pragma solidity 0.5.16;

import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/GSN/Context.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/utils/Address.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";

/**
 * Reward Amount Interface
 */
pragma solidity 0.5.16;

contract IRewardDistributionRecipient is Ownable {
    address rewardDistribution;

    function notifyRewardAmount(uint256 reward) external;

    modifier onlyRewardDistribution() {
        require(
            _msgSender() == rewardDistribution,
            "Caller is not reward distribution"
        );
        _;
    }

    function setRewardDistribution(address _rewardDistribution)
        external
        onlyOwner
    {
        rewardDistribution = _rewardDistribution;
    }
}

/**
 * Staking Token Wrapper
 */
pragma solidity 0.5.16;

contract TokenWrapper {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 public stakeToken = IERC20( //FIXME
        0xbddC276CACC18E9177B2f5CFb3BFb6eef491799b
    );

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function stake(uint256 amount) public {
        uint256 _before = stakeToken.balanceOf(address(this));
        stakeToken.safeTransferFrom(msg.sender, address(this), amount);
        uint256 _after = stakeToken.balanceOf(address(this));
        uint256 _amount = _after.sub(_before);

        _totalSupply = _totalSupply.add(_amount);
        _balances[msg.sender] = _balances[msg.sender].add(_amount);
    }

    function withdraw(uint256 amount) public {
        _totalSupply = _totalSupply.sub(amount);
        _balances[msg.sender] = _balances[msg.sender].sub(amount);
        stakeToken.safeTransfer(msg.sender, amount);
    }

    function withdrawAccount(address account, uint256 amount) public {
        _totalSupply = _totalSupply.sub(amount);
        _balances[account] = _balances[account].sub(amount);
        stakeToken.safeTransfer(account, amount);
    }
}

/**
 *  Pool
 */
pragma solidity 0.5.16;

contract PoolV1 is TokenWrapper, IRewardDistributionRecipient {
    IERC20 public rewardToken = IERC20(
        0xbddC276CACC18E9177B2f5CFb3BFb6eef491799b
    ); //FIXME
    uint256 public constant DURATION = 1 days; 
    uint256 public constant startTime = 1627045200;  
    string public name = "7.23 Flexible";
    uint256 public limit = 0;
    
    uint256 public periodFinish = 0;
    uint256 public rewardRate = 0;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored = 0;
    bool private open = true;
    uint256 private constant _gunit = 1e18;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards; // Unclaimed rewards

    event RewardAdded(uint256 reward);
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event SetLimit(address indexed user, uint256 amount);
    event SetOpen(bool _open);

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return Math.min(block.timestamp, periodFinish);
    }

    /**
     * Calculate the rewards for each token
     */
    function rewardPerToken() public view returns (uint256) {
        if (totalSupply() == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored.add(
                lastTimeRewardApplicable()
                    .sub(lastUpdateTime)
                    .mul(rewardRate)
                    .mul(_gunit)
                    .div(totalSupply())
            );
    }

    function earned(address account) public view returns (uint256) {
        return
            balanceOf(account)
                .mul(rewardPerToken().sub(userRewardPerTokenPaid[account]))
                .div(_gunit)
                .add(rewards[account]);
    }

    function stake(uint256 amount)
        public
        checkOpen
        checkStart
        checkUnlimited(amount)
        updateReward(msg.sender)
    {
        require(amount > 0, "POOL: Cannot stake 0");
        super.stake(amount);
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount)
        public
        updateReward(msg.sender)
    {
        require(amount > 0, "POOL: Cannot withdraw 0");
        super.withdraw(amount);
        emit Withdrawn(msg.sender, amount);
    }

    function withdrawAccount(address account, uint256 amount)
        public
        checkStart
        onlyRewardDistribution
        updateReward(account)
    {
        require(amount > 0, "POOL: Cannot withdraw 0");
        super.withdrawAccount(account, amount);
        emit Withdrawn(account, amount);
    }
    function withdrawLeftRewards(address account, uint256 amount)
        public
        checkClose
        onlyRewardDistribution
    {
        require(amount > 0, "POOL: Cannot withdraw 0");
        rewardToken.safeTransfer(account, amount);
        emit Withdrawn(account, amount);
    }
    
    function setLimit(uint256 amount)
        public
        onlyRewardDistribution
    {
        require(amount >= 0, "POOL: limit must >= 0");
        limit = amount;
        emit SetLimit(msg.sender, amount);
    }

    function exit() external {
        withdraw(balanceOf(msg.sender));
        getReward();
    }

    function getReward() public checkStart updateReward(msg.sender) {
        uint256 reward = earned(msg.sender);
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    modifier checkStart() {
        require(block.timestamp > startTime, "POOL: Not start");
        _;
    }

    modifier checkOpen() {
        require(
            open && block.timestamp < startTime + DURATION,
            "POOL: Pool is closed"
        );
        _;
    }
    modifier checkClose() {
        require(block.timestamp > startTime + DURATION, "POOL: Pool is opened");
        _;
    }
    
    modifier checkUnlimited(uint256 amount) {
        require(totalSupply()+amount<limit || limit==0, "POOL: Pool limit Excess");
        _;
    }

    function getPeriodFinish() external view returns (uint256) {
        return periodFinish;
    }

    function isOpen() external view returns (bool) {
        return open;
    }

    function setOpen(bool _open) external onlyOwner {
        open = _open;
        emit SetOpen(_open);
    }

    function notifyRewardAmount(uint256 reward)
        external
        onlyRewardDistribution
        checkOpen
        updateReward(address(0))
    {
        if (block.timestamp > startTime) {
            if (block.timestamp >= periodFinish) {
                uint256 period = block
                    .timestamp
                    .sub(startTime)
                    .div(DURATION)
                    .add(1);
                periodFinish = startTime.add(period.mul(DURATION));
                rewardRate = reward.div(periodFinish.sub(block.timestamp));
            } else {
                uint256 remaining = periodFinish.sub(block.timestamp);
                uint256 leftover = remaining.mul(rewardRate);
                rewardRate = reward.add(leftover).div(remaining);
            }
            lastUpdateTime = block.timestamp;
        } else {
            uint256 b = rewardToken.balanceOf(address(this));
            rewardRate = reward.add(b).div(DURATION);
            periodFinish = startTime.add(DURATION);
            lastUpdateTime = startTime;
        }

        rewardToken.safeTransferFrom(msg.sender, address(this), reward);
        emit RewardAdded(reward);

        // avoid overflow to lock assets
        _checkRewardRate();
    }

    function _checkRewardRate() internal view returns (uint256) {
        return DURATION.mul(rewardRate).mul(_gunit);
    }
}
