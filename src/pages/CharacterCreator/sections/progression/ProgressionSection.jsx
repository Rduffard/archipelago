function ProgressionSection({
  specializations,
}) {
    return (
      <section className="choice-group">
        <h2>Paths</h2>
        <p>Use Advancement on the character sheet to record levels, improve attributes, and retain rewards. Calling and Path selections await reviewed ability content. Existing Path ownership is preserved; the original nodes below are historical references.</p>
        {specializations.map((path) => (
          <details key={path.id} className="review-card">
            <summary>{path.name} — Locked</summary>
            <p>{path.description ?? path.summary}</p>
            {path.prerequisites ? <p>Prerequisites: {JSON.stringify(path.prerequisites)}</p> : null}
            {(path.tiers ?? path.nodes ?? []).map((node) => (
              <article key={node.id ?? node.name}>
                <h3>{node.name}</h3>
                <p>{node.description ?? node.summary}</p>
                <p>{node.effect}</p>
                {node.rankRequired !== undefined ? <p>Recorded prerequisite: rank {node.rankRequired}</p> : null}
                {node.cost !== undefined ? <p>Recorded cost: {node.cost}</p> : null}
              </article>
            ))}
          </details>
        ))}
      </section>
    )
}

export default ProgressionSection
