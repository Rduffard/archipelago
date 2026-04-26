import { CallingStep } from '../../../../components/creator/IdentityStep/IdentityStep'

function CallingSection({ identity, onIdentityChange }) {
  return <CallingStep identity={identity} onIdentityChange={onIdentityChange} />
}

export default CallingSection
