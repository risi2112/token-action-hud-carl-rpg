import { SystemManager } from "./system-manager.js";
import { MODULE, REQUIRED_CORE_MODULE_VERSION } from "./constants.js";

/**
 * Entry point. When Token Action HUD Core has finished loading, hand it our
 * SystemManager so it knows how to build Carl actions.
 */
Hooks.on("tokenActionHudCoreApiReady", async () => {
  const module = game.modules.get(MODULE.ID);
  module.api = {
    requiredCoreModuleVersion: REQUIRED_CORE_MODULE_VERSION,
    SystemManager
  };
  Hooks.call("tokenActionHudSystemReady", module);
});
