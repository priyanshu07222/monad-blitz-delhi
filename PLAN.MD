# ROCKET CANDLE IMPROVEMENT PLAN

## OVERVIEW

This plan outlines the implementation of requested improvements to the Rocket Candle game, including visual enhancements, control changes, and API compatibility fixes.

## PROJECT STRUCTURE ANALYSIS

### Key Directories:

- **Current Version**: `rocket-candle-client/vite-project/` - Active development version
- **Deprecated Version**: `rocket-candle [DEPRECATED]/` - Reference for API compatibility
- **Backend**: `rocket-candle-backend/` - Server API endpoints
- **Contracts**: `rocket-candle-contracts/` - Blockchain smart contracts

### Main Files to Modify:

1. **GameScene.js** (Current): `/home/ironyaditya/Project/MonadTest/rocket-candle-client/vite-project/src/scenes/GameScene.js` (2100 lines)
2. **KeyboardTimerController.js**: `/home/ironyaditya/Project/MonadTest/rocket-candle-client/vite-project/src/utils/KeyboardTimerController.js` (352 lines)
3. **Landing Page Components**: Game mechanics text and how-to-play sections
4. **API Service Files**: Web3Service.js for blockchain interaction

## TASK BREAKDOWN

### 1. PURPLE COLOR EFFECTS (High Priority)

**Target**: Death effects and break effects in GameScene.js

**Current Implementation Location**:

- `triggerExplosion()` method around line 1246
- `createExplosion()` method around line 1315
- `destroyEnemyWithDeathEffect()` method around line 1430

**Current Colors**:

```javascript
// Explosion circle color
0xff6600(orange);

// Particle colors
tint: [0x8000ff, 0xaa00ff, 0xffffff]; // Already has purple variants

// Death effect color
0xff0000(red);
```

**Required Changes**:

- Change explosion circle from orange (0xff6600) to purple (0x8000ff)
- Update death effect circle from red (0xff0000) to purple variants
- Ensure purple tints are consistent across all explosion effects
- Maintain visual impact while using purple color scheme

### 2. TRAJECTORY COLOR ENHANCEMENT (Medium Priority)

**Target**: Projectile trajectory preview system

**Current Implementation Location**:

- `renderTrajectoryLine()` method around line 1140
- `createTrajectorySystem()` method around line 1041

**Current Color**:

```javascript
// White dots with high opacity
this.trajectoryGraphics.fillStyle(0xffffff, 0.8);
```

**Required Changes**:

- Change trajectory dots from white (0xffffff) to darker color
- Suggestions: Dark gray (0x404040) or dark blue (0x202040)
- Maintain visibility while improving contrast against background
- Ensure trajectory remains visible across different backgrounds

### 3. KEYBOARD CONTROL SWAP (High Priority)

**Target**: A and D key functionality reversal

**Current Implementation Location**:

- `KeyboardTimerController.js` lines 120-140
- Key mapping in `setupKeyboardControls()` method

**Current Behavior**:

```javascript
// A decreases angle (left), D increases angle (right)
if (this.keys.A.isDown) {
  this.adjustAngle(-this.angleStepSize); // Decrease angle
}
if (this.keys.D.isDown) {
  this.adjustAngle(this.angleStepSize); // Increase angle
}
```

**Required Changes**:

- Swap A and D functionality
- A should increase angle (right), D should decrease angle (left)
- Update any related documentation or comments
- Test to ensure logical left/right movement

### 4. UI TEXT UPDATES (Medium Priority)

**Target**: Game mechanics descriptions and how-to-play text

**Files to Search and Update**:

- Landing page components
- In-game help text
- Tutorial or instruction panels
- Any text mentioning A/D key usage

**Required Changes**:

- Update all references to A/D key controls
- Ensure consistency between actual controls and displayed instructions
- Update any control diagrams or visual guides

### 5. API COMPATIBILITY ANALYSIS (Critical Priority)

**Target**: Ensure current API calls match deprecated version exactly

**Current API Calls Location**:

- `submitScoreToBlockchain()` method around line 1763
- `submitScoreToBlockchainWithVerification()` method around line 1850
- Web3Service calls at lines 1726, 1773

**Deprecated API Reference**:

- `/home/ironyaditya/Project/MonadTest/rocket-candle [DEPRECATED]/src/scenes/GameScene.js` line 1288

**Analysis Required**:

1. Compare API endpoint URLs
2. Verify request payload structure
3. Check authentication mechanisms
4. Ensure response data handling is identical
5. Validate error handling patterns

**Critical Areas to Compare**:

- Score submission format
- Authentication headers
- Response parsing
- Error handling logic
- Blockchain transaction flow

## IMPLEMENTATION PHASES

### Phase 1: Visual Effects (Purple Colors)

**Files**: `GameScene.js`
**Estimated Time**: 1-2 hours
**Risk**: Low
**Testing**: Visual verification of explosion and death effects

1. Update explosion circle color in `createExplosion()`
2. Update death effect color in `destroyEnemyWithDeathEffect()`
3. Verify particle tint colors are purple-focused
4. Test all explosion scenarios (rocket hits, enemy deaths)

### Phase 2: Trajectory Enhancement

**Files**: `GameScene.js`
**Estimated Time**: 30 minutes
**Risk**: Low
**Testing**: Trajectory visibility across different backgrounds

1. Change trajectory dot color in `renderTrajectoryLine()`
2. Test visibility with different background images
3. Adjust opacity if needed for optimal visibility

### Phase 3: Keyboard Control Swap

**Files**: `KeyboardTimerController.js`, documentation
**Estimated Time**: 1 hour
**Risk**: Medium (affects core gameplay)
**Testing**: Comprehensive control testing

1. Swap A/D functionality in `handleKeyboardInput()`
2. Update control comments and documentation
3. Test angle adjustment in both directions
4. Verify timer triggering works correctly

### Phase 4: UI Text Updates

**Files**: Various UI components
**Estimated Time**: 1-2 hours
**Risk**: Low
**Testing**: Text accuracy verification

1. Search for all A/D key references
2. Update control descriptions
3. Update tutorial/help text
4. Verify consistency across all UI elements

### Phase 5: API Compatibility Verification

**Files**: Web3Service, GameScene API calls
**Estimated Time**: 2-3 hours
**Risk**: High (affects core functionality)
**Testing**: End-to-end API testing

1. Compare deprecated vs current API implementations
2. Identify any differences in request/response format
3. Update current implementation to match deprecated exactly
4. Test score submission functionality
5. Verify blockchain interaction works correctly

## QUALITY ASSURANCE

### Testing Checklist:

- [ ] Purple explosion effects display correctly
- [ ] Purple death effects display correctly
- [ ] Trajectory line is visible and appropriately colored
- [ ] A key increases angle (moves right)
- [ ] D key decreases angle (moves left)
- [ ] All UI text matches new control scheme
- [ ] API calls match deprecated version exactly
- [ ] Score submission works end-to-end
- [ ] No regression in existing functionality

### Error Handling:

- Implement proper error catching for all API modifications
- Ensure fallback behavior for visual effect failures
- Maintain game playability if any single component fails

## RISK ASSESSMENT

### High Risk:

- API compatibility changes (could break score submission)
- Keyboard control swap (affects core gameplay)

### Medium Risk:

- UI text updates (potential for missed references)

### Low Risk:

- Color changes (visual only, no logic impact)
- Trajectory color (cosmetic enhancement)

## SUCCESS CRITERIA

1. **Visual**: All explosion and death effects display in purple colors
2. **Usability**: Trajectory line is clearly visible with darker coloring
3. **Controls**: A/D keys work as specified (swapped from current behavior)
4. **Documentation**: All UI text accurately describes the new control scheme
5. **Compatibility**: API calls function identically to deprecated version
6. **Stability**: No existing functionality is broken by changes

## ROLLBACK PLAN

- Maintain backup copies of original files before modification
- Use version control for each phase
- Implement changes incrementally to isolate any issues
- Keep deprecated version as reference for API rollback if needed

## COMPLETION TIMELINE

**Total Estimated Time**: 6-9 hours
**Recommended Order**: Phases 1, 2, 3, 4, 5 (low to high risk)
**Testing Time**: Additional 2-3 hours for comprehensive testing

This plan ensures systematic implementation of all requested changes while maintaining code quality and minimizing risks to existing functionality.

---

## API COMPATIBILITY STATUS UPDATE

### CRITICAL API DISCREPANCIES IDENTIFIED

**Backend Server API (server.js)**:

- `POST /api/submit-score` - Submit game scores
- `POST /api/reward-fuel` - Reward FUEL tokens
- `GET /api/player-scores/:address` - Get player scores
- `GET /api/leaderboard` - Get leaderboard
- `GET /api/fuel-balance/:address` - Get FUEL balance

**Current Frontend API Config (web3Config.js)**:

- `POST /scores/submit` ❌ Should be `/submit-score`
- `GET /scores/leaderboard` ❌ Should be `/leaderboard`
- `GET /scores/player` ❌ Should be `/player-scores`
- `POST /tokens/reward` ❌ Should be `/reward-fuel`
- `GET /tokens/balance` ❌ Should be `/fuel-balance`

### API METHOD MISMATCHES

**Current Web3Service Methods**:

- `rewardRocketFuel()` ❌ Should be `rewardFuel()`
- `getRocketFuelBalance()` ❌ Should be `getFuelBalance()`
- `REWARD_ROCKET_FUEL` endpoint ❌ Should be `REWARD_FUEL`
- `ROCKET_FUEL_BALANCE` endpoint ❌ Should be `FUEL_BALANCE`

### REQUIRED FIXES

1. **Update API_CONFIG endpoints** in `web3Config.js`
2. **Rename Web3Service methods** to match backend exactly
3. **Update GameScene.js calls** to use correct method names
4. **Fix base URL** - backend uses port 4000, config uses 3001

### IMPLEMENTATION PRIORITY

**PHASE 5 EXPANDED - API COMPATIBILITY FIXES (CRITICAL)**:

**Step 1**: Update `web3Config.js` endpoints to match backend exactly
**Step 2**: Update `Web3Service.js` method names and endpoint references
**Step 3**: Update all `GameScene.js` API method calls
**Step 4**: Update `WalletContext` and page implementations
**Step 5**: Test all API endpoints end-to-end

This is critical for proper functionality and must be completed to ensure score submission, leaderboard, and token rewards work correctly.
