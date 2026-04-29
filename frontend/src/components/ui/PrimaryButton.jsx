export default function PrimaryButton({ children, className = '', type = 'button', disabled, ...rest }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-full bg-rose px-7 py-3 font-sans text-sm tracking-wide text-ink shadow-[0_2px_10px_rgba(180,120,0,0.22),0_1px_3px_rgba(200,160,0,0.16)] transition-all duration-200 hover:bg-amber hover:-translate-y-px hover:shadow-[0_5px_20px_rgba(180,120,0,0.30),0_2px_6px_rgba(200,160,0,0.20)] active:scale-[0.97] active:translate-y-0 active:shadow-[0_1px_4px_rgba(180,120,0,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-parchment disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
