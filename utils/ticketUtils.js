
const { Settings } = require('./MongoDB/database');

const getTicketSettings = async (guildId) => {
    let settings = await Settings.findOne({ guildId: guildId });
    if (!settings) {
        settings = new Settings({ guildId: guildId });
        await settings.save();
    }
    return settings;
};

module.exports = { getTicketSettings };
