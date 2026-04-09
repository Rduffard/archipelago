import { Link } from 'react-router-dom'

function PageHeader({ eyebrow, title, description, backTo, backLabel = 'Back' }) {
  return (
    <>
      {backTo ? (
        <Link className="page-header__back" to={backTo}>
          ← {backLabel}
        </Link>
      ) : null}

      <section className="page-header">
        <p className="page-header__eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-header__description">{description}</p>
      </section>
    </>
  )
}

export default PageHeader
