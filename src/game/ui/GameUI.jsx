import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export function GamePanel({ title, children, className = '' }) {
  return <section className={`sa-panel ${className}`}>
    {title && <h2>{title}</h2>}
    {children}
  </section>;
}

export function GameButton({ to, children, ...props }) {
  return to
    ? <Link className="sa-button" to={to} {...props}>{children}</Link>
    : <button className="sa-button" type="button" {...props}>{children}</button>;
}

export function GameMenu({ label, children }) {
  return <details className="sa-menu"><summary>{label}</summary><div>{children}</div></details>;
}

export function GameStatus({ error = false, children }) {
  return <p className={error ? 'sa-status sa-status--error' : 'sa-status'} role={error ? 'alert' : 'status'}>{children}</p>;
}

export function SelectionCard({ name, value, selected, onChange, title, description }) {
  return <label className="sa-card">
    <input type="radio" name={name} value={value} checked={selected} onChange={onChange} />
    <span><strong>{title}</strong>{description && <small>{description}</small>}</span>
  </label>;
}

export function Tooltip({ id, children, text }) {
  return <span className="sa-tooltip">
    <button type="button" aria-describedby={id}>{children}</button>
    <span role="tooltip" id={id}>{text}</span>
  </span>;
}

export function SectionTabs({ sections, active, onSelect, label }) {
  return <nav aria-label={label} className="sa-tabs">
    {sections.map(section => <GameButton key={section} aria-pressed={section === active}
      onClick={() => onSelect(section)}>{section}</GameButton>)}
  </nav>;
}

export function GameDialog({ title, children, onDismiss, onConfirm }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return <dialog className="sa-panel sa-dialog" ref={ref} aria-label={title}
    onCancel={event => { event.preventDefault(); onDismiss(); }}>
    <h2>{title}</h2>
    {children}
    <div className="sa-actions">
      <GameButton onClick={onDismiss} autoFocus>Cancel</GameButton>
      {onConfirm && <GameButton onClick={onConfirm}>Confirm</GameButton>}
    </div>
  </dialog>;
}

export function ResourceBar({ label, current, maximum }) {
  return <div className="sa-resource">
    <label><span>{label}</span><span>{current} / {maximum}</span>
      {maximum > 0 && <meter value={Math.max(0, Math.min(current, maximum))} min={0} max={maximum} />}
    </label>
  </div>;
}
