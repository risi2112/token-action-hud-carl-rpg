import { KNOWN_ACTOR_TYPES } from "./constants.js";

export let RollHandler = null;

/** Action types that are owned items, so right-click can open their sheet. */
const ITEM_ACTION_TYPES = new Set(["attack", "damageEffect", "skill", "passive", "spell", "gear", "feature"]);

/**
 * Handles clicks on HUD buttons by calling carl-rpg's own roll functions:
 *   - item buttons -> CarlRPGItem#roll(), which routes to Skill Check, Attack,
 *     Heal, toggled Spell, Damage Effect attack, or a description card
 *   - Evade Check  -> CarlRPGActor#rollEvadeCheck()
 *
 * Right-click any item button: open its sheet.
 * Shift-click a gear button: equip / unequip it.
 */
Hooks.once("tokenActionHudCoreApiReady", async (coreModule) => {
  RollHandler = class RollHandler extends coreModule.api.RollHandler {
    /** @override */
    async handleActionClick(event) {
      const system = this.action?.system;
      if (!system?.actionType) return;

      if (this.actor) {
        await this.#handleAction(event, this.actor, system);
        return;
      }

      // Several tokens selected (only Evade is offered in that case).
      for (const actor of this.actors ?? []) {
        if (!KNOWN_ACTOR_TYPES.includes(actor?.type)) continue;
        await this.#handleAction(event, actor, system);
      }
    }

    /* -------------------------------------------- */

    async #handleAction(event, actor, system) {
      const { actionType, actionId } = system;

      if (actionType === "evade") {
        return actor.rollEvadeCheck();
      }

      if (!ITEM_ACTION_TYPES.has(actionType)) return;

      const item = actor.items.get(actionId);
      if (!item) return;

      // Right-click opens the sheet; passives can't be rolled, so they always do.
      if (this.isRenderItem() || actionType === "passive") {
        return this.renderItem(actor, actionId);
      }

      if (actionType === "gear" && this.isShift) {
        await item.update({ "system.equipped": !item.system.equipped });
        Hooks.callAll("forceUpdateTokenActionHud");
        return;
      }

      await item.roll();

      // Toggled spells flip their Active state when cast; refresh the button.
      if (item.type === "spell" && item.system.isToggled) {
        Hooks.callAll("forceUpdateTokenActionHud");
      }
    }
  };
});
