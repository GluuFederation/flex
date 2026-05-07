import React from 'react'
import classNames from 'classnames'
import MuiButton from '@mui/material/Button'
import MuiAlert from '@mui/material/Alert'
import type {
  AlertProps,
  BadgeProps,
  ButtonProps,
  CardBodyProps,
  CardTitleProps,
  ColProps,
  ContainerProps,
  FormGroupProps,
  FormProps,
  InputGroupProps,
  InputProps,
  LabelProps,
  RowProps,
} from './types'

export const Col: React.FC<ColProps> = ({ sm, md, lg, xl, xs, className, children, ...props }) => {
  const colClass = classNames(
    xs != null && `col-xs-${xs}`,
    sm != null && `col-sm-${sm}`,
    md != null && `col-md-${md}`,
    lg != null && `col-lg-${lg}`,
    xl != null && `col-xl-${xl}`,
    xs == null && sm == null && md == null && lg == null && xl == null && 'col',
    className,
  )
  return (
    <div className={colClass} {...props}>
      {children}
    </div>
  )
}

export const Row: React.FC<RowProps> = ({ className, children, ...props }) => (
  <div className={classNames('row', className)} {...props}>
    {children}
  </div>
)

export const Container: React.FC<ContainerProps> = ({ className, children, ...props }) => (
  <div className={classNames('container', className)} {...props}>
    {children}
  </div>
)

export const FormGroup: React.FC<FormGroupProps> = ({ row, className, children, ...props }) => (
  <div className={classNames('form-group', row && 'row', className)} {...props}>
    {children}
  </div>
)

export const Form: React.FC<FormProps> = ({ className, children, ...props }) => (
  <form className={className} {...props}>
    {children}
  </form>
)

export const Label: React.FC<LabelProps> = ({
  for: htmlForProp,
  sm,
  className,
  children,
  ...props
}) => (
  <label
    htmlFor={htmlForProp}
    className={classNames(sm != null && `col-sm-${sm}`, 'col-form-label', className)}
    {...props}
  >
    {children}
  </label>
)

export const InputGroup: React.FC<InputGroupProps> = ({ className, children, ...props }) => (
  <div className={classNames('input-group', className)} {...props}>
    {children}
  </div>
)

export const CardBody: React.FC<CardBodyProps> = ({ className, children, ...props }) => (
  <div className={classNames('card-body', className)} {...props}>
    {children}
  </div>
)

export const CardTitle: React.FC<CardTitleProps> = ({
  tag: Tag = 'h5',
  className,
  children,
  ...props
}) => {
  const TagComponent = Tag as React.ElementType
  return (
    <TagComponent className={classNames('card-title', className)} {...props}>
      {children}
    </TagComponent>
  )
}

export const Badge: React.FC<BadgeProps> = ({ pill, color, className, children, ...props }) => (
  <span
    className={classNames('badge', color && `badge-${color}`, pill && 'badge-pill', className)}
    {...props}
  >
    {children}
  </span>
)

export const Alert: React.FC<AlertProps> = ({
  color,
  fade: _fade,
  transition: _transition,
  isOpen: _isOpen,
  toggle: _toggle,
  className,
  children,
  ...props
}) => {
  const severity =
    color === 'danger'
      ? 'error'
      : color === 'warning'
        ? 'warning'
        : color === 'success'
          ? 'success'
          : 'info'
  return (
    <MuiAlert severity={severity} className={className} {...props}>
      {children}
    </MuiAlert>
  )
}

export const Input = React.forwardRef<HTMLInputElement | HTMLSelectElement, InputProps>(
  ({ type = 'text', className, children, ...props }, ref) => {
    if (type === 'select') {
      return (
        <select
          ref={ref as React.Ref<HTMLSelectElement>}
          className={classNames('form-control', className)}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {children}
        </select>
      )
    }

    return (
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        type={type}
        className={classNames('form-control', className)}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    )
  },
)
Input.displayName = 'Input'

const bootstrapColorToMui = (
  color?: string,
): 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  if (!color) return 'primary'
  if (color === 'danger') return 'error'
  if (color === 'success') return 'success'
  if (color === 'warning') return 'warning'
  if (color === 'info') return 'info'
  if (color === 'secondary') return 'secondary'
  return 'primary'
}

export const Button: React.FC<ButtonProps> = ({
  color,
  size,
  variant: _variant,
  className,
  children,
  ...props
}) => {
  const muiColor = bootstrapColorToMui(color)
  const muiSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'medium'
  return (
    <MuiButton variant="contained" color={muiColor} size={muiSize} className={className} {...props}>
      {children}
    </MuiButton>
  )
}
