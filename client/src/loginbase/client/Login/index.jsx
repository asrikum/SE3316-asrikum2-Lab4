import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [resend, setResend] = useState(false);
    const navigate = useNavigate(); // Using useHistory hook for redirection

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/auth";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", res.data);
			localStorage.setItem("isVerified", res.verified); // Store the verification status
            localStorage.setItem("isAdmin", res.isAdmin);

            fetchUserData();
			if (res.verified === false) {
				setError("Please verify your email to access all features.");
				setResend(true);
            } else if (res.isAdmin) {
        window.location="/";
        navigate("/");

            } else {
				window.location="/";
                navigate("/"); // Redirect to main page if verified
            }
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message);
                setResend(false);
            }
        }
    };
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
    
            const response = await axios.get("http://localhost:4000/admin/users", config);
            console.log(response.data); // Process the response data as needed
        } catch (error) {
            console.error("Error fetching user data:", error);
            // Handle errors (e.g., token expired, unauthorized access)
        }
    };
    

    const handleResendVerification = async () => {
        try {
            const { email } = data;
            await axios.post('http://localhost:8080/api/auth/resend-verification', { email });
            setError("Verification email resent. Please check your inbox.");
			window.location="/";
			navigate("/"); // Redirect to main page after resending the email
        } catch (error) {
            setError("Error resending verification email.");
        }
    };

    return (
        <div className={styles.login_container}>
            <div className={styles.login_form_container}>
                <div className={styles.left}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Login to Your Account</h1>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className={styles.input}
                        />
                        {error && <div className={styles.error_msg}>{error}</div>}
                        {resend && (
                            <div className={styles.resend_container}>
                                <button onClick={handleResendVerification} className={styles.resend_btn}>
                                    Resend Verification Email
                                </button>
                            </div>
                        )}
                        <button type="submit" className={styles.green_btn}>
                            Sign In
                        </button>
                    </form>
                </div>
                <div className={styles.right}>
                    <h1>New Here ?</h1>
                    <Link to="/signup">
                        <button type="button" className={styles.white_btn}>
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
