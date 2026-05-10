import GameEnvBackground from '../../../../GameEnginev1.1/essentials/GameEnvBackground.js';
// Preserved for when NPC checkpoints are re-added:
// import Npc from '../../../../GameEnginev1.1/essentials/Npc.js';
// Player movement will not be re-added. For future keystroke handling, listen for
// keydown events on the container — see keypress reference in TrainingHubMissionConfig.js.
import SpriteGenerator from '../../../hunger-heroes-game/levels/SpriteGenerator.js';
import TRAINING_HUB_MISSION_CONFIG from './TrainingHubMissionConfig.js';

const resolveProjectAssetPath = (basePath, assetPath) => {
  if (!assetPath) {
    return null;
  }

  const normalizedBasePath = basePath && basePath !== '/' ? basePath.replace(/\/$/, '') : '';
  const normalizedAssetPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;

  return `${normalizedBasePath}${normalizedAssetPath}`;
};

const resolveSpriteSource = (gameEnv, assetPath, fallbackSource) => (
  resolveProjectAssetPath(gameEnv.path, assetPath) || fallbackSource
);

// Preserved for when player/NPC placement is re-added:
// const resolvePosition = (width, height, position) => ({
//   x: width * position.x,
//   y: height * position.y,
// });

// Preserved for when NPC checkpoints are re-added:
// const createCheckpoint = ({ id, label, emoji, color, position, greeting, dialogues, assetPath = null }, gameEnv, width, height) => ({ ... });

class TrainingHubMissionLevel {
  static levelId = TRAINING_HUB_MISSION_CONFIG.levelId;
  static displayName = TRAINING_HUB_MISSION_CONFIG.displayName;

  constructor(gameEnv) {
    const config = TRAINING_HUB_MISSION_CONFIG;

    const bgData = {
      name: config.background.name,
      greeting: config.background.greeting,
      src: resolveSpriteSource(gameEnv, config.background.assetPath, SpriteGenerator.createBackground(config.background.fallbackTheme)),
      pixels: config.background.pixels,
    };

    // Only the background is rendered for now.
    // To restore NPC checkpoints: uncomment Npc import, restore createCheckpoint/resolvePosition,
    // and spread checkpoint entries into this.classes.
    // For keystroke handling: add a keydown listener to gameEnv.gameContainer — key codes are
    // documented in TrainingHubMissionConfig.js.
    this.classes = [
      { class: GameEnvBackground, data: bgData },
    ];
  }
}

export default TrainingHubMissionLevel;