import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';

interface AccessCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  onComplete?: (code: string) => void;
}

export function AccessCodeInput({
  value,
  onChange,
  length = 6,
  onComplete,
}: AccessCodeInputProps) {
  const handleChange = (newValue: string) => {
    const upperValue = newValue.toUpperCase();
    onChange(upperValue);

    if (upperValue.length === length && onComplete) {
      onComplete(upperValue);
    }
  };

  // Разбиваем на две группы по 4 символа
  const halfLength = Math.floor(length / 2);

  return (
    <div className="flex flex-col items-center gap-4">
      <InputOTP
        maxLength={length}
        value={value}
        onChange={handleChange}
        className="gap-2"
      >
        <InputOTPGroup>
          {Array.from({ length: halfLength }).map((_, i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className="w-10 h-12 text-lg font-mono uppercase bg-secondary border-border"
            />
          ))}
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          {Array.from({ length: length - halfLength }).map((_, i) => (
            <InputOTPSlot
              key={i + halfLength}
              index={i + halfLength}
              className="w-10 h-12 text-lg font-mono uppercase bg-secondary border-border"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <p className="text-xs text-muted-foreground">
        Введите {length}-значный код приглашения
      </p>
    </div>
  );
}
