import { DashboardLayout } from "@/components/dashboard-layout";
interface DashboardLayoutPageProps {
    children: React.ReactNode;
}

const DashboardLayoutPage = ({ children }: DashboardLayoutPageProps) => {
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    )
}

export default DashboardLayoutPage;