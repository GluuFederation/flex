import type React from 'react'

export type ColProps = React.HTMLAttributes<HTMLDivElement> & {
  sm?: number
  md?: number
  lg?: number
  xl?: number
  xxl?: number
  xs?: number
}

export type RowProps = React.HTMLAttributes<HTMLDivElement>

export type ContainerProps = React.HTMLAttributes<HTMLDivElement>

export type FormGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  row?: boolean
}

export type FormProps = React.FormHTMLAttributes<HTMLFormElement>

export type LabelProps = Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'> & {
  for?: string
  sm?: number
}

export type InputGroupProps = React.HTMLAttributes<HTMLDivElement>

export type CardBodyProps = React.HTMLAttributes<HTMLDivElement>

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  pill?: boolean
  color?: string
}

export type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  color?: string
  fade?: boolean
  transition?: object
  isOpen?: boolean
  toggle?: () => void
}

type StandardInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children'> & {
  type?: Exclude<React.HTMLInputTypeAttribute, 'select' | 'textarea'>
  children?: React.ReactNode
}

type SelectInputProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  type: 'select'
  children?: React.ReactNode
}

type TextareaInputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  type: 'textarea'
  children?: React.ReactNode
}

export type InputProps = StandardInputProps | SelectInputProps | TextareaInputProps

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> & {
  color?: string
  size?: 'sm' | 'lg'
}
