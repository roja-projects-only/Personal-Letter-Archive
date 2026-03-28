/**
 * Aged-paper styled card wrapper.
 * ribbon: boolean — adds a gold left-border stripe
 * corners: boolean — renders CornerOrnament at all four corners
 * className: extra Tailwind classes
 */
import CornerOrnament from './CornerOrnament'

export default function PaperCard({
  children,
  ribbon = false,
  corners = false,
  className = '',
  style,
}) {
  return (
    <div
      className={`paper-card paper-texture relative${ribbon ? ' paper-card-ribbon' : ''} ${className}`}
      style={style}
    >
      {corners && (
        <>
          <CornerOrnament position="tl" />
          <CornerOrnament position="tr" />
          <CornerOrnament position="bl" />
          <CornerOrnament position="br" />
        </>
      )}
      {children}
    </div>
  )
}
