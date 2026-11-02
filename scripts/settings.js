import { MODULE } from "./constants.js";

/**
 * Module settings, shown under Configure Settings > Token Action HUD Dungeon Crawler Carl.
 * @param {Function} coreUpdate Tells Token Action HUD Core to rebuild the HUD
 */
export function register(coreUpdate) {
  const settings = {
    showPassiveSkills: false,
    showUntrained: false,
    showUnequippedGear: true
  };

  for (const [key, defaultValue] of Object.entries(settings)) {
    game.settings.register(MODULE.ID, key, {
      name: game.i18n.localize(`tokenActionHud.carl.setting.${key}.name`),
      hint: game.i18n.localize(`tokenActionHud.carl.setting.${key}.hint`),
      scope: "client",
      config: true,
      type: Boolean,
      default: defaultValue,
      onChange: (value) => coreUpdate(value)
    });
  }
}
