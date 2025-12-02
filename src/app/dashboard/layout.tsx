import FilterNav from "@/components/filter-nav";
import SideBar from "@/components/sidebar";

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen">
            <div className="flex-1 flex flex-col lg:ml-64">
                <FilterNav />
                <SideBar />
                <main className="flex-1 p-4">{children}</main>
            </div>
        </div>
    );
}