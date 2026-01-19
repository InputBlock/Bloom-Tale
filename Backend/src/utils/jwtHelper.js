import jwt from "jsonwebtoken";

if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("FATAL: ACCESS_TOKEN_SECRET is not defined in environment variables");
}

export const createAccessToken = (userId, role = "user") => {
    return jwt.sign(
        { id: userId, role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    );
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};
