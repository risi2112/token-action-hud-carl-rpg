import { ACTION_TYPE, GROUP, KNOWN_ACTOR_TYPES } from "./constants.js";
import { getRank, getSetting } from "./utils.js";

export let ActionHandler = null;

/**
 * Builds the HUD's buttons from the selected token's actor.
 * The sorting rules mirror CarlRPGItem#roll() in carl-rpg's module/documents/item.mjs,
 * so each button lands in the tab that matches what clicking it will actually do.
 */
Hooks.once("tokenActionHudCoreApiReady", async (coreModule) => {
  const i18n = (key) => coreModule.api.Utils.i18n(key);

  ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {
    /** @override */
    async buildSystemActions(groupIds) {
      this.showPassiveSkills = getSetting("showPassiveSkills", false);
      this.showUntrained = getSetting("showUntrained", false);
      this.showUnequippedGear = getSetting("showUnequippedGear", true);

      if (this.actor) {
        if (!KNOWN_ACTOR_TYPES.includes(this.actor.type)) return;
        const sorted = coreModule.api.Utils.sortItemsByName(this.actor.items);
        this.actorItems = sorted instanceof Map ? Array.from(sorted.values()) : Array.from(sorted ?? []);
        this.#buildSkillsAndSpells();
        this.#buildDamageEffects();
        this.#buildInventory();
        this.#buildFeatures();
        this.#buildDefense();
        return;
      }

      // Several tokens selected: only offer actions that make sense for all of them.
      const actors = (this.actors ?? []).filter(Boolean);
      if (actors.length && actors.every((actor) => KNOWN_ACTOR_TYPES.includes(actor.type))) {
        this.#buildDefense();
      }
    }

    /* -------------------------------------------- */

    /**
     * Build one button for an owned item.
     */
    #makeItemAction(item, actionType, { info1, info2, cssClass } = {}) {
      const typeName = i18n(ACTION_TYPE[actionType] ?? "");
      const action = {
        id: `${actionType}-${item.id}`,
        name: item.name,
        img: coreModule.api.Utils.getImage(item),
        listName: typeName ? `${typeName}: ${item.name}` : item.name,
        system: { actionType, actionId: item.id }
      };
      if (info1) action.info1 = info1;
      if (info2) action.info2 = info2;
      if (cssClass) action.cssClass = cssClass;
      return action;
    }

    #rankInfo(item) {
      return { text: `R${getRank(this.actor, item)}`, title: i18n("tokenActionHud.carl.info.rank") };
    }

    /* -------------------------------------------- */

    /**
     * Skills and Spells, sorted by how carl-rpg will roll them.
     */
    #buildSkillsAndSpells() {
      const buckets = {
        attacks: [],
        skills: [],
        passives: [],
        attackSpells: [],
        spells: [],
        ongoingSpells: []
      };

      for (const item of this.actorItems) {
        if (item.type !== "skill" && item.type !== "spell") continue;
        const sys = item.system;
        const rank = getRank(this.actor, item);

        if (item.type === "skill") {
          // Attack-category skills always roll an Attack, even if marked passive.
          if (sys.category === "attack") {
            buckets.attacks.push(this.#makeItemAction(item, "attack", { info1: this.#rankInfo(item) }));
          } else if (sys.isPassive || sys.category === "passive") {
            if (this.showPassiveSkills) buckets.passives.push(this.#makeItemAction(item, "passive", { info1: this.#rankInfo(item) }));
          } else {
            buckets.skills.push(this.#makeItemAction(item, "skill", { info1: this.#rankInfo(item) }));
          }
          continue;
        }

        // Spells: carl-rpg refuses to cast a Rank 0 spell.
        if (rank === 0 && !this.showUntrained) continue;

        const keywords = sys.castingKeywords ?? [];
        const isAttack = keywords.includes("attack");
        const isHeal = keywords.includes("heal");
        const isToggled = sys.isToggled === true;
        const info1 = this.#rankInfo(item);
        const info2 = { text: `${sys.manaCost ?? 0} MP`, title: i18n("CARLRPG.Spell.ManaCost") };

        if (isAttack) {
          buckets.attackSpells.push(this.#makeItemAction(item, "spell", { info1, info2 }));
        } else if (isToggled) {
          const active = sys.active === true;
          buckets.ongoingSpells.push(this.#makeItemAction(item, "spell", {
            info1,
            info2: active ? { text: i18n("CARLRPG.Toggle.Active"), class: "tah-spotlight" } : info2,
            cssClass: active ? "toggle active" : "toggle"
          }));
        } else if (isHeal || !sys.isPassive) {
          buckets.spells.push(this.#makeItemAction(item, "spell", { info1, info2 }));
        } else if (this.showPassiveSkills) {
          // Passive spell with no attack/heal/toggle route: carl-rpg won't roll it.
          buckets.passives.push(this.#makeItemAction(item, "passive", { info1 }));
        }
      }

      for (const [groupId, actions] of Object.entries(buckets)) {
        if (actions.length) this.addActions(actions, GROUP[groupId]);
      }
    }

    /* -------------------------------------------- */

    /**
     * Damage Effects. Clicking one rolls its parent Attack with the effect applied.
     */
    #buildDamageEffects() {
      const actions = this.actorItems
        .filter((item) => item.type === "damageEffect")
        .filter((item) => this.showUntrained || getRank(this.actor, item) > 0)
        .map((item) => this.#makeItemAction(item, "damageEffect", { info1: this.#rankInfo(item) }));
      if (actions.length) this.addActions(actions, GROUP.damageEffects);
    }

    /* -------------------------------------------- */

    /**
     * Gear ("item" type), split into equipped and everything else.
     */
    #buildInventory() {
      const equipped = [];
      const gear = [];
      for (const item of this.actorItems) {
        if (item.type !== "item") continue;
        const qty = item.system.quantity ?? 1;
        const info1 = qty > 1 ? { text: `×${qty}`, title: i18n("tokenActionHud.carl.info.quantity") } : undefined;
        if (item.system.equipped) {
          equipped.push(this.#makeItemAction(item, "gear", { info1, cssClass: "toggle active" }));
        } else if (this.showUnequippedGear) {
          gear.push(this.#makeItemAction(item, "gear", { info1, cssClass: "toggle" }));
        }
      }
      if (equipped.length) this.addActions(equipped, GROUP.equipped);
      if (gear.length) this.addActions(gear, GROUP.gear);
    }

    /* -------------------------------------------- */

    /**
     * Boons ("feature" type). Clicking posts the description card.
     */
    #buildFeatures() {
      const actions = this.actorItems
        .filter((item) => item.type === "feature")
        .map((item) => this.#makeItemAction(item, "feature"));
      if (actions.length) this.addActions(actions, GROUP.features);
    }

    /* -------------------------------------------- */

    /**
     * Evade Check. Works for one token or several at once.
     */
    #buildDefense() {
      const name = i18n("CARLRPG.Dialog.EvadeTitle");
      this.addActions([{
        id: "evade",
        name,
        listName: name,
        system: { actionType: "evade", actionId: "evade" }
      }], GROUP.defense);
    }
  };
});
