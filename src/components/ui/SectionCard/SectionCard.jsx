import './SectionCard.css'

export function SectionCard({ children, className = '', ...props }) {
  return (
    <article className={['dashboard-card', 'section-card', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </article>
  )
}

export function SectionCardHeader({ title, description, children, className = '' }) {
  return (
    <div className={['dashboard-card__header', 'section-card__header', className].filter(Boolean).join(' ')}>
      {title || description ? (
        <div>
          {title ? <h2>{title}</h2> : null}
          {description ? <p>{description}</p> : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}

export function SectionCardEmpty({ children, className = '' }) {
  return <p className={['dashboard-card__empty', 'section-card__empty', className].filter(Boolean).join(' ')}>{children}</p>
}
