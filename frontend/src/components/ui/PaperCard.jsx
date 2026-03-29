/**
 * Aged-paper styled card wrapper.
 *
 * Props:
 *   ribbon  — boolean: adds a gold left-border stripe
 *   corners — boolean: renders CornerOrnament (MD size) at all four corners
 *   className — layout, padding, and any extra overrides
 *   style — inline style passthrough
 *
 * Padding scale (pass via className):
 *   compact     p-4          stat tiles, reply bubbles
 *   comfortable p-5 sm:p-7  editor body, preview body
 *   hero        p-6 sm:p-8  main letter display, empty states
 */
import CornerOrnament from './CornerOrnament'

const ORNAMENT_MD = 24

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
          <CornerOrnament position="tl" size={ORNAMENT_MD} />
          <CornerOrnament position="tr" size={ORNAMENT_MD} />
          <CornerOrnament position="bl" size={ORNAMENT_MD} />
          <CornerOrnament position="br" size={ORNAMENT_MD} />
        </>
      )}
      {children}
    </div>
  )
}
