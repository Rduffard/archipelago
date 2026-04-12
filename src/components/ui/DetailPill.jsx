function DetailPill({ children, className = '', detail, tone = 'default' }) {
  const classes = [`choice-pill`, `choice-pill--${tone}`, detail ? 'has-detail' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes} tabIndex={detail ? 0 : undefined}>
      {children}
      {detail ? <span className="choice-pill__detail">{detail}</span> : null}
    </span>
  )
}

export default DetailPill
