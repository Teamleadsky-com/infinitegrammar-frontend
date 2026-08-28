import { useNavigate } from "react-router-dom";

const FOOTER_LINKS = [
  { href: "/", label: "Deutsche Grammatik üben" },
  { href: "/deutsche-grammatik/", label: "Grammatikreferenz" },
  { href: "/pruefungszentren/", label: "Prüfungszentren" },
  { href: "/articles/", label: "Artikel" },
];

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <nav
          aria-label="Footer"
          className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
        >
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-primary transition-colors underline"
              onClick={(e) => {
                e.preventDefault();
                navigate(link.href);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
        © 2026 Infinite Grammar. All rights reserved.
      </div>
    </footer>
  );
};
