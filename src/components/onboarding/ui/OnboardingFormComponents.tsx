import React from 'react'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Badge } from '../../ui/badge'
import { X } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface OnboardingFormFieldProps {
  label: string
  error?: string
  required?: boolean
  optional?: boolean
  children: React.ReactNode
  className?: string
  extra?: React.ReactNode
}

export const OnboardingFormField: React.FC<OnboardingFormFieldProps> = ({
  label,
  error,
  required,
  optional,
  children,
  className,
  extra
}) => {
  const fieldId = React.useId()
  const errorId = error ? `${fieldId}-error` : undefined

  return (
    <div className={cn('space-y-0.5', className)}>
      <Label className="text-xs flex items-center justify-between">
        <span>
          {label} {required && <span aria-label="required">*</span>} 
          {optional && <span className="text-gray-500">(Optional)</span>}
        </span>
        {extra}
      </Label>
      <div>
        {children}
      </div>
      {error && (
        <p id={errorId} className="text-[#FF220E] text-[10px]" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  )
}

interface OnboardingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
  optional?: boolean
  icon?: React.ReactNode
}

export const OnboardingInput: React.FC<OnboardingInputProps> = ({
  label,
  error,
  required,
  optional,
  icon,
  className,
  id,
  ...props
}) => {
  const fieldId = id || React.useId()
  const errorId = error ? `${fieldId}-error` : undefined

  return (
    <OnboardingFormField label={label} error={error} required={required} optional={optional}>
      <div className="relative">
        {icon && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
        <Input
          {...props}
          id={fieldId}
          aria-describedby={errorId}
          aria-invalid={!!error}
          className={cn(
            'h-7 text-xs',
            icon && 'pl-7',
            error ? 'border-[#FF220E]' : 'border-[#C8D6FF]',
            className
          )}
        />
      </div>
    </OnboardingFormField>
  )
}

interface OnboardingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  required?: boolean
  optional?: boolean
  showCharCount?: boolean
  maxLength?: number
}

export const OnboardingTextarea: React.FC<OnboardingTextareaProps> = ({
  label,
  error,
  required,
  optional,
  showCharCount,
  maxLength,
  value,
  className,
  id,
  ...props
}) => {
  const fieldId = id || React.useId()
  const errorId = error ? `${fieldId}-error` : undefined

  return (
    <OnboardingFormField
      label={label}
      error={error}
      required={required}
      optional={optional}
      extra={showCharCount && maxLength && (
        <span className="text-gray-500 text-[10px]">
          {typeof value === 'string' ? value.length : 0}/{maxLength}
        </span>
      )}
    >
      <Textarea
        {...props}
        id={fieldId}
        value={value}
        aria-describedby={errorId}
        aria-invalid={!!error}
        className={cn(
          'h-16 text-xs resize-none',
          error ? 'border-[#FF220E]' : 'border-[#C8D6FF]',
          className
        )}
        maxLength={maxLength}
      />
    </OnboardingFormField>
  )
}

interface OnboardingSelectProps {
  label: string
  error?: string
  required?: boolean
  optional?: boolean
  placeholder: string
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  disabled?: boolean
  extra?: React.ReactNode
}

export const OnboardingSelect: React.FC<OnboardingSelectProps> = ({
  label,
  error,
  required,
  optional,
  placeholder,
  value,
  onValueChange,
  children,
  disabled,
  extra
}) => {
  const fieldId = React.useId()
  const errorId = error ? `${fieldId}-error` : undefined

  return (
    <OnboardingFormField 
      label={label} 
      error={error} 
      required={required} 
      optional={optional}
      extra={extra}
    >
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger 
          id={fieldId}
          aria-describedby={errorId}
          aria-invalid={!!error}
          className={cn(
            'h-7 text-xs',
            error ? 'border-[#FF220E]' : 'border-[#C8D6FF]'
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {children}
        </SelectContent>
      </Select>
    </OnboardingFormField>
  )
}

interface OnboardingMultiSelectProps {
  label: string
  error?: string
  required?: boolean
  optional?: boolean
  placeholder: string
  value: string[]
  onValueChange: (value: string[]) => void
  options: string[]
  maxSelections?: number
  onAddItem: (item: string) => void
  onRemoveItem: (item: string) => void
}

export const OnboardingMultiSelect: React.FC<OnboardingMultiSelectProps> = ({
  label,
  error,
  required,
  optional,
  placeholder,
  value,
  options,
  maxSelections,
  onAddItem,
  onRemoveItem
}) => {
  const fieldId = React.useId()
  const errorId = error ? `${fieldId}-error` : undefined

  return (
    <OnboardingFormField
      label={label}
      error={error}
      required={required}
      optional={optional}
      extra={maxSelections && (
        <span className="text-gray-500 text-[10px]">Max {maxSelections}</span>
      )}
    >
      <div>
        <Select
          onValueChange={onAddItem}
          disabled={maxSelections ? value.length >= maxSelections : false}
        >
          <SelectTrigger 
            id={fieldId}
            aria-describedby={errorId}
            aria-invalid={!!error}
            className={cn(
              'h-7 text-xs',
              error ? 'border-[#FF220E]' : 'border-[#C8D6FF]'
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map(option => (
              <SelectItem
                key={option}
                value={option}
                disabled={value.includes(option)}
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {value.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {value.map(item => (
              <Badge
                key={item}
                variant="secondary"
                className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF] text-[10px] px-1.5 py-0 h-5 gap-1"
              >
                {item}
                <button
                  type="button"
                  onClick={() => onRemoveItem(item)}
                  className="ml-0.5 hover:text-[#FF220E]"
                  aria-label={`Remove ${item}`}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </OnboardingFormField>
  )
}