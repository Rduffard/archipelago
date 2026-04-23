import AttributesSection from '../attributes/AttributesSection'
import CallingSection from '../calling/CallingSection'
import DetailsSection from '../details/DetailsSection'
import LoadoutSection from '../loadout/LoadoutSection'
import ProgressionSection from '../progression/ProgressionSection'
import ReviewSection from '../review/ReviewSection'
import RootsSection from '../roots/RootsSection'
import SkillsSection from '../skills/SkillsSection'

export const STEP_COMPONENTS = {
  identity: RootsSection,
  calling: CallingSection,
  attributes: AttributesSection,
  skills: SkillsSection,
  loadout: LoadoutSection,
  details: DetailsSection,
  progression: ProgressionSection,
  review: ReviewSection,
}
