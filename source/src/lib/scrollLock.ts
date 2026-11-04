/** Lock page scroll without losing the current position. */
export function lockScroll() {
  const sbw = window.innerWidth - document.documentElement.clientWidth
  document.body.style.overflow = 'hidden'
  if (sbw > 0) document.body.style.paddingRight = `${sbw}px`
  return () => {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
}
