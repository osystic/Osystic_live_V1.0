// Shared ownership avoids unlocking the page during drawer → calendar handoff.
let owners = 0;
let previousOverflow = "";
export function lockPageScroll() {
  if (owners++ === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--owners === 0) document.body.style.overflow = previousOverflow;
  };
}
