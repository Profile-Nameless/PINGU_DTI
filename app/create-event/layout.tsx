import { Toaster } from "@/components/ui/toaster"

export default function CreateEventLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
      <Toaster />
    </div>
  )
} 