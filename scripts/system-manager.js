import { ActionHandler } from "./action-handler.js";
import { RollHandler } from "./roll-handler.js";
import { DEFAULTS } from "./defaults.js";
import * as systemSettings from "./settings.js";

export let SystemManager = null;

/**
 * Tells Token Action HUD Core which pieces to use for this system:
 * the ActionHandler (builds the buttons), the RollHandler (handles clicks),
 * our settings, and the default tab layout.
 */
Hooks.once("tokenActionHudCoreApiReady", async (coreModule) => {
  SystemManager = class SystemManager extends coreModule.api.SystemManager {
    /** @override */
    getActionHandler() {
      return new ActionHandler();
    }

    /** @override */
    getAvailableRollHandlers() {
      return { core: "Dungeon Crawler Carl" };
    }

    /** @override */
    getRollHandler(rollHandlerId) {
      return new RollHandler();
    }

    /** @override */
    registerSettings(coreUpdate) {
      systemSettings.register(coreUpdate);
    }

    /** @override */
    async registerDefaults() {
      return DEFAULTS;
    }
  };
});
