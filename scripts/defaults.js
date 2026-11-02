import { GROUP } from "./constants.js";

/**
 * Default tab layout. Each user can rearrange it later by unlocking the HUD.
 */
export let DEFAULTS = null;

Hooks.once("tokenActionHudCoreApiReady", async (coreModule) => {
  const i18n = (key) => coreModule.api.Utils.i18n(key);
  const groups = foundry.utils.deepClone(GROUP);

  Object.values(groups).forEach((group) => {
    group.name = i18n(group.name);
    group.listName = `Group: ${group.name}`;
  });

  DEFAULTS = {
    layout: [
      {
        nestId: "combat",
        id: "combat",
        name: i18n("tokenActionHud.combat"),
        groups: [
          { ...groups.attacks, nestId: "combat_attacks" },
          { ...groups.damageEffects, nestId: "combat_damageEffects" },
          { ...groups.defense, nestId: "combat_defense" }
        ]
      },
      {
        nestId: "skills",
        id: "skills",
        name: i18n("tokenActionHud.carl.group.skills"),
        groups: [
          { ...groups.skills, nestId: "skills_skills" },
          { ...groups.passives, nestId: "skills_passives" }
        ]
      },
      {
        nestId: "spells",
        id: "spells",
        name: i18n("tokenActionHud.carl.group.spells"),
        groups: [
          { ...groups.attackSpells, nestId: "spells_attackSpells" },
          { ...groups.spells, nestId: "spells_spells" },
          { ...groups.ongoingSpells, nestId: "spells_ongoingSpells" }
        ]
      },
      {
        nestId: "inventory",
        id: "inventory",
        name: i18n("tokenActionHud.carl.tab.inventory"),
        groups: [
          { ...groups.equipped, nestId: "inventory_equipped" },
          { ...groups.gear, nestId: "inventory_gear" }
        ]
      },
      {
        nestId: "features",
        id: "features",
        name: i18n("tokenActionHud.carl.group.features"),
        groups: [
          { ...groups.features, nestId: "features_features" }
        ]
      },
      {
        nestId: "utility",
        id: "utility",
        name: i18n("tokenActionHud.utility"),
        groups: [
          { ...groups.token, nestId: "utility_token" }
        ]
      }
    ],
    groups: Object.values(groups)
  };
});
