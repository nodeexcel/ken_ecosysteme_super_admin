import { useState, useEffect } from 'react'
import SuperAdminSidebar from '../SuperAdminSidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../store/authSlice';
import { getCountryData } from '../../../store/countryCodeSlice';
import CountryList from 'country-list-with-dial-code-and-flag'
import { getDashboardDetails } from '../../../api/dashboard';


function SuperDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const token = localStorage.getItem("token")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {

        if (token) {
            fetchDashboardData()
            getCountryCode()
            dispatch(loginSuccess({ token: token }))
        }else{
           // navigate("/")
        }
    }, [token])


    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isSidebarOpen]);

    const SidebarItems = [
        { id: "", label: "Home" },
        { id: "brain-management", label: "Brain AI" },
        { id: "agent-monitoring", label: "Agent Monitoring" },
        { id: "user-management", label: "User Management" },
        { id: "billing-subscription", label: "Billing & Subscriptions" },
        { id: "logs-troubleshooting", label: "Logs & Troubleshooting" },
        { id: "settings", label: "Settings" },
        { id: "help_center", label: "Help center" },
        { id: "support", label: "Support" }
    ]


    const getCountryCode = async () => {
        try {
            const response = CountryList.getAll()
            if (response?.length > 0) {
                const data = response?.map((e) => ({
                    name: e.data.name,
                    code: e.data.code,
                    dial_code: e.data.dial_code,
                    flag: `${(e.data.code).toLowerCase()}`
                }))
                dispatch(getCountryData(data))
            }

        } catch (error) {
            console.log(error)
        }
    }



    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const fetchDashboardData = async () => {
        try {
            const response = await getDashboardDetails();
            if (response?.status === 200) {
                console.log(response)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='w-full flex relative h-full'>
            {!isSidebarOpen && <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-[250px]' : 'w-[0%]'} lg:w-[72px] h-screen relative z-50`}>
                <SuperAdminSidebar sidebarItems={SidebarItems} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>}
            <div className='lg:w-[calc(100%-72px)] w-full h-full' >
                <Outlet />
            </div>
            {isSidebarOpen &&
                <div className="fixed inset-0 bg-black/20 flex flex-col z-50">
                    <div className={`transition-all w-[250px] h-screen relative z-50`}>
                        <SuperAdminSidebar sidebarItems={SidebarItems} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                    </div>
                </div>
            }
        </div>
    )
}

export default SuperDashboard
