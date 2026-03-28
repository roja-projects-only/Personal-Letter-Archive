export default function PrimaryButton({ children, className = '', type = 'button', disabled, ...rest }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`rounded-full bg-rose py-2.5 px-7 font-sans text-sm text-white transition-colors hover:bg-rose-deep disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
