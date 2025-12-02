"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
    
const FilterNav = () => {
    const pathname = usePathname();

    const links = [
        { id:"1", href: "/dashboard/tasks/new", label: "New Task", count: 8},
        { id:"2", href: "/dashboard/tasks/scheduled", label: "Scheduled", count: 4},
        { id:"3", href: "/dashboard/tasks/inprogress", label: "In progress", count: 3},
        { id:"4", href: "/dashboard/tasks/completed", label: "completed", count:3},
    ]

  return (
    <div className="w-full p-4 border-y-2 border-slate-200">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center ml-6">
            {links.map((link) => (
                <li 
                    key={link.id}
                    className={`p-3 rounded-lg hover:bg-gray-200 transition-colors text-center 
                        ${pathname === link.href ? 
                            "bg-gray-800 text-white" 
                            : "hover:bg-gray-200 active:bg-gray-100"
                        }
                    `}>
                    <Link href={link.href} className="flex justify-center items-center">
                        <span className="font-medium mr-1">{link.label}</span>
                        <span className="bg-gray-300 px-2 rounded-lg text-gray-600">{link.count}</span>
                    </Link>
                </li>
            ))}
        </ul>
    </div>
  );
};

export default FilterNav;