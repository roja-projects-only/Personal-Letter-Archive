export default function PrimaryButton({ children, className = '', type = 'button', disabled, ...rest }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-full bg-rose px-7 py-3 font-sans text-sm tracking-wide text-ink shadow-sm transition-all duration-200 hover:bg-amber hover:shadow-md active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
