import HoverInfo from './HoverInfo/HoverInfo'

function DetailPill({ children, className = '', detail, tone = 'default' }) {
  const classes = [`choice-pill`, `choice-pill--${tone}`, detail ? 'has-detail' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <HoverInfo className={classes} content={detail} contentClassName="choice-pill__detail">
      {children}
    </HoverInfo>
  )
}

export default DetailPill
