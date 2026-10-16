import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-mist bg-ice">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 py-12 text-sm text-slate sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-xl text-navy">BGM Exports</p>
          <p className="mt-1">Certified diamonds, responsibly sourced.</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li><Link href="/collection" className="hover:text-royal">Collection</Link></li>
          <li><Link href="/about" className="hover:text-royal">About</Link></li>
          <li><Link href="/contact" className="hover:text-royal">Contact</Link></li>
        </ul>
        <p>© BGM Exports</p>
      </div>
    </footer>
  );
}
