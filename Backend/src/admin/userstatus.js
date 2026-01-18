import userSchema from "../models/user.model.js"
import Order from "../models/order.model.js"

export async function getUserInfo() {
    const users = await userSchema.find().sort({ createdAt: -1 });

    return {
        total: users.length,
        users: users.map(i => ({
            _id: i._id,
            username: i.username,
            email: i.email,
            isEmailVerified: i.isEmailVerified,
            addressCount: i.addresses?.length || 0,
            createdAt: i.createdAt,
            updatedAt: i.updatedAt
        }))
    }
}

export async function getUserById(userId) {
    const user = await userSchema.findById(userId).select('-password -refreshToken -emailOtp -emailOtpExpiry');
    
    if (!user) {
        throw new Error("User not found");
    }

    // Get user's order count and total spent
    const orders = await Order.find({ userId: userId });
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        addresses: user.addresses || [],
        metadata: user.metadata,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        stats: {
            totalOrders: orders.length,
            totalSpent: totalSpent
        }
    };
}

export async function deleteUser(userId) {
    const user = await userSchema.findById(userId);
    
    if (!user) {
        throw new Error("User not found");
    }

    await userSchema.findByIdAndDelete(userId);
    return { deleted: true, userId: userId };
}

export async function getUserStats() {
    const totalUsers = await userSchema.countDocuments();
    const verifiedUsers = await userSchema.countDocuments({ isEmailVerified: true });
    
    // Users registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await userSchema.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Users registered in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyUsers = await userSchema.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    return {
        totalUsers,
        verifiedUsers,
        unverifiedUsers: totalUsers - verifiedUsers,
        newUsersLast30Days: newUsers,
        newUsersLast7Days: weeklyUsers
    };
}