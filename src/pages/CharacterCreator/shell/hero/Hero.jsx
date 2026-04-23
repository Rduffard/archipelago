import './Hero.css'

function Hero({ copy, eyebrow = 'Sanguine Archipelago', title = 'Character Creator' }) {
  return (
    <section className="hero-banner">
      <p className="hero-banner__eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="hero-banner__copy">{copy}</p>
    </section>
  )
}

export default Hero
