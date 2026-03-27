interface Option {
  value: string;
  label: string;
}

interface BaseFieldProps {
  label: string;
}

interface InputFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date" | "time" | "email";
  placeholder?: string;
}

interface SelectFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

interface TextAreaFieldProps extends BaseFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const baseClass = "mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm";

export function AdminInputField({ label, value, onChange, type = "text", placeholder }: InputFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        className={baseClass}
        placeholder={placeholder}
      />
    </div>
  );
}

export function AdminSelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={baseClass}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AdminTextAreaField({ label, value, onChange, placeholder, rows = 3 }: TextAreaFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={baseClass}
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  );
}
