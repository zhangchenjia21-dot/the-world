# Game Workspace Architecture v0.2

## Purpose

This document defines the game workspace organization used by The World Core.

The goal is not to create a rigid database. The goal is to give the GM a stable ownership model for long-term world persistence and future UI plugins.

## Core Principle

One fact has one owner.

- `state/` owns current world reality.
- `mechanics/` owns expansion-generated mechanical state.
- `story/` owns historical records.
- `memory/` owns short-term recovery context.
- `saves/` owns rollback snapshots.

`library/` is source material and must never be modified by a running game.

## Recommended Workspace

```
games/<game-id>/
├── COMPOSITION.md
├── state/
│   ├── CURRENT.md
│   ├── PLAYER.md
│   ├── WORLD.md
│   ├── THREADS.md
│   ├── characters/
│   │   ├── INDEX.md
│   │   └── <character-id>.md
│   ├── organizations/
│   │   ├── INDEX.md
│   │   └── <organization-id>.md
│   └── places/
│       ├── INDEX.md
│       └── <place-id>.md
├── mechanics/
│   └── <enabled-mechanic>/STATE.md
├── story/
│   └── LEDGER.md
├── memory/
│   └── RECENT.md
└── saves/
```

## File Ownership

### CURRENT.md

Current scene anchor only:

- time
- location
- current scene
- present characters
- immediate choices
- references to deeper state

Do not store complete character histories or mechanic states here.

### PLAYER.md

Long-term player identity:

- identity
- background
- personality
- public/private identity
- persistent possessions

Mechanic values belong elsewhere.

### WORLD.md

Game-local world changes:

- altered historical outcomes
- changed factions
- major public events

Do not duplicate the World Pack.

### THREADS.md

Unresolved narrative facts:

- promises
- debts
- mysteries
- unfinished conflicts
- future consequences

## Entity Storage

Characters, organizations and places are entities.

Do not physically organize them by time, faction or location. Those attributes change.

Use stable IDs and indexes.

Example:

`characters/char-001.md`

contains current attributes such as:

- name
- location
- affiliation
- status
- important facts

`INDEX.md` is a searchable view, not the source of truth.

## Mechanics

Expansion packs describe which facts are worth preserving.

They do not define runtime storage paths.

World Core decides whether a fact belongs in:

- PLAYER
- CHARACTER
- WORLD
- MECHANICS
- THREADS

Create mechanic state only when the enabled expansion produces persistent state.

## Save Policy

Save policy belongs to Game Composition.

Possible modes:

- manual save
- periodic automatic save

Automatic save intervals count player turns only, not maintenance steps.

A save snapshot contains:

- COMPOSITION
- state
- mechanics
- story
- memory

## UI Compatibility

Future UI plugins should read workspace projections:

- character UI → `state/characters`
- faction UI → `state/organizations`
- map UI → `state/places` + world state
- system UI → `mechanics`
- journal UI → `THREADS`
