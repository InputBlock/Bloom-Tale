import AdminDecorator from "../../admin/decorator.admin.js"

const admin_login = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        if (!email || !email.trim()) {
            return res.status(400).json({ error: "Email is required" });
        }
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        
        const ctx = {
            email: email.trim().toLowerCase(),
            password: password
        };
        const result = await AdminDecorator(ctx);

        res.status(200).json(result);
    } catch (err) {
        
        if (err.message.includes("Invalid credentials") || err.message.includes("access required")) {
            return res.status(401).json({ error: err.message });
        }
        return res.status(500).json({ error: "Login failed. Please try again." });
    }
}

export default admin_login;