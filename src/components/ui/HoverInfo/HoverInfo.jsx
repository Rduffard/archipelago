import { createElement, useId, useState } from 'react'
import './HoverInfo.css'

function HoverInfo({
  as: Component = 'span',
  children,
  className = '',
  content,
  contentClassName = '',
  placement = 'bottom-start',
  preserveLineBreaks = true,
  renderContent,
  tabIndex,
}) {
  const generatedId = useId()
  const hasContent = Boolean(content || renderContent)
  const [isActive, setIsActive] = useState(false)
  const tooltipId = hasContent ? `hover-info-${generatedId}` : undefined
  const classes = [
    'hover-info',
    `hover-info--${placement}`,
    hasContent ? 'has-detail' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  const contentClasses = [
    'hover-info__content',
    preserveLineBreaks ? 'hover-info__content--pre-line' : '',
    contentClassName,
  ]
    .filter(Boolean)
    .join(' ')

  const resolvedContent = isActive ? (renderContent ? renderContent() : content) : null
  const tooltip = resolvedContent
    ? createElement(
        'span',
        {
          id: tooltipId,
          className: contentClasses,
          role: 'tooltip',
        },
        resolvedContent,
      )
    : null

  return createElement(
    Component,
    {
      className: classes,
      tabIndex: hasContent ? (tabIndex ?? 0) : tabIndex,
      'aria-describedby': tooltipId,
      onBlur: () => setIsActive(false),
      onFocus: () => setIsActive(true),
      onMouseEnter: () => setIsActive(true),
      onMouseLeave: () => setIsActive(false),
    },
    children,
    tooltip,
  )
}

export default HoverInfo
