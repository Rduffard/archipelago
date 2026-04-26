import './CreatorStepFrame.css'

function CreatorStepFrame({ children, className = '', description, step, title }) {
  return (
    <section className={['creator-panel', className].filter(Boolean).join(' ')}>
      <div className="creator-panel__header">
        <p className="creator-panel__kicker">{step}</p>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>

      {children}
    </section>
  )
}

export default CreatorStepFrame
