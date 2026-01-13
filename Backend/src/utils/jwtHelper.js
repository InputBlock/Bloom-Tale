import jwt from "jsonwebtoken";

export const createAccessToken = (userId, role = "user") => {
    return jwt.sign(
        { id: userId, role },
        process.env.ACCESS_TOKEN_SECRET || "your-secret-key",
        { expiresIn: "1d" }
    );
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "your-secret-key");
};
