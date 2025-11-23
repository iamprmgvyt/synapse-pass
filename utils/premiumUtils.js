
const { PremiumUser } = require('./MongoDB/database');

const isPremium = async (userId) => {
    const user = await PremiumUser.findOne({ userId: userId });
    if (!user) {
        return false;
    }
    if (user.premiumType === 'lifetime') {
        return true;
    }
    if (user.expirationDate && user.expirationDate > new Date()) {
        return true;
    }
    // Handle expired premium
    if (user.expirationDate && user.expirationDate <= new Date()) {
        await PremiumUser.deleteOne({ userId: userId });
        return false;
    }
    return false;
};

module.exports = { isPremium };
