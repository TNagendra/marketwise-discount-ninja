// Compatibility wrapper: re-export from button.jsx so imports like
// '@/components/ui/button' resolve in environments that don't pick up .jsx.
// Note: the actual file is `Button.jsx` (capital B). On case-sensitive
// filesystems (Netlify/Linux) importing `./button.jsx` fails even though
// it works on Windows. Export from the correct filename.
export { Button, buttonVariants } from "./Button.jsx";
