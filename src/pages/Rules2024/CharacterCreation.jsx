import { choiceTitle, skillExamples, displayName } from '../../game/creator/choiceLabels';
import { callingRoles, recommendedAttributes, creationStages, stageIndexFor, prerequisiteStage, retainCreationOptions } from '../../game/creator/creationStages';
import { attributeModifier } from '@crossworld/sanguine-engine/attributes';
import { RuleDetails } from '../../game/ui/RuleDetails';
import { CatalogCards, FeatureCards, CallingPaths, CreatorReview, OriginCards, TrainingOverview, CheckCards, EquipmentList } from '../../game/creator/CreatorViews';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { POINT_BUY_BUDGET, POINT_BUY_MINIMUM_SCORE, POINT_BUY_MAXIMUM_SCORE, calculatePointBuyCost, createPointBuyAttributes } from '@crossworld/sanguine-engine/point-buy';
import { backgroundGoldAlternative, backgroundEquipmentEligible, maximumCreationScore,
  creationBackgroundIncreases, creationScores } from '@crossworld/sanguine-engine/progression';
import { useAuth } from '../../hooks/useAuth';
import { getCharacterRules, request } from '../../lib/api';
import LineageSummary from './LineageSummary';
import RequiredChoice from './RequiredChoice';
import { attributeNames } from './labels';
import { BackgroundWorkshop, FeatInspector, FeatWorkshop } from '../../game/creator/OriginsWorkshop';
import TrainingDesk from '../../game/creator/TrainingDesk';
import IdentityFields from './IdentityFields';
import CommandError from './CommandError';
import { GameButton, GamePanel } from '../../game/ui/GameUI';
import CharacterPreview from '../../game/scene/CharacterPreview';
import { defaultAppearance } from '../../game/scene/appearance';
import LineageStep from '../../game/creator/LineageStep';
import { creationWithLineage, hasLineageChoices, lineageFields, splitLineageFields } from '../../game/creator/lineageChoices';
import { lineageTraining, lineageTrainingErrorKey, trainingPrompt, unavailableTrainingOptions } from '../../game/creator/trainingChoices';
import '../../game/creator/creator.css';

const lineageStep = 'Lineage';
const previewSteps = ['Training', 'Abilities and feats', 'Equipment', 'Spells', 'Review'];
const stepChoices = {
  Training: ['skills', 'backgroundSkills', 'backgroundTool', 'instrument', 'expertise', 'languages', 'callingLanguages', 'scholar', 'featTraining', 'initiateList'],
  'Abilities and feats': ['mastery', 'style', 'divineOrder', 'initiateAttribute'],
  Equipment: ['equipment'],
  Spells: ['cantrips', 'prepared', 'folio', 'initiateCantrips', 'initiateSpell', 'styleCantrips'],
};
const trainingDependencies = {
  backgroundSkills: ['skills'], featTraining: ['skills', 'backgroundSkills', 'backgroundTool', 'instrument'],
  callingLanguages: ['languages'], instrument: ['backgroundTool'],
};
const lineageDependencies = ['skills', 'backgroundSkills', 'backgroundTool', 'instrument', 'featTraining', 'initiateList'];
const usesLineageTraining = key => ['expertise', 'scholar'].includes(key);

export default function CharacterCreation() {
  const { token, setCharacters } = useAuth();
  const navigate = useNavigate();
  const [rules,setRules]=useState(null);
  const [step,setStep]=useState('Identity');
  const [trainingDecision, setTrainingDecision] = useState(null);
  const [trainingEdit, setTrainingEdit] = useState(null);
  const [trainingDrafts, setTrainingDrafts] = useState({});
  const [completed, setCompleted] = useState([]);
  const [reconciliation, setReconciliation] = useState('');
  const [originGroup, setOriginGroup] = useState('');
  const [errorSection, setErrorSection] = useState(null);
  const [lineageId, setLineageId] = useState('');
  const [lineageChoices, setLineageChoices] = useState({});
  const [catalogAttempt, setCatalogAttempt] = useState(0);
  const heading = useRef(null);
  const route = useRef(null);
  const [identity,setIdentity]=useState({name:'',notes:''});
  const [scores,setScores]=useState(createPointBuyAttributes);
  const [callingId,setCalling]=useState('');
  const [creation,setCreation]=useState({originId:'',backgroundId:'deckhand',method:'point-buy',increases:{might:2},equipment:'pack',size:'medium'});
  const [split,setSplit]=useState(false);
  const [choices,setChoices]=useState({});
  const [pendingChoice, setPendingChoice] = useState(null);
  const [trainingRepairs, setTrainingRepairs] = useState({});
  const [purchases,setPurchases]=useState([]),[purchaseId,setPurchaseId]=useState('dagger'),[purchaseQuantity,setPurchaseQuantity]=useState(1),[purchaseSpell,setPurchaseSpell]=useState('');
  const [summary,setSummary]=useState(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const createAttempt=useRef(null);
  const saving = useRef(false);
  const lineage = rules?.creation.lineages?.find(entry => entry.id === lineageId);
  const fullCreation = creationWithLineage(creation, lineageId, lineageChoices);
  useEffect(() => {
    heading.current?.focus();
    const stages = route.current;
    const current = stages?.querySelector('[aria-current="step"]');
    if (current && stages.scrollWidth > stages.clientWidth) {
      stages.scrollLeft += current.getBoundingClientRect().left - stages.getBoundingClientRect().left;
    }
  }, [step, rules]);
  const lineageOptions = lineage ? lineageFields(lineage, rules) : [];
  const { contextual: contextualFields, structural: structuralFields } = splitLineageFields(lineageOptions);
  const structuralValues = Object.fromEntries(structuralFields.map(({ key }) => [key, lineageChoices[key]]));
  const contextualComplete = hasLineageChoices(contextualFields, lineageChoices, rules);
  const headers={Authorization:`Bearer ${token}`};
  useEffect(() => {
    const controller = new AbortController();
    getCharacterRules(token, controller.signal)
      .then(result => { if (!controller.signal.aborted) setRules(result); })
      .catch(error => { if (!controller.signal.aborted) setError(error.message); });
    return () => controller.abort();
  }, [token, catalogAttempt]);
  function changeCreation(changes) {
    setCreation(previous => ({ ...previous, ...changes }));
    setSummary(null);
    setError('');
    setErrorSection(null);
  }
  function invalidate(...sections) {
    const affected = [...new Set(sections.map(stageIndexFor))].filter(index => completed.includes(index));
    if (affected.length) setReconciliation('Earlier changes affect your choices in ' +
      affected.map(index => creationStages[index].title).join(', ') + '. Review those steps before saving.');
    setCompleted(previous => previous.filter(index => !sections.some(section => index === stageIndexFor(section))));
    setSummary(null);
  }

  function clearChoices(keys) {
    setTrainingRepairs(previous => ({ ...previous, ...rememberSelections(keys) }));
    setChoices(previous => Object.fromEntries(Object.entries(previous).filter(([key]) => !keys.includes(key))));
    setPendingChoice(previous => keys.includes(previous?.key) ? null : previous);
    setTrainingDrafts(previous => Object.fromEntries(Object.entries(previous).filter(([key]) => !keys.includes(key))));
  }

  function clearBackgroundChoices() {
    clearChoices(['skills', 'backgroundSkills', 'backgroundTool', 'instrument', 'featTraining',
      'initiateAttribute', 'initiateList', 'initiateCantrips', 'initiateSpell', 'expertise', 'scholar']);
    invalidate('Training', 'Abilities and feats', 'Equipment', 'Review');
  }

  function clearExpertise() {
    clearChoices(['expertise', 'scholar']);
    invalidate('Training', 'Review');
  }

  function customChange(key, value) {
    const custom = { ...creation.custom, [key]: value };
    if (key !== 'attributes') clearBackgroundChoices();
    const kept = Object.keys(creation.increases).filter(id => custom.attributes.includes(id));
    const [first, second] = [...new Set([...kept, ...custom.attributes])];
    if (!second) setSplit(false);
    changeCreation({ custom, ...(first && {
      increases: creationBackgroundIncreases(first, second, split && Boolean(second)),
    }) });
  }
  function reportError(e, action) {
    const field = e.fieldPath ?? '';
    const choiceKey = /^firstLevel\.choices\.([^.]+)/.exec(field)?.[1];
    const choiceSection = Object.keys(stepChoices).find(name => stepChoices[name].includes(choiceKey));
    const section = /^creation\.lineage\.choices\.(skill|originFeat)/.test(field) ? 'Training'
      : field.startsWith('creation.lineage') ? 'Lineage'
      : field.startsWith('purchases') || field === 'firstLevel.choices.equipment' ? 'Equipment'
      : field.startsWith('creation.origin') ? 'Origin'
      : field.startsWith('creation.background') || field.startsWith('creation.custom') ? 'Background'
      : field.startsWith('attributes') || field.startsWith('baseAttributes') ? 'Attributes'
      : ['name', 'pronouns', 'appearance', 'portraitUrl', 'notes'].includes(field) ? 'Identity' : choiceSection;
    const trainingKey = lineageTrainingErrorKey(field);
    const detail = trainingKey === 'training'
      ? 'Review your Skilled feat and replace any skill or tool you already have.'
      : field.startsWith('creation.lineage.choices.skill')
      ? 'Choose Lineage Training you do not already receive from your Calling, Background, or feat.'
      : field.startsWith('creation.lineage.choices.originFeat')
        ? 'Check your Lineage Origin feat for duplicate feats, Training, or spell lists.'
        : e.message;
    setError(action + ' failed. ' + (e.status ? detail : 'The server could not be reached. Try again.'));
    setErrorSection(section);
    if (trainingKey) {
      setStep('Training');
      setTrainingDecision(trainingKey);
    }
    if (section === 'Equipment' && step === 'Review') setSummary(null);
  }
  async function preview(nextChoices = choices, nextPurchases = purchases, includeLineage = step === 'Review' || completed.includes(stageIndexFor('Training')), draftCreation = creation, draftLineage = lineageChoices, { inspectOnly = false, rememberedChoices = trainingRepairs } = {}) {
    const previewCreation = (draft, decisions = nextChoices) => request('/archipelago/characters/preview', {
      method: 'POST', headers,
      body: JSON.stringify({
        attributes: scores, creation: draft,
        firstLevel: { callingId, choices: decisions }, purchases: decisions.equipment?.length ? nextPurchases : [],
      }),
    });
    // The server resolves ordinary Training first. Expertise can then use Lineage Training.
    const useFullCreation = includeLineage || Boolean(nextChoices.expertise || nextChoices.scholar);
    setBusy(true);
    setError('');
    setErrorSection(null);
    try {
      const lineageCreation = creationWithLineage(draftCreation, lineageId, draftLineage);
      const draft = useFullCreation ? lineageCreation : creationWithLineage(draftCreation, lineageId, structuralValues);
      let result = await previewCreation(draft);
      if (inspectOnly) return result;
      const applyBackgroundGrants = async () => {
        const decision = result.requiredChoices.find(choice => choice.key === 'backgroundSkills');
        if (decision && decision.requiredOptions?.length === decision.count) {
          const candidate = { ...nextChoices, backgroundSkills: decision.requiredOptions };
          result = await previewCreation(draft, candidate);
          nextChoices = candidate;
        }
      };
      await applyBackgroundGrants();
      const restored = [];
      while (restored.length < Object.keys(rememberedChoices).length) {
        const decision = result.requiredChoices.find(choice => {
          if (!rememberedChoices[choice.key] || restored.includes(choice.key)) return false;
          const dependencies = usesLineageTraining(choice.key) ? lineageDependencies : trainingDependencies[choice.key];
          if (result.requiredChoices.some(other => dependencies?.includes(other.key))) return false;
          if (usesLineageTraining(choice.key) && (!contextualComplete || draft !== lineageCreation)) return false;
          return retainCreationOptions(choice, rememberedChoices[choice.key]).length >= choice.count;
        });
        if (!decision) break;
        const retained = retainCreationOptions(decision, rememberedChoices[decision.key]).slice(0, decision.count);
        const candidate = { ...nextChoices, [decision.key]: retained };
        try {
          result = await previewCreation(draft, candidate);
          nextChoices = candidate;
        } catch (error) {
          if (error.status !== 422) throw error;
          break;
        }
        restored.push(decision.key);
        await applyBackgroundGrants();
      }
      if (!useFullCreation && result.requiredChoices.some(choice => usesLineageTraining(choice.key)) &&
          !result.requiredChoices.some(choice => lineageDependencies.includes(choice.key)) &&
          lineageTraining(contextualFields, draftLineage, rules, result, background, draftCreation, nextChoices)
            .every(decision => decision.complete)) {
        result = await previewCreation(lineageCreation, nextChoices);
        const decision = result.requiredChoices.find(choice => usesLineageTraining(choice.key));
        const remembered = rememberedChoices[decision?.key];
        const retained = decision && remembered && retainCreationOptions(decision, remembered);
        if (retained && retained.length >= decision.count) {
          const candidate = { ...nextChoices, [decision.key]: retained.slice(0, decision.count) };
          result = await previewCreation(lineageCreation, candidate);
          nextChoices = candidate;
          restored.push(decision.key);
        }
      }
      setTrainingRepairs(previous => Object.fromEntries(Object.entries(previous).filter(([key]) => !nextChoices[key])));
      setChoices(nextChoices);
      setSummary(result);
      return { ...result, acceptedChoices: nextChoices };
    } catch (error) {
      reportError(error, 'Rules check');
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    if (saving.current) return;
    saving.current = true;
    setBusy(true);setError('');setErrorSection(null);
    try {
      const body=JSON.stringify({
        ...identity,attributes:scores,creation:fullCreation,firstLevel:{callingId,choices},purchases,
      });
      if(createAttempt.current?.body!==body)createAttempt.current={body,operationId:crypto.randomUUID()};
      const result=await request('/archipelago/characters',{method:'POST',headers:{...headers,'Idempotency-Key':createAttempt.current.operationId},body});
      setCharacters(old=>[result,...old.filter(c=>c._id!==result._id)]);navigate('/characters/'+result._id);
    } catch(e) {reportError(e, 'Save');} finally {saving.current = false;setBusy(false);}
  }
  if (!rules || !rules.creation.lineages?.length) return <main className="sa-creator">
    <GamePanel title="Character Creator">
      <p role={error || rules ? 'alert' : 'status'}>{error || (rules ? 'This server does not offer Lineage creation yet.' : 'Loading character rules.')}</p>
      {error && <GameButton onClick={() => { setError(''); setCatalogAttempt(value => value + 1); }}>Retry catalog</GameButton>}
      <GameButton to="/characters">Your roster</GameButton>
    </GamePanel>
  </main>;
  const background=rules.creation.backgrounds.find(b=>b.id===creation.backgroundId);
  function rememberSelections(keys) {
    const fixedSkills = creation.custom?.skills ?? background.skills;
    return Object.fromEntries(keys.flatMap(key => {
      const current = trainingDrafts[key] ?? choices[key];
      const selected = key === 'backgroundSkills' ? current?.filter(id => !fixedSkills.includes(id)) : current;
      return selected?.length ? [[key, selected]] : [];
    }));
  }
  const origin=rules.creation.origins.find(o=>o.id===creation.originId);
  const calling=rules.callings.find(c=>c.id===callingId);
  const eligibleAttributes=background.id==='custom'?creation.custom.attributes:background.attributes;
  let usedPoints;
  try {
    usedPoints=calculatePointBuyCost(scores);
  } catch (error) {
    if (!(error instanceof TypeError || error instanceof RangeError)) throw error;
  }
  const firstAttribute=Object.keys(creation.increases)[0];
  const secondAttribute=Object.keys(creation.increases)[1]??eligibleAttributes.find(a=>a!==firstAttribute);
  function increases(first, second, isSplit = split) {
    const alternate = second === first ? eligibleAttributes.find(id => id !== first) : second;
    changeCreation({ increases: creationBackgroundIncreases(first, alternate, isSplit) });
  }
  const stageIndex = stageIndexFor(step);
  const stage = creationStages[stageIndex];
  const active = name => stage.steps.includes(name) && (name !== 'Attributes' && name !== 'Training' || name === step);
  const usesPreview = stage.steps.some(name => active(name) && previewSteps.includes(name));
  const displayedChoice = usesPreview && step !== 'Review'
    ? summary?.requiredChoices.find(choice => stage.steps.some(name => stepChoices[name]?.includes(choice.key)) &&
      (contextualComplete || !['expertise', 'scholar'].includes(choice.key)))
    : null;
  const lineageDecisions = lineageTraining(contextualFields, lineageChoices, rules, summary, background, creation, choices);
  const missingLineage = lineageDecisions.find(decision => !decision.complete);
  const trainingRequests = (summary?.requiredChoices ?? []).filter(choice => stepChoices.Training.includes(choice.key));
  const lineagePrerequisite = trainingRequests.find(choice =>
    lineageDependencies.includes(choice.key));
  const trainingBlocker = key => {
    if (lineageDecisions.some(decision => decision.key === key)) return lineagePrerequisite?.key;
    if (['expertise', 'scholar'].includes(key)) return lineagePrerequisite?.key ?? missingLineage?.key;
    return trainingRequests.find(choice => trainingDependencies[key]?.includes(choice.key))?.key;
  };
  const orderedTrainingRequests = stepChoices.Training.flatMap(key =>
    trainingRequests.filter(choice => choice.key === key));
  const nextTrainingRequest = orderedTrainingRequests.find(choice => !trainingBlocker(choice.key));
  const trainingChoice = (trainingEdit?.decision.key === trainingDecision ? trainingEdit.decision : null) ??
    trainingRequests.find(choice => choice.key === trainingDecision) ??
    (!trainingDecision ? nextTrainingRequest : null);
  const currentTraining = trainingDecision ?? trainingChoice?.key ?? missingLineage?.key ?? 'grants';
  const activeLineageDecision = lineageDecisions.find(decision => decision.key === currentTraining);
  const trainingDecisions = [...stepChoices.Training.filter(key => trainingRequests.some(choice => choice.key === key) ||
            (choices[key]?.length && (key !== 'backgroundSkills' || choices.skills?.some(id =>
              (creation.custom?.skills ?? background.skills).includes(id))))).map(key => ({
            key, label: key === 'backgroundSkills' ? 'Background skill replacements' : choiceTitle(key),
            complete: Boolean(choices[key]?.length), invalid: Boolean(trainingRepairs[key]),
          })), ...lineageDecisions].map(decision => ({
    ...decision,
    blocker: trainingBlocker(decision.key),
  }));
  const trainingPrerequisite = trainingDecisions.find(decision => decision.key === trainingBlocker(currentTraining));

  function selectTrainingDecision(decision) {
    setError('');
    if (!decision.blocker && !lineageDecisions.some(item => item.key === decision.key) && decision.complete) {
      editTrainingChoice(decision.key);
    } else {
      setTrainingEdit(null);
      setTrainingDecision(decision.key);
    }
  }

  const attributes = origin && usedPoints !== undefined
    ? creationScores(scores, origin.attribute, Object.keys(attributeNames), eligibleAttributes, creation.increases)
    : null;

  function selectBackground(id) {
    if (id === background.id) return;
    clearBackgroundChoices();
    const entry = rules.creation.backgrounds.find(item => item.id === id);
    setSplit(false);
    changeCreation({
      backgroundId: id, increases: { [entry.attributes[0]]: 2 },
      equipment: id === 'custom' ? 'gold' : 'pack',
      custom: id === 'custom' ? {
        attributes: ['might', 'agility', 'resolve'], skills: [],
        tool: '', feat: '',
      } : undefined,
    });
  }

  function selectOrigin(id) {
    const language = rules.creation.origins.find(entry => entry.id === id)?.language;
    if (language && choices.languages?.includes(language)) {
      clearChoices(['languages', 'callingLanguages']);
      invalidate('Training', 'Review');
    } else if (language && choices.callingLanguages?.includes(language)) {
      clearChoices(['callingLanguages']);
      invalidate('Training', 'Review');
    }
    changeCreation({ originId: id });
  }

  function selectCalling(id) {
    if (id === callingId) return;
    setCalling(id);
    clearChoices([...new Set([...Object.keys(choices), ...Object.keys(trainingDrafts)])].filter(key => !['languages', 'instrument', 'initiateList', 'initiateAttribute', 'initiateCantrips', 'initiateSpell'].includes(key)));
    invalidate('Training', 'Abilities and feats', 'Equipment', 'Review');
    setPendingChoice(null);
    setSummary(null);
  }

  async function editTrainingChoice(key) {
    const dependent = {
      skills: ['backgroundSkills', 'featTraining', 'expertise', 'scholar'],
      backgroundSkills: ['featTraining', 'expertise', 'scholar'],
      featTraining: ['expertise', 'scholar'],
      languages: ['callingLanguages'],
      backgroundTool: ['instrument'],
      initiateList: ['initiateCantrips', 'initiateSpell', 'expertise', 'scholar'],
    }[key] ?? [];
    const draft = Object.fromEntries(Object.entries(choices).filter(([id]) => id !== key && !dependent.includes(id)));
    const includeLineage = usesLineageTraining(key) || !lineageDependencies.includes(key) && !missingLineage;
    const result = await preview(draft, [], includeLineage, creation, lineageChoices, { inspectOnly: true });
    const decision = result?.requiredChoices.find(choice => choice.key === key);
    if (!decision) return;
    setTrainingDecision(key);
    setTrainingEdit({ decision, dependent, projection: result });
  }

  async function editCallingLoadout() {
    const { equipment, ...otherChoices } = choices;
    const result = await preview(otherChoices, [], true);
    const decision = result?.requiredChoices.find(choice => choice.key === 'equipment');
    if (!decision) return;
    setCompleted(previous => previous.filter(index => index !== stageIndexFor('Equipment')));
    setPendingChoice({ id: decision.id, key: decision.key, selected: equipment });
  }

  function adjustScore(id, increment) {
    setScores(previous => ({ ...previous, [id]: previous[id] + increment }));
    setSummary(null);
    setError('');
  }

  function selectionFor(choice) {
    if (pendingChoice?.id === choice.id) return pendingChoice.selected;
    const previous = trainingRepairs[choice.key] ?? [];
    return retainCreationOptions(choice, previous).slice(0, choice.count);
  }
  function goTo(next) {
    setError('');
    setErrorSection(null);
    setStep(next);
    setTrainingEdit(null);
  }

  const trainingStage = stageIndexFor('Training');
  function missingFor(index) {
    const sections = creationStages[index].steps;
    if (sections.includes('Identity') && identity.name.trim().length < 2)
      return 'Enter a character name with at least two characters.';
    if (sections.includes('Lineage')) {
      if (!lineage) return 'Choose a Lineage.';
      const fields = structuralFields;
      if (!hasLineageChoices(fields, structuralValues, rules)) {
        const missing = fields.filter(field => !hasLineageChoices([field], lineageChoices, rules));
        return 'Complete ' + (missing.map(field => field.label.toLowerCase()).join(', ') || 'your Lineage feat options') + '.';
      }
    }
    if (sections.includes('Origin') && !origin)
      return originGroup === 'archipelago' ? 'Choose your island.' : 'Choose where your character comes from.';
    if (sections.includes('Background') && background.id === 'custom' &&
        (creation.custom.attributes.length !== 3 || creation.custom.skills.length !== 2))
      return 'Choose three eligible attributes and two Background skills.';
    if (sections.includes('Background') && background.id === 'custom' && (!creation.custom.tool || !creation.custom.feat))
      return 'Choose a Background tool and Origin feat.';
    if (sections.includes('Calling') && !calling) return 'Choose a Calling.';
    if (sections.includes('Attributes') && (usedPoints === undefined || usedPoints > POINT_BUY_BUDGET || attributes?.error))
      return attributes?.error || 'Set all six base scores within the point-buy range and budget.';
    return '';
  }

  const prerequisites = creationStages.map((_, index) => missingFor(index));
  const blockerFor = index => prerequisiteStage(prerequisites, completed, index);

  async function openStage(index, draftChoices = choices, projection = summary) {
    const next = creationStages[index].steps[0];
    setTrainingDecision(null);
    goTo(next);
    if (index > trainingStage && (!projection || next === 'Review')) {
      await preview(draftChoices, purchases, true);
    }
  }

  async function openTraining() {
    setTrainingDecision(null);
    goTo('Training');
    if (!summary) await preview(choices, [], completed.includes(trainingStage));
  }

  function changeLineageTraining(decision, selected) {
    const value = decision.count === 1 ? selected[0] : selected;
    const feat = lineageChoices.originFeat;
    const next = { ...lineageChoices, [decision.key]: value };
    if (decision.nested) {
      delete next[decision.key];
      next.originFeat = {
        ...feat,
        options: decision.key === 'list'
          ? { list: value, attribute: feat.options?.attribute }
          : { ...feat.options, [decision.key]: value },
      };
    } else if (decision.key === 'originFeat') {
      next.originFeat = value ? { id: value } : undefined;
    }
    setLineageChoices(next);
    setCompleted(previous => previous.filter(index => index !== trainingStage));
    setError('');
    const dependent = ['expertise', 'scholar'];
    const otherChoices = Object.fromEntries(Object.entries(choices).filter(([key]) => !dependent.includes(key)));
    const rememberedChoices = { ...trainingRepairs, ...rememberSelections(dependent) };
    clearChoices(dependent);
    const decisions = lineageTraining(contextualFields, next, rules, summary, background, creation, choices);
    if (!lineagePrerequisite && decisions.every(item => item.complete)) {
      preview(otherChoices, [], true, creation, next, { rememberedChoices });
    }
  }

  async function changeTrainingChoice(choice, selected) {
    setError('');
    if (!trainingEdit) setTrainingDrafts(previous => ({ ...previous, [choice.key]: selected }));
    if (selected.length !== choice.count) return;
    const dependent = trainingEdit?.dependent ?? [];
    const nextChoices = Object.fromEntries(Object.entries(choices).filter(([id]) => !dependent.includes(id)));
    const rememberedChoices = { ...trainingRepairs, ...rememberSelections(dependent) };
    const result = await preview({ ...nextChoices, [choice.key]: selected }, [],
      !missingLineage && usesLineageTraining(choice.key), creation, lineageChoices, { rememberedChoices });
    if (!result) return;
    if (trainingEdit) {
      setCompleted(previous => previous.filter(index => ![trainingStage, stageIndexFor('Review')].includes(index)));
      setTrainingRepairs(Object.fromEntries(Object.entries(rememberedChoices).filter(([key]) => !result.acceptedChoices[key])));
    }
    setTrainingEdit(null);
    setTrainingDrafts(previous => Object.fromEntries(Object.entries(previous).filter(([key]) => key !== choice.key && !dependent.includes(key))));
    setTrainingRepairs(previous => Object.fromEntries(Object.entries(previous).filter(([key]) => key !== choice.key)));
    setTrainingDecision(null);
  }

  async function continueDraft() {
    if (prerequisites[stageIndex]) {
      setError(prerequisites[stageIndex]);
      return;
    }
    if (step === 'Attributes') {
      await openTraining();
      return;
    }
    if (step === 'Training') {
      if (!summary) {
        await preview(choices, [], false);
        return;
      }
      if (nextTrainingRequest || missingLineage || trainingRequests.length) {
        const currentRequest = orderedTrainingRequests.find(choice => choice.key === currentTraining) ??
          (activeLineageDecision?.complete ? null : activeLineageDecision);
        const decision = (!trainingBlocker(currentTraining) && currentRequest) ||
          nextTrainingRequest || missingLineage || orderedTrainingRequests[0];
        setTrainingDecision(decision.key);
        setTrainingEdit(null);
        const label = decision.label ?? choiceTitle(decision.key);
        const remaining = decision.count - (decision.selected?.length ??
          retainCreationOptions(decision, trainingDrafts[decision.key] ?? trainingRepairs[decision.key]).length);
        setError(remaining > 0
          ? 'Choose ' + remaining + ' more for ' + label + ' before continuing.'
          : 'Review ' + label + ' before continuing.');
        return;
      }
    }
    let nextChoices = choices;
    let projection = summary;
    if (usesPreview) {
      if (displayedChoice && step !== 'Training') {
        const selected = selectionFor(displayedChoice);
        const remaining = displayedChoice.count - selected.length;
        if (remaining > 0) {
          setError('Choose ' + remaining + ' more for ' + choiceTitle(displayedChoice.key) + '.');
          return;
        }
        nextChoices = { ...choices, [displayedChoice.key]: selected };
      }
      const result = await preview(nextChoices, active('Equipment') ? purchases : [], stageIndex >= trainingStage);
      projection = result;
      if (!result) return;
      nextChoices = result.acceptedChoices;
      if (displayedChoice && step !== 'Training') {
        setPendingChoice(null);
        setTrainingRepairs(previous => Object.fromEntries(Object.entries(previous).filter(([key]) => key !== displayedChoice.key)));
        if (result.requiredChoices.some(choice => stage.steps.some(name => stepChoices[name]?.includes(choice.key)))) return;
      }
      if (step === 'Training' && result.requiredChoices.some(choice => stepChoices.Training.includes(choice.key))) {
        setTrainingDecision(result.requiredChoices.find(choice => stepChoices.Training.includes(choice.key)).key);
        return;
      }
      if (active('Spells') && !result.decisionsComplete) {
        const unresolved = result.requiredChoices[0];
        const section = Object.keys(stepChoices).find(name => stepChoices[name].includes(unresolved?.key));
        setErrorSection(section ?? (unresolved?.id.startsWith('creation.lineage') ? 'Training' : null));
        setError(unresolved ? 'Complete ' + choiceTitle(unresolved.key) + ' before saving.' : 'Review the starting choices before saving.');
        return;
      }
    }
    if (active('Equipment')) setReconciliation('');
    setCompleted(previous => [...new Set([...previous, stageIndex])]);
    let nextIndex = stageIndex + 1;
    const reviewIndex = stageIndexFor('Review');
    while (projection && nextIndex < reviewIndex && completed.includes(nextIndex) &&
        !projection.requiredChoices.some(choice => creationStages[nextIndex].steps.some(name => stepChoices[name]?.includes(choice.key)))) {
      nextIndex++;
    }
    await openStage(nextIndex, nextChoices, projection);
  }

  const customAttributeOptions = Object.entries(attributeNames).map(([id, name]) => ({ id, name }));
  const backgroundAttributeOptions = customAttributeOptions.filter(entry => eligibleAttributes.includes(entry.id));
  const content = <section aria-invalid={Boolean(error) || undefined} className={'sa-creator__surface'} aria-label={stage.title}>
      <h2 ref={heading} tabIndex={-1}>{stageIndex === trainingStage ? step : stage.title}</h2>
      {stageIndex === trainingStage && <nav className="sa-subnav" aria-label="Attributes and Training sections">
        <GameButton disabled={busy} aria-current={step === 'Attributes' ? 'step' : undefined}
          onClick={() => goTo('Attributes')}>Attributes</GameButton>
        <GameButton disabled={busy || Boolean(prerequisites[trainingStage])}
          aria-current={step === 'Training' ? 'step' : undefined} onClick={openTraining}>
          Training{completed.includes(trainingStage) ? ' · Complete' : ' · To review'}
        </GameButton>
      </nav>}
      <fieldset disabled={busy}>
        {step===lineageStep && <LineageStep rules={rules} lineage={lineage} values={lineageChoices}
          fields={structuralFields} onSelect={id => {
            const next = rules.creation.lineages.find(entry => entry.id === id);
            setLineageId(id);
            setLineageChoices(previous => Object.fromEntries(lineageFields(next, rules).flatMap(({ key, options }) => {
              const value = previous[key];
              const contextual = ['skill', 'skills', 'originFeat'].includes(key);
              return value !== undefined && (contextual || options.some(option => option.id === value))
                ? [[key, value]] : [];
            })));
            setPendingChoice(null);
            clearExpertise();
            setError('');
          }}
          onChange={(key, value) => {
            setLineageChoices(previous => ({ ...previous, [key]: value }));
            if (['skill', 'skills', 'originFeat'].includes(key)) clearExpertise();
            setSummary(null);
            setError('');
          }} />}
        {active('Identity')&&<><IdentityFields value={identity} onChange={value => { setIdentity(value); setError(''); }} storyOnly/></>}
        {active('Origin')&&<>{<OriginCards origins={rules.creation.origins} group={originGroup}
          origin={origin} onGroup={(group, id) => {
            setOriginGroup(group);
            selectOrigin(id);
          }} onIsland={selectOrigin} />}
          {origin && <><p>{origin.lore}</p><p>Origin grants +1 {attributeNames[origin.attribute]} and {displayName(origin.language, rules)}.</p></>}</>}
        {active('Background')&&<>
          <BackgroundWorkshop rules={rules} background={background} creation={creation} onChange={selectBackground} />
          {background.id==='custom'?<>
            {<>
              <CheckCards label="Eligible Background attributes" count={3} entries={customAttributeOptions}
                selected={creation.custom.attributes} onChange={value => customChange('attributes', value)} />
              <CheckCards label="Background skills" count={2} entries={rules.skills}
                selected={creation.custom.skills} onChange={value => customChange('skills', value)}
                describe={skill => attributeNames[skill.attribute] + ' · ' + skillExamples[skill.id]} />
            </>}
            <label>Tool <select value={creation.custom.tool} onChange={e=>customChange('tool',e.target.value)}><option value="">Choose a tool</option>{rules.creation.tools.map(id=><option key={id} value={id}>{displayName(id)}</option>)}</select></label>
            <FeatWorkshop entries={rules.feats.filter(feat => feat.category === 'origin')}
              value={creation.custom.feat} onChange={id => customChange('feat', id)} />
          </>:null}
          <label><input type="checkbox" checked={split} onChange={e=>{setSplit(e.target.checked);increases(firstAttribute,secondAttribute,e.target.checked);}}/>Split +1 between two attributes</label>
          {<>
            <CatalogCards label={split ? 'First +1 bonus' : 'Apply +2 to'} entries={backgroundAttributeOptions}
              value={firstAttribute} onChange={id => increases(id, secondAttribute)} />
            {split && <CatalogCards label="Second +1 bonus" value={secondAttribute}
              entries={backgroundAttributeOptions.filter(entry => entry.id !== firstAttribute)}
              onChange={id => increases(firstAttribute, id)} />}
          </>}
        </>}
        {active('Calling')&&<>{<p>Your Calling determines your starting abilities and Training. Each Calling offers four Paths starting at Calling level 3.</p>}{<CatalogCards label="Calling" entries={rules.callings} value={callingId}
          onChange={selectCalling} describe={entry => callingRoles[entry.id]} />}
          {calling && <><h3>Starting features</h3><FeatureCards calling={calling} />
            <CallingPaths calling={calling} rules={rules} /></>}</>}
        {active('Attributes')&&<><p>Every base score starts at {POINT_BUY_MINIMUM_SCORE}. Spend points on base scores before Origin and Background bonuses are added.</p>
          {calling && <RuleDetails title={calling.name + ' recommendation'}>
            <p>{recommendedAttributes[callingId].reason}</p>
            <p>{Object.entries(recommendedAttributes[callingId].scores).map(([id, value]) => attributeNames[id] + ' ' + value).join(' · ')}</p>
            <GameButton onClick={() => { setScores({ ...recommendedAttributes[callingId].scores }); setSummary(null); setError(''); }}>
              Apply recommended attributes
            </GameButton>
          </RuleDetails>}<p>Point buy: {usedPoints===undefined?'enter valid base scores':`${usedPoints} / ${POINT_BUY_BUDGET}`}. Base scores {POINT_BUY_MINIMUM_SCORE}–{POINT_BUY_MAXIMUM_SCORE}; final creation maximum {maximumCreationScore}.</p>
          {<div className="sa-attribute-grid">
            {Object.entries(attributeNames).map(([id, name]) => {
              const score = attributes?.scores?.[id];
              const modifier = score === undefined ? null : attributeModifier(score);
              return <section className="sa-attribute" key={id}>
                <h3>{name}</h3>
                <div>
                  <GameButton aria-label={'Lower ' + name} disabled={scores[id] <= POINT_BUY_MINIMUM_SCORE}
                    onClick={() => adjustScore(id, -1)}>−</GameButton>
                  <output aria-label={name + ' base score'}>{scores[id]}</output>
                  <GameButton aria-label={'Raise ' + name} disabled={scores[id] >= POINT_BUY_MAXIMUM_SCORE ||
                    calculatePointBuyCost({ ...scores, [id]: scores[id] + 1 }) > POINT_BUY_BUDGET}
                    onClick={() => adjustScore(id, 1)}>+</GameButton>
                </div>
                <small>{score === undefined ? 'Check bonuses' : score + ' final · ' + (modifier >= 0 ? '+' : '') + modifier + ' modifier'}</small>
              </section>;
            })}
          </div>}
          {<p role="status">{attributes?.error || (POINT_BUY_BUDGET - usedPoints) + " points remaining"}</p>}
          <p>Origin +1 {attributeNames[origin.attribute]}; background {Object.entries(creation.increases).map(([id,n])=>`+${n} ${attributeNames[id]}`).join(', ')}.</p></>}
        {active('Training') && <TrainingDesk decisions={trainingDecisions} current={currentTraining}
          onSelect={selectTrainingDecision}>
          <TrainingOverview rules={rules} background={background} creation={creation} choices={choices} summary={summary} />
        </TrainingDesk>}
        {active('Abilities and feats') && <><h3>Starting features</h3><FeatureCards calling={calling} />
          {rules.feats.filter(feat => feat.id === (creation.custom?.feat ?? background.feat)).map(feat => <FeatInspector key={feat.id} feat={feat} />)}
          <details><summary>Future features by level</summary><FeatureCards calling={calling} future /></details></>}
        {active('Equipment')&&<>{<CatalogCards label="Background equipment" value={creation.equipment}
          onChange={equipment => { changeCreation({ equipment }); preview(choices, purchases, true, { ...creation, equipment }); }}
          entries={[
            ...(backgroundEquipmentEligible(background.id, 'pack') ? [{ id: 'pack', name: 'Background package' }] : []),
            { id: 'gold', name: backgroundGoldAlternative + ' GP' },
          ]} describe={entry => entry.id === 'pack' ? background.items?.map(id => rules.equipment.items.find(item => item.id === id)?.name ?? displayName(id)).join(', ') : 'Buy starting gear below'} />}
          <p>Choose a Calling equipment package or take its gold value. Gear begins carried; equip it on your saved sheet.</p>
          {choices.equipment?.length > 0 && !displayedChoice && <GameButton onClick={editCallingLoadout}>Change Calling loadout</GameButton>}</>}
        {active('Equipment')&&<details className="sa-outfitter"><summary>Buy starting gear</summary><fieldset><legend>Optional starting purchases</legend><label>Starting item to buy <select value={purchaseId} onChange={e=>setPurchaseId(e.target.value)}>{rules.equipment.items.filter(i=>Number.isSafeInteger(i.costCp)&&!i.magic).map(i=><option key={i.id} value={i.id}>{i.name}: {i.costCp} copper{i.units?` per ${i.units}`:''}</option>)}</select></label>{rules.equipment.items.find(d=>d.id===purchaseId)?.purchaseScrollLevel!==undefined&&<label>Starting scroll spell <select value={purchaseSpell} onChange={e=>setPurchaseSpell(e.target.value)}><option value="">Choose exact spell</option>{rules.spells.filter(s=>s.level===rules.equipment.items.find(d=>d.id===purchaseId).purchaseScrollLevel).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>}<label>Starting purchase quantity <input type="number" min={1} max={100000} value={purchaseQuantity} onChange={e=>setPurchaseQuantity(Number(e.target.value))}/></label><button disabled={!Number.isSafeInteger(purchaseQuantity)||purchaseQuantity<1} onClick={()=>{const next=[...purchases,{definitionId:purchaseId,quantity:purchaseQuantity,...(rules.equipment.items.find(d=>d.id===purchaseId)?.purchaseScrollLevel!==undefined?{spellId:purchaseSpell}:{})}];setPurchases(next);if (choices.equipment) preview(choices,next);}}>Add to starting kit</button><ul>{purchases.map((p,i)=><li key={i}>{rules.equipment.items.find(d=>d.id===p.definitionId)?.name}: {p.quantity}<button onClick={()=>{const next=purchases.filter((_,index)=>index!==i);setPurchases(next);if (choices.equipment) preview(choices,next);}}>Remove purchase {i+1}</button></li>)}</ul><p>The server validates the entire basket against both starting balances; invalid purchases block saving.</p></fieldset></details>}

        {usesPreview&&<>{(!summary) && <button type="button" onClick={()=>preview(choices, active('Equipment') || active('Review') ? purchases : [])} disabled={usedPoints===undefined||usedPoints>POINT_BUY_BUDGET}>Refresh choices</button>}
          {!active('Review') && !active('Training') && displayedChoice && <RequiredChoice key={displayedChoice.id} rules={rules} choice={displayedChoice} tiles
            initialSelected={selectionFor(displayedChoice)}
            onDraftChange={selected => setPendingChoice({ id: displayedChoice.id, key: displayedChoice.key, selected })}
            />}
          {active('Training') && <div id="sa-training-choice" tabIndex={-1} data-needs-attention={Boolean(error && trainingDecision) || undefined}>
            <CommandError message={error} />
            {trainingChoice && !trainingBlocker(trainingChoice.key) && <RequiredChoice key={trainingChoice.id}
              rules={rules} choice={trainingChoice} tiles
              prompt={trainingPrompt(trainingChoice, rules, background, creation)} unavailable={unavailableTrainingOptions(trainingChoice,
                trainingEdit?.projection ?? summary, choices, rules, background, creation)}
              initialSelected={retainCreationOptions(trainingChoice,
                trainingEdit ? choices[trainingChoice.key] : trainingDrafts[trainingChoice.key] ?? trainingRepairs[trainingChoice.key])}
              onDraftChange={selected => changeTrainingChoice(trainingChoice, selected)} />}
            {activeLineageDecision && !trainingBlocker(activeLineageDecision.key) && <>
              {activeLineageDecision.invalid && <p role="status">
                A previous selection is now unavailable. Choose a replacement.
              </p>}
              {activeLineageDecision.key === 'originFeat'
                ? <FeatWorkshop entries={activeLineageDecision.entries} value={activeLineageDecision.selected[0]}
                    onChange={id => changeLineageTraining(activeLineageDecision, [id])} />
                : <CheckCards label={activeLineageDecision.label} count={activeLineageDecision.count}
                entries={activeLineageDecision.entries} selected={activeLineageDecision.selected}
                onChange={selected => changeLineageTraining(activeLineageDecision, selected)}
                describe={entry => entry.description} replaceSingle />}
            </>}
            {trainingPrerequisite && <div className="sa-training-context">
              <p>Finish {trainingPrerequisite.label} to see the eligible choices for this decision.</p>
              <GameButton onClick={() => selectTrainingDecision(trainingPrerequisite)}>Open prerequisite</GameButton>
            </div>}
          </div>}
          {summary && active('Review') && <p role="status">{summary.decisionsComplete ? 'All required selections are complete.' : `${summary.requiredChoices.length} required selections remain.`}</p>}
        </>}
        {(active('Equipment') || active('Review')) && summary?.creationEquipment && (
          <section className={'sa-kit'}>
            <h3>Starting kit</h3>
            <p>{summary.creationEquipment.goldCp} copper available</p>
            <EquipmentList items={summary.creationEquipment.items} />
          </section>
        )}
        {active('Review')&&<><header className="sa-review-identity"><h3>{identity.name}</h3>
          <p>{lineage?.name} · Level 1 {calling.name}</p><p>{origin.name} · {background.name}</p>
          <nav aria-label="Edit character decisions">{['Identity', 'Lineage', 'Origin', 'Calling', 'Training', 'Equipment'].map(section =>
            <GameButton key={section} onClick={() => section === 'Training' ? openTraining() : openStage(stageIndexFor(section))}>Edit {section}</GameButton>)}</nav>
        </header>
          {summary?.lineage && <LineageSummary lineage={summary.lineage} rules={rules} />}
          {summary && (<CreatorReview summary={summary} rules={rules} identity={identity} calling={calling}
                choices={choices} spellKeys={stepChoices.Spells} /> )}
          {summary && !summary.decisionsComplete && <ul className="sa-review-errors">
            {summary.requiredChoices.map(choice => {
              const section = Object.keys(stepChoices).find(name => stepChoices[name].includes(choice.key)) ?? 'Training';
              const key = lineageTrainingErrorKey(choice.id) ?? choice.key;
              const label = lineageDecisions.find(decision => decision.key === key)?.label ?? choiceTitle(key);
              return <li key={choice.id}><GameButton onClick={async () => {
                if (section === 'Training') {
                  await openTraining();
                  setTrainingDecision(key);
                } else await openStage(stageIndexFor(section));
              }}>
                Complete {label}
              </GameButton></li>;
            })}
          </ul>}
          </>}
      </fieldset>
    </section>;

  return <main className="sa-creator">
    <header className="sa-creator__header">
      <h1>Chart your character</h1>
      <GameButton to="/characters">Your roster</GameButton>
    </header>
    <nav className="sa-creator__route" aria-label="Character creation stages">
      <ol ref={route} className="sa-steps">{creationStages.map(({ title }, index) => {
        const blocker = blockerFor(index);
        const status = index === stageIndex ? 'Current' : blocker >= 0 ? 'Requires ' + creationStages[blocker].title
          : !prerequisites[index] && (index < trainingStage || completed.includes(index)) ? 'Complete' : 'Available';
        return <li key={title}>
          <GameButton disabled={busy} aria-disabled={blocker >= 0 || undefined}
            aria-current={index === stageIndex ? 'step' : undefined}
            onClick={() => { if (blocker < 0) openStage(index); }}>
            <span className="sa-step-index" aria-hidden="true" /><span>{title}<small>{status}</small></span>
          </GameButton>
        </li>;
      })}</ol>
    </nav>
    <div className="sa-creator__body">
      <aside className="sa-creator__aside">
        <CharacterPreview name={identity.name} lineage={lineage?.name} calling={calling?.name}
          appearance={{ ...defaultAppearance, lineageId: lineageId || null }} />
      </aside>
      <GamePanel className="sa-creator__decisions">

        {errorSection && stageIndexFor(errorSection) !== stageIndex && blockerFor(stageIndexFor(errorSection)) < 0 &&
          <GameButton onClick={() => openStage(stageIndexFor(errorSection))}>Go to {errorSection}</GameButton>}
        {reconciliation && step !== "Review" && <p className="sa-reconciliation" role="status">{reconciliation}</p>}
        {content}
        <footer className="sa-actions">
          {step !== 'Training' && <CommandError message={error} />}
          <GameButton disabled={busy || stageIndex === 0}
            onClick={() => step === 'Training' ? goTo('Attributes') : openStage(stageIndex - 1)}>Back</GameButton>
          {step === 'Review'
            ? <GameButton data-create disabled={busy || !summary?.decisionsComplete || identity.name.trim().length < 2} onClick={save}>Save character</GameButton>
            : <GameButton disabled={busy} onClick={continueDraft}>{busy ? 'Checking choices…' : step !== 'Training' && displayedChoice ? 'Apply ' + choiceTitle(displayedChoice.key).toLowerCase() : 'Continue'}</GameButton>}
        </footer>
      </GamePanel>
    </div>
  </main>;
}
