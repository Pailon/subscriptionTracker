import { useState, useRef } from 'react';

type NumericInputProps = {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  label?: string;
};

export function NumericInput({
  value,
  onChange,
  placeholder,
  className,
  required,
  label,
}: NumericInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDone = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
    setIsFocused(false);
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium mb-1 text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        required={required}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
        className={className}
        placeholder={placeholder}
      />
      {isFocused && (
        <button
          type="button"
          onClick={handleDone}
          className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white py-3 font-medium text-center z-50 shadow-lg"
          style={{ 
            animation: 'slideUpKeyboard 0.3s ease-out',
          }}
        >
          Готово
        </button>
      )}
    </div>
  );
}

