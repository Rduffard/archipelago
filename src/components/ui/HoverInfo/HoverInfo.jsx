import { createElement, useId } from 'react'
import './HoverInfo.css'

function HoverInfo({
  as: Component = 'span',
  children,
  className = '',
  content,
  contentClassName = '',
  placement = 'bottom-start',
  preserveLineBreaks = true,
  tabIndex,
}) {
  const generatedId = useId()
  const tooltipId = content ? `hover-info-${generatedId}` : undefined
  const classes = [
    'hover-info',
    `hover-info--${placement}`,
    content ? 'has-detail' : '',
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

  const tooltip = content
    ? createElement(
        'span',
        {
          id: tooltipId,
          className: contentClasses,
          role: 'tooltip',
        },
        content,
      )
    : null

  return createElement(
    Component,
    {
      className: classes,
      tabIndex: content ? (tabIndex ?? 0) : tabIndex,
      'aria-describedby': tooltipId,
    },
    children,
    tooltip,
  )
}

export default HoverInfo
