import './CreatorForm.css'

function CreatorField({ children, className = '' }) {
  return <div className={['creator-field', className].filter(Boolean).join(' ')}>{children}</div>
}

function CreatorLabel({ children, htmlFor }) {
  return <label htmlFor={htmlFor}>{children}</label>
}

function CreatorInput({ id, ...props }) {
  return <input id={id} {...props} />
}

function CreatorSelect({ children, id, ...props }) {
  return (
    <select id={id} {...props}>
      {children}
    </select>
  )
}

function CreatorTextarea({ id, ...props }) {
  return <textarea id={id} {...props} />
}

function CreatorSectionHeader({ action, description, title }) {
  return (
    <div className={`choice-group__header ${action ? 'choice-group__header--split' : ''}`}>
      <div>
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export {
  CreatorField,
  CreatorInput,
  CreatorLabel,
  CreatorSectionHeader,
  CreatorSelect,
  CreatorTextarea,
}
