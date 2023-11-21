const { Client, GatewayIntentBits } = require('discord.js');
const TwitchAPI = require('twitch-api');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});
const config = require('./config');

client.once('ready', (c) => {
    console.log(`${c.user.tag} is online!`);
});

client.on('messageCreate', message => {
    console.log('Message received:', message.content); // Add this line to check if the bot is receiving messages
    // Your existing message handling code
});

client.on('messageCreate', async message => {
    console.log('READY')
    if (message.content === '!playstream') {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.channel.send('You need to be in a voice channel to play the stream!')
        }

        // try {
        //     const streamURL = await twitchGetStream('tarik');
        //     const connection = await voiceChannel.join();
        //     const dispatcher = connection.play(streamURL);

        //     dispatcher.on('start', () => {
        //         console.log('Playing Twitch stream audio!');
        //     });

        //     dispatcher.on('finish', () => {
        //         console.log('Stream ended.');
        //         voiceChannel.leave();
        //     });

        //     dispatcher.on('error', console.error);
        // } catch (error) {
        //     console.error(error);
        //     message.channel.send('There was an error playing the stream.');
        // }
    }
});

client.login(config.token);
