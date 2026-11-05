import AttributesStep from '../../../../components/creator/AttributesStep/AttributesStep'

export default function AttributesSection(props) {
  if (props.locked) return <section className="review-card"><h2>Attributes</h2><p>Use Advancement on the character sheet to spend milestones. Base allocation changes require an explicit respec.</p><ul>{Object.entries(props.finalAttributes).map(([key, value]) => <li key={key}>{key}: {value}</li>)}</ul></section>
  return <AttributesStep {...props} />
}
