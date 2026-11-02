/**
 * Module-based constants
 */
export const MODULE = {
  ID: "token-action-hud-carl-rpg"
};

/**
 * The carl-rpg system's id (from its system.json)
 */
export const SYSTEM_ID = "carl-rpg";

/**
 * Token Action HUD Core version this module was written against.
 * "2" means any 2.x release of Core is accepted.
 */
export const REQUIRED_CORE_MODULE_VERSION = "2";

/**
 * Actor types that get a HUD. "npc" is carl-rpg's legacy alias for "mob".
 */
export const KNOWN_ACTOR_TYPES = ["character", "mob", "npc"];

/**
 * Item types that can be ranked/trained (Skill, Spell, Damage Effect)
 */
export const RANKED_ITEM_TYPES = ["skill", "spell", "damageEffect"];

/**
 * Action types. Each HUD button carries one of these in action.system.actionType
 * so the roll handler knows what to do when it is clicked.
 */
export const ACTION_TYPE = {
  attack: "tokenActionHud.carl.actionType.attack",
  damageEffect: "TYPES.Item.damageEffect",
  skill: "TYPES.Item.skill",
  passive: "tokenActionHud.carl.actionType.passive",
  spell: "TYPES.Item.spell",
  gear: "TYPES.Item.item",
  feature: "TYPES.Item.feature",
  evade: "CARLRPG.Dialog.EvadeTitle"
};

/**
 * Groups. Names are translation keys, localized in defaults.js.
 * "token" is Core's own group for Add to Combat / Toggle Visibility.
 */
export const GROUP = {
  attacks: { id: "attacks", name: "tokenActionHud.carl.group.attacks", type: "system" },
  damageEffects: { id: "damageEffects", name: "tokenActionHud.carl.group.damageEffects", type: "system" },
  defense: { id: "defense", name: "tokenActionHud.carl.group.defense", type: "system" },
  skills: { id: "skills", name: "tokenActionHud.carl.group.skills", type: "system" },
  passives: { id: "passives", name: "tokenActionHud.carl.group.passives", type: "system" },
  attackSpells: { id: "attackSpells", name: "tokenActionHud.carl.group.attackSpells", type: "system" },
  spells: { id: "spells", name: "tokenActionHud.carl.group.spells", type: "system" },
  ongoingSpells: { id: "ongoingSpells", name: "tokenActionHud.carl.group.ongoingSpells", type: "system" },
  equipped: { id: "equipped", name: "tokenActionHud.carl.group.equipped", type: "system" },
  gear: { id: "gear", name: "tokenActionHud.carl.group.gear", type: "system" },
  features: { id: "features", name: "tokenActionHud.carl.group.features", type: "system" },
  token: { id: "token", name: "tokenActionHud.token", type: "system" }
};
