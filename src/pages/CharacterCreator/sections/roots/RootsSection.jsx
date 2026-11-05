import { WorldPathStep } from '../../../../components/creator/IdentityStep/IdentityStep'

function RootsSection({ identity, onIdentityChange, locked }) {
  return <>{locked ? <p>Origin is fixed for this progression record. Name and pronouns remain editable.</p> : null}<WorldPathStep identity={identity} onIdentityChange={onIdentityChange} locked={locked} /></>
}

export default RootsSection
