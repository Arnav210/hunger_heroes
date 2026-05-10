const PROJECT_ASSET_ROOT = '/assets/projects/training-hub/training-game';

// checkpoint() helper preserved for when NPC stops are re-added to the config.
// const checkpoint = ({ id, label, emoji, color, position, greeting, dialogues, assetPath = null }) => ({
//   id, label, emoji, color, position, greeting, dialogues, assetPath,
// });

const TRAINING_HUB_MISSION_CONFIG = {
  levelId: 'training-hub-team-starter-map',
  displayName: 'Team Starter Map',
  background: {
    name: 'Conveyor Belt Training Map',
    assetPath: `${PROJECT_ASSET_ROOT}/backgrounds/Conveyor_Background.png`,
    fallbackTheme: 'warehouse',
    pixels: { width: 1006, height: 508 },
  },
  // Keypress reference for future keystroke-based interactions (not player movement):
  //   W = 87, A = 65, S = 83, D = 68
  //   ArrowUp = 38, ArrowLeft = 37, ArrowDown = 40, ArrowRight = 39
  //   Space = 32, Enter = 13, Escape = 27
  // Checkpoints cleared — add entries here and restore Npc wiring in
  // TrainingHubMissionLevel.js when interactive stops are needed.
  checkpoints: [],
};

export const TRAINING_HUB_ASSET_ROOT = PROJECT_ASSET_ROOT;
export const TRAINING_HUB_CHECKPOINT_IDS = TRAINING_HUB_MISSION_CONFIG.checkpoints.map((checkpointEntry) => checkpointEntry.id);

export default TRAINING_HUB_MISSION_CONFIG;