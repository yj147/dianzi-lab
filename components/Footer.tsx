export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="about" className="border-t-4 border-brand-accent bg-brand-dark py-12 text-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-surface font-heading font-bold text-brand-dark">
              L
            </div>
            <span className="font-heading text-xl font-bold">Bambi Lab Idea</span>
          </div>
          <p className="text-sm font-mono text-muted-foreground">
            © {year} Bambi Lab Idea. Built for builders.
          </p>
        </div>
      </div>
    </footer>
  )
}
