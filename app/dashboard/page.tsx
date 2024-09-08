import DashboardApp from "@/components/dashboard-app";



const Dashboard = async() => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return ( 
        <DashboardApp />
     );
}
 
export default Dashboard;