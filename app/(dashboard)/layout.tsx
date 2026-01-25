export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-background text-foreground">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 size-[50vw] rounded-full bg-lavender-200/30 blur-[100px] mix-blend-multiply animate-blob" />
        <div className="absolute top-0 -right-20 size-[40vw] rounded-full bg-mint-200/30 blur-[100px] mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-20 size-[45vw] rounded-full bg-coral-200/30 blur-[100px] mix-blend-multiply animate-blob animation-delay-4000" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
