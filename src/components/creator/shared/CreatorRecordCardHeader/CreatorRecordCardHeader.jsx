function CreatorRecordCardHeader({ meta, onRemove, title }) {
  return (
    <div className="choice-group__header choice-group__header--split">
      <div>
        <h3>{title}</h3>
        {meta ? <p>{meta}</p> : null}
      </div>
      <button
        type="button"
        className="creator-inline-back"
        onClick={onRemove}
      >
        Remove
      </button>
    </div>
  )
}

export default CreatorRecordCardHeader
