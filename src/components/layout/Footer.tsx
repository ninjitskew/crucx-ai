"use client";

import { SITE, FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { TwitterIcon, LinkedInIcon, InstagramIcon, YouTubeIcon } from "@/components/ui/Icons";
import Logo from "@/components/ui/Logo";

const socialIcons: Record<string, React.FC<{ className?: string }>> = {
  twitter: TwitterIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
};

const linkSections = [
  { title: "Product", links: FOOTER_LINKS.product },
  { title: "Company", links: FOOTER_LINKS.company },
  { title: "Support", links: FOOTER_LINKS.support },
  { title: "Legal", links: FOOTER_LINKS.legal },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-default bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-6">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Logo size={36} />
              <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-text-primary">
                crucx<span className="text-accent-blue">.ai</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              {SITE.description.slice(0, 120)}...
            </p>
            {/* Social links */}
            <div className="mt-6 flex gap-4">
              {SOCIAL_LINKS.map((link) => {
                const Icon = socialIcons[link.icon];
                return (
                  <a
                    key={link.icon}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted transition-colors hover:text-accent-blue"
                    aria-label={link.label}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {linkSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-primary">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border-default pt-8 text-center">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} crucx.ai — All rights reserved. Headquartered in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
