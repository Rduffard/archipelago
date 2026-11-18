import { useEffect, useId, useState } from 'react';

export function RuleDetails({ title, children, tooltip = false }) {
  if (!children) return title;
  if (tooltip) return <RuleTooltip title={title}>{children}</RuleTooltip>;
  return <details className="sa-rule-details">
    <summary>{title}</summary>
    <div className="sa-rule-details__body">{children}</div>
  </details>;
}

function RuleTooltip({ title, children }) {
  const id = useId();
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const open = pinned || hovered || focused;
  useEffect(() => {
    if (!open) return;
    function dismiss(event) {
      if (event.key !== 'Escape') return;
      setPinned(false);
      setHovered(false);
      setFocused(false);
    }
    window.addEventListener('keydown', dismiss);
    return () => window.removeEventListener('keydown', dismiss);
  }, [open]);
  return <span className="sa-rule-tooltip"
    onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }}
    onPointerLeave={() => setHovered(false)}>
    <button type="button" aria-expanded={open} aria-controls={id} aria-describedby={open ? id : undefined}
      onFocus={event => setFocused(event.currentTarget.matches(':focus-visible'))}
      onBlur={() => { setFocused(false); setPinned(false); }}
      onClick={() => { if (pinned) { setHovered(false); setFocused(false); } setPinned(!pinned); }}>
      {title}
    </button>
    <span id={id} className="sa-rule-tooltip__text" hidden={!open}>{children}</span>
  </span>;
}

