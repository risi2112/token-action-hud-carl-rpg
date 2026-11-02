# Token Action HUD: Dungeon Crawler Carl

A system module for [Token Action HUD Core](https://foundryvtt.com/packages/token-action-hud-core) that adds support for the unofficial [Dungeon Crawler Carl RPG system](https://github.com/SobranDM/carl-rpg) (`carl-rpg`) for Foundry VTT.

Select a token and its actions show up on the HUD. Clicking a button runs the same roll the character sheet would.

## Requirements

- Foundry VTT v14
- Dungeon Crawler Carl RPG system (`carl-rpg`)
- Token Action HUD Core 2.x
- socketlib (required by Token Action HUD Core)

## Installation

In Foundry, go to **Add-on Modules → Install Module** and paste this manifest URL:

```
https://github.com/risi2112/token-action-hud-carl-rpg/releases/latest/download/module.json
```

Then enable **Token Action HUD Core** and **Token Action HUD Dungeon Crawler Carl** in your Carl world.

## What's on the HUD

| Tab | Groups | Clicking a button |
|---|---|---|
| Combat | Attacks, Damage Effects, Defense | Attack Skill → Attack roll. Damage Effect → its parent Attack with the effect applied. Defense → Evade Check. |
| Skills | Skills, Passives | Skill Check. Passives open their sheet (they can't be rolled). |
| Spells | Attack Spells, Spells, Ongoing Spells | Casts the spell (Attack, Heal, or Skill Check). Ongoing spells toggle on/off and light up while active. |
| Inventory | Equipped, Gear | Posts the item card. **Shift-click** to equip / unequip. |
| Boons | Boons | Posts the Boon card. |
| Utility | Token | Add to / remove from combat, show / hide token (GM). |

Buttons show the Rank the system rolls with (e.g. `R3`), and spells show their base Mana cost.

**Right-click** any item button to open its sheet.

With several tokens selected, the HUD offers an Evade Check for all of them.

## Settings

Under **Configure Settings → Token Action HUD Dungeon Crawler Carl** (per player):

- **Show Passive Skills**: off by default.
- **Show Untrained Spells & Damage Effects**: off by default, since the system won't use Rank 0 ones.
- **Show Unequipped Gear**: on by default.

## Releasing a new version

1. Bump nothing by hand; the release workflow writes the version into `module.json`.
2. On GitHub, create a new release with a tag like `v0.1.0` and publish it.
3. The workflow builds `module.zip` and attaches it and `module.json` to the release. Foundry picks up the update from the manifest URL.

## License

MIT. This is a fan project, not affiliated with Matt Dinniman, Renegade Game Studios, or the authors of Token Action HUD.
