import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { memo } from "react"

interface FormInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  error?: string
  required?: boolean
}

export const FormInput = memo(function FormInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  required
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && "*"}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
})
