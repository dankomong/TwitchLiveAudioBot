const { Client, GatewayIntentBits } = require('discord.js');
const { ApiClient } = require('@twurple/api');
const { ClientCredentialsAuthProvider } = require('@twurple/auth');
require('dotenv').config();

const config = require('./config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const authProvider = new ClientCredentialsAuthProvider(config.TWITCH_CLIENT_ID, config.TWITCH_CLIENT_SECRET);
const apiClient = new ApiClient({ authProvider });

client.once('ready', (c) => {
    console.log(`${c.user.tag} is online!`);
});

client.on('messageCreate', async message => {
    console.log('READY')
    if (message.content === '!playstream') {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.channel.send('You need to be in a voice channel to play the stream!')
        }

        try {
            const streamData = await apiClient.streams.getStreamByUserName('kyedae');

            if (streamData) {
                const streamURL = streamData.thumbnailUrl.replace('{width}x{height}', '1920x1080');
                const connection = await voiceChannel.join();
                const dispatcher = connection.play(streamURL);

                dispatcher.on('start', () => {
                    console.log('Playing Twitch stream audio!');
                });

                dispatcher.on('finish', () => {
                    console.log('Stream ended.');
                    voiceChannel.leave();
                });

                dispatcher.on('error', console.error);
            } else {
                message.channel.send('The Twitch channel is not currently live or the data is unavailable.');
            }
        } catch (error) {
            console.error(error);
            message.channel.send('There was an error fetching the stream data.');
        }
    }
});

client.login(config.token);
