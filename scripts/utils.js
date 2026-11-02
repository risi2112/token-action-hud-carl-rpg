import { MODULE } from "./constants.js";

/**
 * Read one of this module's settings, falling back if it isn't registered yet.
 */
export function getSetting(key, defaultValue = null) {
  try {
    return game.settings.get(MODULE.ID, key);
  } catch {
    return defaultValue;
  }
}

/**
 * Same rule carl-rpg uses (module/helpers/modifiers.mjs slugifySkillName) to key
 * an actor's skills bag by name. Copied here because the system doesn't expose it.
 */
function slugifySkillName(name) {
  const slug = String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
  return slug || "unknown";
}

/**
 * The Rank carl-rpg actually rolls with: the actor's skills-bag entry first,
 * then the item's own rank, matching module/dice/dice.mjs.
 */
export function getRank(actor, item) {
  return actor?.system?.skills?.[slugifySkillName(item.name)]?.rank ?? item.system?.rank ?? 0;
}
