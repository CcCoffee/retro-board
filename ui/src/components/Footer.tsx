import { format } from "date-fns"

export function Footer() {
  return (
    <footer className="py-2 text-center text-xs text-gray-500">
      <p>&copy; {format(new Date(), "yyyy")} Retro Board. All rights reserved.</p>
    </footer>
  )
}