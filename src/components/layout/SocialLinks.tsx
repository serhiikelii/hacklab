import Link from "next/link"

type SocialLinkItem = {
  name: string
  href: string
  icon: React.ReactNode
  ariaLabel: string
}

type SocialLinksProps = {
  variant?: "header" | "footer" | "mobile"
  className?: string
}

export function SocialLinks({ variant = "footer", className = "" }: SocialLinksProps) {
  const iconSize = variant === "mobile" ? "w-7 h-7" : "w-5 h-5"

  const socialLinks: SocialLinkItem[] = [
    {
      name: "Telegram",
      href: "https://t.me/serhiikelii",
      ariaLabel: "Visit our Telegram channel",
      icon: (
        <svg
          className={iconSize}
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/sergey_keliy?igsh=MW9ucGpwZzc2endsdA%3D%3D&utm_source=qr",
      ariaLabel: "Follow us on Instagram",
      icon: (
        <svg
          className={iconSize}
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/sergey.keliy",
      ariaLabel: "Like us on Facebook",
      icon: (
        <svg
          className={iconSize}
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ]

  const baseStyles = "flex items-center gap-4"
  const linkStyles =
    variant === "header"
      ? "text-white hover:text-gray-300 transition-colors duration-200"
      : variant === "mobile"
      ? "text-gray-700 transition-opacity duration-200 hover:opacity-70"
      : "text-gray-400 hover:text-white transition-colors duration-200"

  return (
    <div className={`${baseStyles} ${className}`}>
      {socialLinks.map((social) => (
        <Link
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkStyles}
          aria-label={social.ariaLabel}
        >
          {social.icon}
        </Link>
      ))}
    </div>
  )
}
