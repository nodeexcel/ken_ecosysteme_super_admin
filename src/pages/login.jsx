import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { LuUserRound } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { PasswordLock } from "../icons/icons";
import header from '../assets/svg/ecosysteme.ai_logo.svg'

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({})
    const token = localStorage.getItem("token")
    const userDetails = useSelector((state) => state.profile)
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);


    useEffect(() => {
        setTimeout(() => {
            setSuccess({})
        }, 5000)
    }, [success])

    useEffect(() => {

        if (token && userDetails.loading) {
            navigate("/dashboard")
        }

    }, [token, userDetails.loading])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if ((!validateEmail(formData.email))) newErrors.email = 'Email is invalid';
        if (!formData.password) newErrors.password = 'Password is required'; // Commented out as per Figma design

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            setLoading(true);
            const response = await login(formData);

            console.log(response)
            if (response?.status === 200) {
                navigate("/dashboard")
                localStorage.setItem("token", response?.data?.access_token)
                localStorage.setItem("refreshToken", response?.data?.refresh_token)
                setFormData({ email: "", password: "" })
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (auth_data) => {
        console.log(auth_data, auth_data?.credential, "response")
        const token = auth_data?.access_token
        console.log(token, "jooo")
    }

    const loginGoogle = useGoogleLogin({
        onSuccess: handleGoogleLogin,
    });

    const renderEmailStep = () => (
        <form onSubmit={handleSubmit} className="space-y-2">
            <h2 className="text-[28px] font-bold text-center text-[#292D32]">Welcome Back</h2>
            <p className="text-center text-[16px] text-[#777F90] mb-4">Please enter your details below.</p>
            <div>
                <label className="block text-[16px] font-medium text-[#292D32] mb-1">Email</label>
                <div className={`flex items-center focus-within:border-[#675FFF] border rounded-[8px] px-4 py-3 ${errors.email ? "border-red-500" : "border-gray-300"}`}>
                    <LuUserRound className="text-gray-400 mr-2 text-xl" />
                    <input
                        name="email"
                        type="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full focus:outline-none"
                    />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
                <label className="block text-[16px] font-medium text-[#292D32] mb-1">Password</label>
                <div className={`flex items-center focus-within:border-[#675FFF] border rounded-[8px] px-4 py-3 ${errors.password ? "border-red-500" : "border-gray-300"}`}>
                    <div className="pr-2">
                        <PasswordLock />
                    </div>
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="ml-2 focus:outline-none"
                    >
                        {showPassword ? (
                            <AiOutlineEye className="text-gray-400 text-lg" />
                        ) : (
                            <AiOutlineEyeInvisible className="text-gray-400 text-lg" />
                        )}
                    </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                {success.password && <p className="text-green-500 text-sm mt-1">{success.password}</p>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? "bg-[#675fff79]" : "bg-[#675FFF] cursor-pointer"} text-white my-4 py-[14px] rounded-[8px] font-semibold  transition`}
            >
                {loading ? <div className="flex items-center justify-center gap-2"><p>Processing...</p><span className="loader" /></div> : "Continue"}
            </button>
        </form>
    );

    if (userDetails?.loading && token) return <p className='flex justify-center items-center h-full'><span className='loader' /></p>


    return (
        <div className="flex flex-col overflow-auto items-center h-screen bg-[#F6F7F9] p-3">
            <div className="flex items-center gap-2 py-[30px]">
                <div>
                    <img src={header} alt="logo" className="" />
                </div>
            </div>
            <div className="bg-white p-8 inter rounded-2xl border border-[#E1E4EA] mt-3 w-full max-w-[500px]">
                {renderEmailStep()}
                <>
                    <div className="mt-2 mb-6 flex items-center gap-2 w-full">
                        <hr className="text-[#E1E4EA] w-[50%]" />
                        <div className="text-sm text-gray-500">OR</div>
                        <hr className="text-[#E1E4EA] w-[50%]" />
                    </div>
                    {errors.google_auth && <p className="text-red-500 text-sm my-1 text-center">{errors.google_auth}</p>}
                    <button onClick={() => loginGoogle()} className="w-full flex cursor-pointer items-center font-[600] text-[#5A687C] text-[14px] justify-center border border-gray-300 py-[14px] rounded-[8px] hover:bg-gray-100 transition">
                        <FcGoogle className="mr-2 text-xl" /> Continue with Google
                    </button>
                </>
            </div>
        </div >
    );
}
