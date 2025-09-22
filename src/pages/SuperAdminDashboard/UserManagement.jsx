"use client"

import { MoreVertical, X } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { SelectDropdown } from "../../components/Dropdown"
import {
  addCredits,
  createUserManagement,
  deleteUserManagement,
  getUserManagement,
  updateSubscription,
} from "../../api/dashboard"

// Sample user data - exact match to image
// const users = [
//   {
//     id: 1,
//     initials: "SN",
//     name: "Stephanie Nicol",
//     email: "eddie_lake@gmail.com",
//     businessName: "Nexora",
//     location: "199 Oakway Lane",
//     status: "Active",
//     isActive: true,
//   },
//   {
//     id: 2,
//     initials: "DC",
//     name: "Dennis Callis",
//     email: "paula611@gmail.com",
//     businessName: "BrightNest",
//     location: "2323 Dancing Dove Lane",
//     status: "Inactive",
//     isActive: false,
//   },
//   {
//     id: 3,
//     initials: "JR",
//     name: "Judith Rodriguez",
//     email: "k.r.mastrangelo@outlook.com",
//     businessName: "Skybridge Collective",
//     location: "4267 Cherry Tree Drive",
//     status: "Active",
//     isActive: true,
//   },
//   {
//     id: 4,
//     initials: "KS",
//     name: "Katie Sims",
//     email: "dennis416@gmail.com",
//     businessName: "Momentum Lane",
//     location: "1341 Poplar Street",
//     status: "Inactive",
//     isActive: false,
//   },
//   {
//     id: 5,
//     initials: "RR",
//     name: "Rhonda Rhodes",
//     email: "k.p.allen@aol.com",
//     businessName: "Loop & Line",
//     location: "184 Griffin Street",
//     status: "Active",
//     isActive: true,
//   },
//   {
//     id: 6,
//     initials: "EL",
//     name: "Eddie Lake",
//     email: "james_hall@gmail.com",
//     businessName: "Zenith Works",
//     location: "4387 Farland Avenue",
//     status: "Active",
//     isActive: true,
//   },
// ]

// Chevron Down Icon Component
const ChevronDownIcon = () => (
  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

// Search Icon Component
const SearchIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

// Edit Icon Component
const EditIcon = () => (
  <svg
    className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

// Delete Icon Component
const DeleteIcon = () => (
  <svg
    className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

export default function UserManagement() {
  const [formData, setFormData] = useState({
    email: "",
    // password: '',
    subscriptionType: "",
    subscriptionDurationType: "",
    role: "admin",
    subscriptionStatus: "active",
  })
  const [users, setUsers] = useState({})
  const [user, setUser] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [error, setError] = useState({})
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(false)
  const token = localStorage.getItem("token")
  const [addCreditsStatus, setAddCreditsStatus] = useState("")
  const [loadingCreditsStatus, setLoadingCreditsStatus] = useState(false)
  const [credits, setCredits] = useState(100)
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false)
  const [isDeletingUser, setIsDeletingUser] = useState(false)

  const statusDropdownRef = useRef(null)
  const [openMenuUserId, setOpenMenuUserId] = useState(null)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [selectedPlan, setSelectedPlan] = useState("pro")
  const [selectedDuration, setSelectedDuration] = useState("monthly")

  const fetchUsersMangement = useCallback(async () => {
    setIsDataLoading(true)
    try {
      const response = await getUserManagement()
      if (response?.data?.success?.length > 0) {
        const modifyedData = response?.data?.success?.map((item) => ({
          id: item.id,
          location: item.location || "",
          email: item.email,
          name: item.name || "",
          initials: item.name
            ? item.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            : "",
          status: item.subscriptionStatus || "Active",
          isActive: true,
          subscriptionType: item.subscriptionType[0],
          subscriptionDurationType: item.subscriptionDurationType[0],
          business_name: item.business_name || "",
        }))
        console.log(modifyedData)
        setUsers(modifyedData)
      }
      console.log(response?.data)
    } catch (error) {
      console.log(error)
      setError((prev) => ({ ...prev, dataFetch: "Failed to load users data" }))
    } finally {
      setIsDataLoading(false)
    }
  }, [])

  const handlePlanUpdate = async () => {
    setIsUpdatingPlan(true)
    setError((prev) => ({ ...prev, planUpdate: "" }))

    try {
      await fetchUpdateSubscriptionUserManagement(user.id, selectedPlan, selectedDuration)
      await fetchUsersMangement()
      setShowPlanModal(false)
    } catch (error) {
      setError((prev) => ({ ...prev, planUpdate: "Failed to update subscription plan" }))
    } finally {
      setIsUpdatingPlan(false)
    }
  }

  const handleDeleteConfirm = async () => {
    setIsDeletingUser(true)
    setError((prev) => ({ ...prev, deleteUser: "" }))

    try {
      await fetchDeleteUserManagement(user.id)
      await fetchUsersMangement()
      setShowDeleteModal(false)
    } catch (error) {
      setError((prev) => ({ ...prev, deleteUser: "Failed to delete user" }))
    } finally {
      setIsDeletingUser(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (token) fetchUsersMangement()
  }, [token, fetchUsersMangement])

  const fetchDeleteUserManagement = async (id) => {
    try {
      const response = await deleteUserManagement(id)
      console.log(response)
      return response
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const fetchUpdateSubscriptionUserManagement = async (id, plan, duration) => {
    const payload = {
      subscriptionType: plan,
      subscriptionDurationType: duration,
    }
    try {
      const response = await updateSubscription(id, payload)
      console.log(response)
      return response
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const toggleUserStatus = (userId) => {
    // setUserStates((prev) => ({
    //   ...prev,
    //   [userId]: !prev[userId],
    // }))
  }

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status)
    setIsStatusDropdownOpen(false)
  }

  const filteredUsers =
    users?.length > 0 &&
    users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.businessName.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by status
      if (statusFilter === "Active") {
        return matchesSearch && user.isActive
      } else if (statusFilter === "Inactive") {
        return matchesSearch && !user.isActive
      } else if (statusFilter === "Deleted") {
        // For demo purposes, we'll show users with specific names as "deleted"
        return matchesSearch && (user.name === "Deleted User" || user.status === "Deleted")
      } else if (statusFilter === "All") {
        // Show all users when "All" is selected
        return matchesSearch
      }

      return matchesSearch
    })

  const InputFields = [
    { label: "Email", placeholder: "Enter email", value: formData.email, name: "email" },
    // { label: "Password", placeholder: "Enter password", value: formData.password, name: "password" },
    { label: "Role", placeholder: "Enter role", value: formData.role, name: "role" },
    {
      label: "Subscription Type",
      placeholder: "Enter subscription type",
      value: formData.subscriptionType,
      name: "subscriptionType",
    },
    {
      label: "Subscription Status",
      placeholder: "Enter subscription status",
      value: formData.subscriptionStatus,
      name: "subscriptionStatus",
    },
    {
      label: "Subscription Duration Type",
      placeholder: "Enter subscription duration type",
      value: formData.subscriptionDurationType,
      name: "subscriptionDurationType",
    },
    {
      label: "Subscription Start Date",
      placeholder: "Enter subscription start date",
      value: formData.subscriptionStartDate,
      name: "subscriptionStartDate",
    },
    {
      label: "Subscription End Date",
      placeholder: "Enter subscription end date",
      value: formData.subscriptionEndDate,
      name: "subscriptionEndDate",
    },
    {
      label: "Subscription Updated At",
      placeholder: "Enter subscription updated at",
      value: formData.subscriptionUpdatedAt,
      name: "subscriptionUpdatedAt",
    },
  ]

  const subscriptionTypeOptions = [
    { key: "pro", label: "Standard" },
    { key: "team", label: "Pro" },
  ]

  const subscriptionDurationTypeOptions = [
    { key: "monthly", label: "Monthly" },
    { key: "yearly", label: "Yearly" },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError((prev) => ({ ...prev, [name]: "" }))
  }

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = "Email is required"
    if (!validateEmail(formData.email)) newErrors.email = "Email is invalid"
    // if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.subscriptionType) newErrors.subscriptionType = "Subscription Type is required"
    if (!formData.subscriptionDurationType)
      newErrors.subscriptionDurationType = "Subscription Duration Type is required"

    setError(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const subscriptionEndDate = () => {
    const today = new Date()
    const subscriptionStartDate = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0),
    ).toISOString()
    let subscriptionEndDate

    if (formData.subscriptionDurationType === "monthly") {
      const endDate = new Date(today)
      endDate.setUTCDate(today.getUTCDate() + 30)
      subscriptionEndDate = new Date(
        Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(), 0, 0, 0),
      ).toISOString()
    } else {
      const endDate = new Date(today)
      endDate.setUTCFullYear(today.getUTCFullYear() + 1)
      subscriptionEndDate = new Date(
        Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(), 0, 0, 0),
      ).toISOString()
    }

    const subscriptionUpdatedAt = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0),
    ).toISOString()

    return { subscriptionStartDate, subscriptionEndDate, subscriptionUpdatedAt }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setLoadingStatus(true)
    setError((prev) => ({ ...prev, createUser: "" }))

    const payload = {
      ...formData,
    }
    console.log(payload)
    try {
      const response = await createUserManagement(payload)
      if (response?.status === 201) {
        console.log(response)
        await fetchUsersMangement()
        handleReset()
      }
    } catch (error) {
      setError((prev) => ({ ...prev, createUser: "Failed to create user. Please try again." }))
      console.log(error)
    } finally {
      setLoadingStatus(false)
    }
  }

  const handleAddCredits = async () => {
    if (!credits) {
      setError((prev) => ({ ...prev, credits: "Please add credits" }))
      return
    }
    setLoadingCreditsStatus(true)
    setError((prev) => ({ ...prev, addCredits: "" }))

    const payload = { credits: Number(credits) }
    console.log(payload)
    try {
      const response = await addCredits(addCreditsStatus, payload)
      if (response?.status === 201) {
        console.log(response)
        await fetchUsersMangement()
        handleCreditsReset()
      }

      setShowModal(false);
    } catch (error) {
      setError((prev) => ({ ...prev, addCredits: "Failed to add credits. Please try again." }))
      console.log(error)
    } finally {
      setLoadingCreditsStatus(false)
    }
  }

  const handleReset = () => {
    setFormData({
      email: "",
      // password: '',
      subscriptionType: "",
      subscriptionDurationType: "",
    })
    setError({})
    setShowModal(false)
  }

  const handleCreditsReset = () => {
    setCredits(100)
    setError({})
    setShowModal(false)
    setAddCreditsStatus("")
  }

  return (
    <div className="w-full h-full overflow-auto">
      <div className="m-0">
        <h1 className="w-full mt-0.5 border-b border-[#E1E4EA] font-medium p-2 ml-0 m-0 font-Semibold text-[#1E1E1E] text-[26px] lg:pl-2 pl-12">
          User Management
        </h1>
      </div>
      <div className="w-full p-4 flex flex-col gap-4 overflow-visible">
        {/* Filters and Search */}
        <div className="flex items-center justify-between mb-6 relative overflow-visible">
          <div className="flex items-center space-x-4">
            {/* Plan Filter */}
            <div className="flex items-center border border-[#e1e4ea] rounded-md px-4 py-2 text-[#1E1E1E] cursor-pointer bg-white">
              <span className="text-sm">Plan</span>
              <ChevronDownIcon />
            </div>

            {/* Agent Usage Filter */}
            <div className="flex items-center border border-[#e1e4ea] rounded-md px-4 py-2 text-[#1E1E1E] cursor-pointer bg-white">
              <span className="text-sm">Agent Usage</span>
              <ChevronDownIcon />
            </div>

            {/* Onboarding Stage Filter */}
            <div className="flex items-center border border-[#e1e4ea] rounded-md px-4 py-2 text-[#1E1E1E] cursor-pointer bg-white">
              <span className="text-sm">Onboarding Stage</span>
              <ChevronDownIcon />
            </div>
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-[#e1e4ea] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64 bg-white"
                />
              </div>
            </div>
          </div>

          {/* User Avatar and Status */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setShowModal(true)
              }}
              className="bg-[#675FFF] hover:bg-[#5A4FE5] text-white rounded-lg text-[16px] cursor-pointer px-3 py-2 transition-colors"
            >
              Create User
            </button>

            {/* Status Filter Dropdown */}
            <div className="relative" ref={statusDropdownRef}>
              <div
                className="flex items-center text-[#1E1E1E] cursor-pointer border border-[#e1e4ea] rounded-md px-4 py-2 bg-white"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                <span className="text-sm">{statusFilter}</span>
                <ChevronDownIcon />
              </div>

              {/* Dropdown Menu */}
              {isStatusDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-[#e1e4ea] rounded-md shadow-lg z-50 min-w-max">
                  <div
                    className={`px-4 py-2 text-sm cursor-pointer rounded-md mx-2 my-1 ${
                      statusFilter === "All" ? "bg-[#F3F4F6] text-[#8B5CF6]" : "text-[#6B7280]"
                    }`}
                    onClick={() => handleStatusFilterChange("All")}
                  >
                    All
                  </div>
                  <div
                    className={`px-4 py-2 text-sm cursor-pointer rounded-md mx-2 my-1 ${
                      statusFilter === "Active" ? "bg-[#F3F4F6] text-[#8B5CF6]" : "text-[#6B7280]"
                    }`}
                    onClick={() => handleStatusFilterChange("Active")}
                  >
                    Active
                  </div>
                  <div
                    className={`px-4 py-2 text-sm cursor-pointer rounded-md mx-2 my-1 ${
                      statusFilter === "Inactive" ? "bg-[#F3F4F6] text-[#8B5CF6]" : "text-[#6B7280]"
                    }`}
                    onClick={() => handleStatusFilterChange("Inactive")}
                  >
                    Inactive
                  </div>
                  <div
                    className={`px-4 py-2 text-sm cursor-pointer rounded-md mx-2 my-1 ${
                      statusFilter === "Deleted" ? "bg-[#F3F4F6] text-[#8B5CF6]" : "text-[#6B7280]"
                    }`}
                    onClick={() => handleStatusFilterChange("Deleted")}
                  >
                    Deleted
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table with proper column alignment */}
        <div className="overflow-x-auto">
          <table className="w-full ml-8">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">Name</th>
                <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">Email</th>
                <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">Business Name</th>
                <th className="text-left py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">Location</th>
                <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">Status</th>
                <th className="text-center py-3 px-4 text-[#5A687C] text-[14px] font-medium w-1/8">Actions</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body - With border */}
        <div className="border border-[#e1e4ea] bg-[#FFFFFF] rounded-lg p-6 -mt-6">
          {isDataLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <span className="loader" />
                <p>Loading users...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {filteredUsers?.length > 0 &&
                    filteredUsers.map((user, index) => (
                      <tr key={user.id} className={index > 0 ? "border-t border-[#e1e4ea]" : ""}>
                        <td className="py-4 px-4 w-1/8">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[#675FFF] text-sm font-semibold bg-[#335BFB1A]">
                              {user.initials}
                            </div>
                            <span className="text-[#1E1E1E] font-medium !truncate">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 w-1/8">
                          <span className="text-[#5A687C] font-medium">{user.email}</span>
                        </td>
                        <td className="py-4 px-4 w-1/8 whitespace-pre-wrap !truncate">
                          <span className="text-[#5A687C] font-medium">{user.business_name}</span>
                        </td>
                        <td className="py-4 px-4 w-1/8">
                          <span className="text-[#5A687C] font-medium">{user.location}</span>
                        </td>
                        <td className="py-4 px-4 w-1/8">
                          <div className="flex items-center justify-center gap-3">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                user.isActive ? "bg-blue-600" : "bg-gray-200"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  user.isActive ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 w-1/8 relative">
                          <div className="flex items-center justify-center">
                            {/* 3 dots button */}
                            <button
                              onClick={() => {
                                setOpenMenuUserId(openMenuUserId === user.id ? null : user.id)
                                setUser(user)
                                console.log(user)
                                setSelectedDuration(user.subscriptionDurationType)
                                setSelectedPlan(user.subscriptionType )
                              }}
                              className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                            >
                              <MoreVertical className="h-5 w-5 text-gray-600" />
                            </button>

                            {/* dropdown */}
                            {openMenuUserId === user.id && (
                              <div className="absolute right-5 top-12 lg:right-20 lg:top-15 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 cursor-pointer">
                                <button
                                  onClick={() => {
                                    setAddCreditsStatus(user.id)
                                    setShowModal(true) // existing modal
                                    setOpenMenuUserId(null)
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                >
                                  Add Credits
                                </button>

                                <button
                                  onClick={() => {
                                    setShowPlanModal(true)
                                    setOpenMenuUserId(null)
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                >
                                  Change Plan
                                </button>

                                {/* <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  Edit
                                </button> */}

                                <button
                                  onClick={() => {
                                    setShowDeleteModal(true)
                                    setOpenMenuUserId(null)
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-[#5A687C]">No users found matching your search criteria.</div>
              )}
            </div>
          )}
        </div>
        {showModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl z-40 w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-gray-800"
                onClick={addCreditsStatus ? handleCreditsReset : handleReset}
              >
                <X size={20} />
              </button>

              {!addCreditsStatus ? (
                <>
                  <h2 className="text-xl font-semibold mb-6">New User Management</h2>

                  {error?.createUser && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error.createUser}
                    </div>
                  )}

                  {/* Modal Content Here */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Email</label>
                      <input
                        type="text"
                        placeholder="Enter email"
                        value={formData.email}
                        name="email"
                        onChange={handleChange}
                        className={`w-full bg-white p-2 rounded-lg border ${error?.email ? "border-red-500" : "border-[#e1e4ea]"} focus:outline-none focus:border-[#675FFF]`}
                      />
                      {error?.email && <p className="text-[#FF3B30] py-1">{error?.email}</p>}
                    </div>
                    {/* <div>
                      <label className="block text-[#1E1E1E] text-sm font-medium mb-2">
                        Password
                      </label>
                      <input
                        type="text"
                        placeholder="Enter password"
                        value={formData.password}
                        name="password"
                        onChange={handleChange}
                        className={`w-full bg-white p-2 rounded-lg border ${(error?.password) ? 'border-red-500' : 'border-[#e1e4ea]'} focus:outline-none focus:border-[#675FFF]`}
                      />
                      {error?.password && <p className="text-[#FF3B30] py-1">{error?.password}</p>}
                    </div> */}
                    <div>
                      <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Subscription Type</label>
                      <SelectDropdown
                        name="subscriptionType"
                        options={subscriptionTypeOptions}
                        value={formData?.subscriptionType}
                        onChange={(updated) => {
                          console.log(updated)
                          setFormData((prev) => ({
                            ...prev,
                            subscriptionType: updated,
                          }))
                          setError((prev) => ({ ...prev, subscriptionType: "" }))
                        }}
                        placeholder="Enter subscription type"
                        className="w-full"
                        errors={error}
                      />
                      {error?.subscriptionType && <p className="text-[#FF3B30] py-1">{error?.subscriptionType}</p>}
                    </div>
                    <div>
                      <label className="block text-[#1E1E1E] text-sm font-medium mb-2">
                        Subscription Duration Type
                      </label>
                      <SelectDropdown
                        name="subscriptionDurationType"
                        options={subscriptionDurationTypeOptions}
                        value={formData?.subscriptionDurationType}
                        onChange={(updated) => {
                          console.log(updated)
                          setFormData((prev) => ({
                            ...prev,
                            subscriptionDurationType: updated,
                          }))
                          setError((prev) => ({ ...prev, subscriptionDurationType: "" }))
                        }}
                        placeholder="Enter subscription duration type"
                        className="w-full"
                        errors={error}
                      />
                      {error?.subscriptionDurationType && (
                        <p className="text-[#FF3B30] py-1">{error?.subscriptionDurationType}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleReset}
                      className="w-full text-[16px] cursor-pointer text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loadingStatus}
                      className={`w-full ${loadingStatus ? "bg-[#675fff79]" : "bg-[#675FFF] cursor-pointer"} text-white rounded-[8px] font-normal transition`}
                    >
                      {loadingStatus ? (
                        <div className="flex items-center justify-center gap-2">
                          <p>Processing...</p>
                          <span className="loader" />
                        </div>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-6">Add Credits</h2>

                  {error?.addCredits && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error.addCredits}
                    </div>
                  )}

                  {/* Credits form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#1E1E1E] text-sm font-medium mb-2">Credits</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="Enter credits"
                        value={credits}
                        name="credits"
                        onChange={(e) => {
                          if (e.target.value < 0) {
                            setCredits(0)
                          } else {
                            setCredits(e.target.value)
                          }
                          setError((prev) => ({ ...prev, credits: "" }))
                        }}
                        className={`w-full bg-white p-2 rounded-lg border ${error?.credits ? "border-red-500" : "border-[#e1e4ea]"} focus:outline-none focus:border-[#675FFF]`}
                      />
                      {error?.credits && <p className="text-[#FF3B30] py-1">{error?.credits}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleCreditsReset}
                      className="w-full text-[16px] cursor-pointer text-[#5A687C] bg-white border border-[#E1E4EA] rounded-[8px] h-[38px]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCredits}
                      disabled={loadingCreditsStatus}
                      className={`w-full ${loadingCreditsStatus ? "bg-[#675fff79]" : "bg-[#675FFF] cursor-pointer"} text-white rounded-[8px] font-normal transition`}
                    >
                      {loadingCreditsStatus ? (
                        <div className="flex items-center justify-center gap-2">
                          <p>Processing...</p>
                          <span className="loader" />
                        </div>
                      ) : (
                        "Add Credits"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {showPlanModal && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
              <h2 className="text-lg font-semibold mb-4">Change Plan</h2>

              {error?.planUpdate && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-left">
                  {error.planUpdate}
                </div>
              )}

              {/* Plan selection form */}
              <label className="block mb-2 text-sm font-medium text-gray-700">Select Plan</label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              >
                <option value="pro">Standard</option>
                <option value="team">Pro</option>
              </select>

              <label className="block mb-2 text-sm font-medium text-gray-700">Duration</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-6"
              >
                <option value="monthly">Month</option>
                <option value="yearly">Year</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
                  disabled={isUpdatingPlan}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlanUpdate}
                  disabled={isUpdatingPlan}
                  className={`px-4 py-2 text-sm rounded text-white ${isUpdatingPlan ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {isUpdatingPlan ? (
                    <div className="flex items-center gap-2">
                      <span className="loader" />
                      Updating...
                    </div>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg w-80 p-6 text-center">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>

              {error?.deleteUser && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-left">
                  {error.deleteUser}
                </div>
              )}

              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete <b>{user.name}</b>?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
                  disabled={isDeletingUser}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeletingUser}
                  className={`px-4 py-2 text-sm rounded text-white ${isDeletingUser ? "bg-red-400" : "bg-red-600 hover:bg-red-700"}`}
                >
                  {isDeletingUser ? (
                    <div className="flex items-center gap-2">
                      <span className="loader" />
                      Deleting...
                    </div>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
