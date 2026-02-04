import Link from "next/link";

export const LandingFooter = () => {
  return (
    <footer className="border-t border-zinc-900 bg-[#09090b] px-8 py-32 relative overflow-hidden">
      {/* Structural Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-zinc-900" />
      <div className="absolute top-0 left-1/4 w-px h-full bg-zinc-900/50" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-zinc-900/50" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-2 space-y-10">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="size-10 bg-amber-500 flex items-center justify-center transition-all group-hover:bg-amber-400">
                <span className="mono text-[#09090b] font-black text-xl">Z</span>
              </div>
              <h2 className="text-2xl font-black tracking-tighter text-zinc-100 uppercase">ZAVN</h2>
            </Link>
            <p className="mono text-xs text-zinc-600 max-w-sm font-bold uppercase tracking-widest leading-relaxed">
              Industrial-grade behavior alignment. Bridge the gap between intention and action through high-stakes verification.
            </p>
            <div className="mono text-[9px] text-zinc-800 uppercase tracking-[0.5em] font-black pt-4">
              [SYSTEM_VERSION: 1.0.4-PROD] // [GATEWAY: OBSIDIAN]
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="mono text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Protocols</h3>
            <nav className="flex flex-col gap-4">
              {["Echo", "Vault", "Tribe", "Thrive"].map(item => (
                <Link key={item} href={`#${item.toLowerCase()}`} className="mono text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 hover:text-amber-500 transition-colors w-fit">
                  {item}_PROTOCOL
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-6">
            <h3 className="mono text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Terminal</h3>
            <nav className="flex flex-col gap-4">
              {["Authenticate", "Initialize", "Directives", "Privacy"].map(item => (
                <Link key={item} href={`/${item.toLowerCase()}`} className="mono text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600 hover:text-amber-500 transition-colors w-fit">
                  {item}_ACTION
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-32 pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="mono text-[10px] text-zinc-700 uppercase tracking-[0.4em] font-black">
              © {new Date().getFullYear()} ZAVN_NETWORK_SYSTEMS.
            </p>
            <div className="hidden h-4 w-px bg-zinc-900 md:block" />
            <div className="flex gap-10">
              <Link href="/status" className="mono text-[10px] text-zinc-700 hover:text-amber-500 uppercase tracking-[0.3em] font-black flex items-center gap-2">
                <div className="size-1 bg-amber-500 rounded-full animate-pulse" />
                Network_Status: OK
              </Link>
            </div>
          </div>
          <div className="mono text-[10px] text-zinc-800 font-black uppercase tracking-[0.4em]">
            Obsidian_Gateway // Global_Edge
          </div>
        </div>
      </div>
    </footer>
  );
};
