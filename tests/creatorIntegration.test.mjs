import assert from "node:assert/strict";
import { test, after } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import catalog from "../../crossworld_backend/src/modules/archipelago/system/blueprints/catalogs.js";
import training from "../../crossworld_backend/src/modules/archipelago/system/blueprints/training.js";
import backend from "../../crossworld_backend/src/modules/archipelago/system/resources.js";
import { calculateResourceMaximums } from "../src/lib/resources.js";
import { createPointBuyAttributes } from "../src/lib/pointBuy.js";
import { applyOriginBonus } from "../src/lib/originBonus.js";

const server = await createServer({
  cacheDir: "node_modules/.vite-test-creatorIntegration.test",
  server: { middlewareMode: true, watch: null, hmr: false },
  appType: "custom",
  optimizeDeps: { noDiscovery: true, include: [] },
});
after(() => server.close());
const load = (path) => server.ssrLoadModule(`/src/${path}`);
const blueprint = { catalogs: catalog, training };
const origin = catalog.origins.find((entry) => entry.bonus === "+1 Might");
const allocation = {
  might: 15,
  agility: 14,
  wit: 13,
  spirit: 12,
  resolve: 10,
  instinct: 8,
};
const { buildCharacterPayload } = await load(
  "pages/CharacterCreator/logic/payload/buildPayload.js"
);
const { buildCharacterPatch } = await load(
  "pages/CharacterCreator/logic/payload/buildPatch.js"
);
const { createMutations } = await load(
  "pages/CharacterCreator/logic/mutations/createMutations.js"
);
const { hydrateCreatorState } = await load(
  "pages/CharacterCreator/logic/hydration/hydrateState.js"
);
const { getCreatorValidations: rawValidations } = await load(
  "pages/CharacterCreator/logic/guidance/creatorGuidance.js"
);
const fullBlueprint = (
  await import(
    "../../crossworld_backend/src/modules/archipelago/system/index.js"
  )
).default;
const getCreatorValidations = (options) =>
  rawValidations({
    ...options,
    callingId: "corsair",
    blueprint: fullBlueprint,
    loadout: {
      abilitySelections: {
        "choice:corsair:expertise:1": [
          "corsair:expertise-climb",
          "corsair:expertise-read",
        ],
      },
      startingEquipment: {
        packageId: "corsair",
        version: 1,
        choices: { secondary: "dagger" },
      },
    },
  });
const state = await load("pages/CharacterCreator/logic/state/creatorState.js");

const args = () => ({
  details: state.createEmptyDetails(),
  finalAttributes: applyOriginBonus(allocation, origin.id, blueprint),
  attributeValues: allocation,
  identity: {
    name: "Test Sailor",
    pronouns: "",
    originId: origin.id,
    callingId: catalog.callings[0].id,
    path: origin.path,
  },
  loadout: state.createEmptyLoadout(),
  progressionValues: state.createProgression(),
  resourceValues: state.createEmptyResourceValues(),
  selectedOrigin: origin,
  selectedCalling: catalog.callings[0],
  selectedPath: catalog.originPaths[0],
  training: ["climb", "perception", "deceive", "navigate"],
  startingReputation: {},
  trimmedName: "Test Sailor",
  wounds: [],
});

test("resource parity for every supported level, negative modifiers and minimum growth", () => {
  for (let level = 1; level <= 20; level += 1) {
    for (const value of [1, 2, 8, 9, 10, 13, 15, 16]) {
      const attributes = Object.fromEntries(
        Object.keys(allocation).map((key) => [key, value])
      );
      assert.deepEqual(
        calculateResourceMaximums(attributes, level),
        backend.calculateResourceMaximums(attributes, level)
      );
    }
  }
});

test("creator defaults are all 8 and payload sends only base scores / narrative resources", () => {
  assert.deepEqual(state.createEmptyDetails().notes, "");
  const input = args();
  input.progressionValues.specializationPath = "drydock-ghost";
  input.progressionValues.unlockedNodes = ["ghost-patch"];
  const payload = buildCharacterPayload(input);
  assert.deepEqual(payload.attributes, allocation);
  assert.equal(payload.progression.rank, 1);
  assert.equal(payload.progression.specializationPath, "");
  assert.deepEqual(payload.progression.unlockedNodes, []);
  for (const field of ["checks", "derivedStats", "socialStats", "pairingStats"])
    assert.equal(field in payload, false);
  assert.deepEqual(Object.keys(payload.resources).sort(), [
    "corruption",
    "wounds",
  ]);
  assert.deepEqual(
    createPointBuyAttributes(),
    Object.fromEntries(Object.keys(allocation).map((key) => [key, 8]))
  );
});

test("allocation mutations enforce nonlinear 27-point budget and pre-origin bounds", () => {
  let current = { ...allocation };
  const mutations = createMutations({
    setAttributeValues: (fn) => {
      current = fn(current);
    },
    setSaveMessage: () => {},
  });
  mutations.handleAttributeChange("agility", 15);
  assert.equal(current.agility, 14); // Costs 2 points; allocation is already at 27.
  mutations.handleAttributeChange("might", 20);
  assert.equal(current.might, 15);
  mutations.handleAttributeChange("might", 7);
  assert.equal(current.might, 8);
  mutations.handleAttributeChange("agility", 15);
  assert.equal(current.agility, 15);
});

test("editing hydration subtracts origin once and produces an empty no-op PATCH", () => {
  const input = args();
  const existing = {
    ...buildCharacterPayload(input),
    _id: "saved",
    attributes: input.finalAttributes,
    resources: state.createResources(input.finalAttributes),
    checks: { skirmish: 18 },
  };
  const hydrated = hydrateCreatorState({
    blueprint,
    initialCharacter: existing,
    origins: catalog.origins,
  });
  assert.deepEqual(hydrated.attributeValues, allocation);
  const full = buildCharacterPayload({
    ...input,
    ...hydrated,
    initialCharacter: existing,
    finalAttributes: applyOriginBonus(
      hydrated.attributeValues,
      origin.id,
      blueprint
    ),
  });
  assert.deepEqual(full.attributes, existing.attributes);
  assert.deepEqual(buildCharacterPatch(full, full, existing), {});
});

test("partial attribute PATCH omits training, specialties and narrative resources", () => {
  const input = args();
  const existing = {
    ...buildCharacterPayload(input),
    _id: "saved",
    attributes: input.finalAttributes,
    resources: state.createResources(input.finalAttributes),
    progression: {
      ...state.createProgression(),
      coreCheckInvestments: { skirmish: 3 },
    },
    skills: { combat: [{ id: "board", rank: 1 }] },
  };
  const baseline = buildCharacterPayload({
    ...input,
    initialCharacter: existing,
    progressionValues: existing.progression,
    skills: existing.skills,
  });
  const next = {
    ...baseline,
    attributes: { ...baseline.attributes, might: 15 },
  };
  assert.deepEqual(buildCharacterPatch(next, baseline, existing), {
    attributes: { might: 15 },
  });
});

test("validation prevents over-budget saves while existing unrelated edits remain possible", () => {
  const input = {
    identity: args().identity,
    isIdentityComplete: true,
    progressionValues: state.createProgression(),
    validTraining: true,
    remainingPoints: -1,
  };
  assert.equal(getCreatorValidations(input).review, false);
  assert.equal(
    getCreatorValidations({ ...input, remainingPoints: 27 }).review,
    true
  );
  assert.equal(
    getCreatorValidations({
      ...input,
      isEditing: true,
      attributesUnchanged: true,
      remainingCorePoints: 3,
    }).review,
    true
  );
});

test("all six Paths render inspectable catalog benefits with no selection or purchase control", async () => {
  const { default: Paths } = await load(
    "pages/CharacterCreator/sections/progression/ProgressionSection.jsx"
  );
  const html = renderToStaticMarkup(
    React.createElement(Paths, {
      isEditing: false,
      specializations: catalog.specializations,
    })
  );
  for (const path of catalog.specializations) {
    assert.ok(html.includes(path.name));
    for (const node of path.nodes) assert.ok(html.includes(node.summary));
  }
  assert.equal((html.match(/<details/g) ?? []).length, 6);
  assert.equal(/<(button|input|select)/.test(html), false);
  assert.ok(html.includes("Locked"));
});

test("attribute step displays base, origin, final scores, modifiers and level-1 capacities", async () => {
  const { default: Attributes } = await load(
    "components/creator/AttributesStep/AttributesStep.jsx"
  );
  const { default: Context } = await load("contexts/SystemContext.jsx");
  const input = args();
  const html = renderToStaticMarkup(
    React.createElement(
      Context.Provider,
      { value: { blueprint } },
      React.createElement(Attributes, {
        attributeValues: allocation,
        finalAttributes: input.finalAttributes,
        selectedOrigin: origin,
        resourceMaximums: calculateResourceMaximums(input.finalAttributes),
        onAttributeChange: () => {},
      })
    )
  );
  for (const word of [
    "Might",
    "Agility",
    "Wit",
    "Spirit",
    "Resolve",
    "Instinct",
    "Allocated 15",
    "Final 16",
    "Modifier +3",
    "Health 15",
    "Stamina 15",
    "Focus 12",
  ])
    assert.ok(html.includes(word), word);
});

test("live controller initializes creation with all 8s, full resources, no computed checks or Path", async () => {
  const { default: useCreatorController } = await load(
    "pages/CharacterCreator/logic/controller/useCreatorController.js"
  );
  let view;
  function Harness() {
    view = useCreatorController({ blueprint });
    return null;
  }
  renderToStaticMarkup(React.createElement(Harness));
  assert.deepEqual(view.attributeValues, createPointBuyAttributes());
  assert.equal(view.remainingPoints, 27);
  assert.equal(view.checks, undefined);
  assert.equal(view.progressionValues.rank, 1);
  assert.equal(view.progressionValues.specializationPath, "");
  assert.deepEqual(view.resourceValues, {
    health: 10,
    stamina: 8,
    focus: 8,
    wounds: 0,
    corruption: 0,
  });
});

test("live controller no-op editing submits no resource, attribute or investment changes", async () => {
  const { default: useCreatorController } = await load(
    "pages/CharacterCreator/logic/controller/useCreatorController.js"
  );
  const input = args();
  const saved = {
    ...buildCharacterPayload(input),
    _id: "saved",
    attributes: input.finalAttributes,
    resources: {
      ...state.createResources(input.finalAttributes),
      wounds: {
        current: 2,
        max: 5,
        active: [
          {
            name: "Scar",
            severity: "major",
            statPenalty: null,
            description: "",
          },
        ],
      },
      corruption: { current: 3, max: 9 },
    },
    progression: {
      ...state.createProgression(),
      coreCheckInvestments: { skirmish: 2 },
    },
    skills: { combat: [{ id: "board", rank: 1, specialty: "Preserved" }] },
  };
  saved.resources.health.current = 2;
  let view, submitted;
  function Harness() {
    view = useCreatorController({
      blueprint,
      initialCharacter: saved,
      onSaveCharacter: async (payload) => {
        submitted = payload;
      },
    });
    return null;
  }
  renderToStaticMarkup(React.createElement(Harness));
  assert.equal(view.validations.review, true);
  assert.equal(view.resourceValues.health, 2);
  assert.equal(view.resourceMaximums.wounds, 5);
  assert.equal(view.resourceMaximums.corruption, 9);
  await view.handleSaveCharacter();
  assert.deepEqual(submitted, {});
});

test("origin and calling tag updates use their new catalog identifiers", () => {
  const before = {
    identity: {
      tags: [
        {
          key: "origin-old",
          type: "trait",
          label: "Old origin",
          mechanicalImpact: "",
        },
      ],
    },
  };
  const next = {
    identity: {
      tags: [
        {
          key: "origin-new",
          type: "trait",
          label: "New origin",
          mechanicalImpact: "+1 Agility",
        },
      ],
    },
  };
  const patch = buildCharacterPatch(next, before, before);
  assert.deepEqual(patch.identity.tags, next.identity.tags);
});

test("Training selector shows 20 descriptions, exactly four count, and prevents fifth / duplicate selections", async () => {
  const { getTrainingOptions, toggleTraining } = await load("data/training.js");
  const { default: TrainingStep } = await load(
    "components/creator/SkillsStep/SkillsStep.jsx"
  );
  const options = getTrainingOptions(blueprint);
  let selected = [];
  for (const option of options.slice(0, 4))
    selected = toggleTraining(selected, option.id, options);
  assert.equal(selected.length, 4);
  assert.deepEqual(toggleTraining(selected, options[4].id, options), selected);
  assert.deepEqual(toggleTraining(selected, "unknown", options), selected);
  assert.equal(toggleTraining(selected, selected[0], options).length, 3);
  const html = renderToStaticMarkup(
    React.createElement(TrainingStep, {
      trainingOptions: options,
      training: selected,
      onTrainingToggle: () => {},
    })
  );
  assert.equal((html.match(/type="checkbox"/g) ?? []).length, 20);
  assert.equal((html.match(/checked=""/g) ?? []).length, 4);
  assert.equal((html.match(/disabled=""/g) ?? []).length, 16);
  for (const option of options) assert.ok(html.includes(option.name));
  assert.equal(
    /Core Points|Specialty Picks|ranked|Core Check/.test(html),
    false
  );
  const common = {
    identity: args().identity,
    isIdentityComplete: true,
    progressionValues: state.createProgression(),
    remainingPoints: 0,
  };
  assert.equal(
    getCreatorValidations({ ...common, validTraining: false }).review,
    false
  );
  assert.equal(
    getCreatorValidations({ ...common, validTraining: true }).review,
    true
  );
});

test("review lists selected Training with no rank effects or old controls; sheet provides GM attribute selection", async () => {
  const { default: Review } = await load(
    "components/creator/ReviewStep/ReviewStep.jsx"
  );
  const { default: Context } = await load("contexts/SystemContext.jsx");
  const { default: Checks } = await load(
    "pages/CharacterSheet/CharacterSheetSkills/CharacterSheetSkills.jsx"
  );
  const input = args();
  const props = {
    ...input,
    trainingOptions: training,
    resources: state.createEmptyResourceValues(),
    resourceMaximums: calculateResourceMaximums(input.finalAttributes),
    progression: state.createProgression(),
  };
  const html = renderToStaticMarkup(
    React.createElement(
      Context.Provider,
      { value: { blueprint } },
      React.createElement(Review, props)
    )
  );
  for (const id of input.training)
    assert.ok(html.includes(training.find((e) => e.id === id).name));
  assert.equal(
    /Core Points|Specialty Picks|Stored Core|Rank [1-4]|Current Effect/.test(
      html
    ),
    false
  );
  const sheet = renderToStaticMarkup(
    React.createElement(Checks, {
      character: {
        attributes: input.finalAttributes,
        training: input.training,
        progression: { rank: 1 },
      },
      trainingOptions: training,
    })
  );
  assert.ok(sheet.includes("GM-selected attribute"));
  assert.ok(sheet.includes("No proficiency added."));
  assert.ok(sheet.includes("Roll d20 + 3."));
});

test("missing authoritative resources are explicitly unavailable on historical sheet", async () => {
  const { getTrackerValue } = await load(
    "pages/CharacterSheet/characterSheetHelpers.js"
  );
  const { TrackerCard } = await load(
    "pages/CharacterSheet/CharacterSheetSectionBits/CharacterSheetSectionBits.jsx"
  );
  assert.deepEqual(getTrackerValue(undefined), { current: null, max: null });
  assert.deepEqual(getTrackerValue({ current: 0, max: 12 }), {
    current: 0,
    max: 12,
  });
  const html = renderToStaticMarkup(
    React.createElement(TrackerCard, {
      ...getTrackerValue(undefined),
      label: "Health",
    })
  );
  assert.ok(html.includes("Unavailable"));
  assert.ok(html.includes("Authoritative resource values are missing"));
});

test("historical editor leaves absent Training and resources untouched on unrelated saves", async () => {
  const { default: useCreatorController } = await load(
    "pages/CharacterCreator/logic/controller/useCreatorController.js"
  );
  const input = args();
  const saved = {
    ...buildCharacterPayload(input),
    _id: "historical",
    attributes: input.finalAttributes,
    resources: {
      wounds: { current: 0, max: 3, active: [] },
      corruption: { current: 0, max: 6 },
    },
    skills: { combat: [{ id: "board", rank: 3 }] },
  };
  delete saved.training;
  let view, submitted;
  function Harness() {
    view = useCreatorController({
      blueprint,
      initialCharacter: saved,
      onSaveCharacter: async (p) => {
        submitted = p;
      },
    });
    return null;
  }
  renderToStaticMarkup(React.createElement(Harness));
  assert.deepEqual(view.training, []);
  assert.equal(view.resourceMaximums.health, null);
  assert.equal(view.resourceValues.health, null);
  await view.handleSaveCharacter();
  assert.deepEqual(submitted, {});
});
