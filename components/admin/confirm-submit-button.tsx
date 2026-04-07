"use client";

type ConfirmSubmitButtonProps = {
  className: string;
  confirmMessage: string;
  label: string;
};

export function ConfirmSubmitButton({
  className,
  confirmMessage,
  label,
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {label}
    </button>
  );
}
