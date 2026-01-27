export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="about" className="border-t-4 border-brand-accent bg-brand-dark py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-white font-heading font-bold text-brand-dark">
              L
            </div>
            <span className="font-heading text-xl font-bold">点子 Lab</span>
          </div>
          <p className="text-sm font-mono text-gray-400">
            © {year} Idea Lab. Built for builders.
          </p>
        </div>
      </div>
    </footer>
  )
}
