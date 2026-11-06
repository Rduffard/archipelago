import AbilitiesStep from "../../../../components/creator/AbilitiesStep/AbilitiesStep";
import AttributesSection from "../attributes/AttributesSection";
import CallingSection from "../calling/CallingSection";
import DetailsSection from "../details/DetailsSection";
import LoadoutSection from "../loadout/LoadoutSection";
import ReviewSection from "../review/ReviewSection";
import RootsSection from "../roots/RootsSection";
import SkillsSection from "../skills/SkillsSection";

export const STEP_COMPONENTS = {
  abilities: AbilitiesStep,
  identity: RootsSection,
  calling: CallingSection,
  attributes: AttributesSection,
  skills: SkillsSection,
  loadout: LoadoutSection,
  details: DetailsSection,
  review: ReviewSection,
};
