import Link from 'next/link'

interface NavMenuItemProps {
    icon: React.ReactNode
    title: string
    desc: string
    href: string
}

const NavMenuItem = ({ icon, title, desc, href }: NavMenuItemProps) => (
    <Link
        href={href}
        className="flex items-start space-x-3 hover:bg-green-50 dark:hover:bg-green-900/20 p-2 rounded-lg transition-all"
    >
        <div className="shrink-0 p-2 bg-green-100 dark:bg-green-800/50 rounded-lg text-green-600 dark:text-green-300">
            {icon}
        </div>
        <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-100">{title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
        </div>
    </Link>
)

export default NavMenuItem
