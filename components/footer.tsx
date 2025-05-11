import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">ProToolsHub</h3>
            <p className="text-sm text-muted-foreground">
              A collection of free online tools to help with everyday tasks.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Popular Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tools/qr-code-generator" className="text-sm text-muted-foreground hover:underline">
                  QR Code Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/word-counter" className="text-sm text-muted-foreground hover:underline">
                  Word Counter
                </Link>
              </li>
              <li>
                <Link href="/tools/base64" className="text-sm text-muted-foreground hover:underline">
                  Base64 Encoder/Decoder
                </Link>
              </li>
              <li>
                <Link href="/tools/age-calculator" className="text-sm text-muted-foreground hover:underline">
                  Age Calculator
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ProToolsHub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
