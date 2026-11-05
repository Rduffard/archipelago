import { CallingStep } from '../../../../components/creator/IdentityStep/IdentityStep'

function CallingSection({ identity, onIdentityChange, locked }) {
  return <>{locked ? <p>Calling changes require an explicit respec.</p> : null}<fieldset disabled={locked}><CallingStep identity={identity} onIdentityChange={onIdentityChange} /></fieldset></>
}

export default CallingSection
