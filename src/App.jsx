import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/login'
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SuperDashboard from './pages/SuperAdminDashboard/Layout/SuperDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard/SuperAdminDashboard';
import UserManagement from './pages/SuperAdminDashboard/UserManagement'
import { Toaster } from 'react-hot-toast'
import BillingSubscription from './pages/SuperAdminDashboard/BillingSubscription'
import LogsTroubleshooting from './pages/SuperAdminDashboard/LogsTroubleshooting'
import SuperAdminSetting from './pages/SuperAdminDashboard/SuperAdmingSetting'
import BrainManagement from './pages/SuperAdminDashboard/BrainManagement'
import BrainManagementSub from './pages/SuperAdminDashboard/BrainManagementSub'
import AgentMonitoring from './pages/SuperAdminDashboard/AgentMonitoring'
import AgentMonitoringSub from './pages/SuperAdminDashboard/AgentMonitoringSub'






  function App() {

  return (
    <div className='h-screen inter'>
      <Toaster />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<SuperDashboard/>}>
          <Route path='' element={<SuperAdminDashboard />} />
          <Route path="user-management" element={<UserManagement/>}/>
          <Route path="agent-monitoring" element={<AgentMonitoring/>}/>
          <Route path="brain-management" element={<BrainManagement/>}/>
          <Route path="brain-management-sub" element={<BrainManagementSub/>}/>
          <Route path="agent-monitoring-sub" element={<AgentMonitoringSub/>}/>
          <Route path="billing-subscription" element={<BillingSubscription/>}/>
          <Route path="logs-troubleshooting" element={<LogsTroubleshooting/>}/>
          <Route path="settings" element={<SuperAdminSetting/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
