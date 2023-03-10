const { SlashCommandBuilder } = require('@discordjs/builders');

const call = require('../functions/call.js');
const editJsonFile = require("edit-json-file");

var file = editJsonFile(`${process.cwd()}/call.json`, {
    autosave: true
});

module.exports = {
    data: new SlashCommandBuilder()
        .setName('override')
        .setDescription('Override the call')
        .setDMPermission(false)
        .addStringOption(option =>
            option
            .setName('manual')
            .setDescription('Are you manually overriding the call?')
            .setRequired(true)
            .addChoices(
                {name: 'Yes', value: 'yes'},
                {name: 'No', value: 'no'}
            )
        )
        .addStringOption(option =>
            option
            .setName('month')
            .setDescription('The month of the call')
            .setRequired(false)
            .addChoices(
                {name: 'January', value: 'Jan'},
                {name: 'February', value: 'Feb'},
                {name: 'March', value: 'Mar'},
                {name: 'April', value: 'Apr'},
                {name: 'May', value: 'May'},
                {name: 'June', value: 'Jun'},
                {name: 'July', value: 'Jul'},
                {name: 'August', value: 'Aug'},
                {name: 'September', value: 'Sep'},
                {name: 'October', value: 'Oct'},
                {name: 'November', value: 'Nov'},
                {name: 'December', value: 'Dec'},
            )
        )
        .addIntegerOption(option =>
            option
            .setName('day')
            .setDescription('The day of the call (1-31)')
            .setRequired(false)
        )
        .addIntegerOption(option =>
            option
            .setName('year')
            .setDescription('The year of the call (2015 - current year)')
            .setRequired(false)
            .addChoices(
                {name: '2015', value: 2015},
                {name: '2016', value: 2016},
                {name: '2017', value: 2017},
                {name: '2018', value: 2018},
                {name: '2019', value: 2019},
                {name: '2020', value: 2020},
                {name: '2021', value: 2021},
                {name: '2022', value: 2022},
                {name: '2023', value: 2023},
            )    
        )
        .addIntegerOption(option =>
            option
            .setName('hour')
            .setDescription('The hour of the call (1am - 12am)')
            .setRequired(false)
            .addChoices(
                {name: '1am', value: 01},
                {name: '2am', value: 02},
                {name: '3am', value: 03},
                {name: '4am', value: 04},
                {name: '5am', value: 05},
                {name: '6am', value: 06},
                {name: '7am', value: 07},
                {name: '8am', value: 08},
                {name: '9am', value: 09},
                {name: '10am', value: 10},
                {name: '11am', value: 11},
                {name: '12am', value: 12},
                {name: '1pm', value: 13},
                {name: '2pm', value: 14},
                {name: '3pm', value: 15},
                {name: '4pm', value: 16},
                {name: '5pm', value: 17},
                {name: '6pm', value: 18},
                {name: '7pm', value: 19},
                {name: '8pm', value: 20},
                {name: '9pm', value: 21},
                {name: '10pm', value: 22},
                {name: '11pm', value: 23},
                {name: '12pm', value: 24},
            )
        )
        .addStringOption(option =>
            option
            .setName('minute')
            .setDescription('The minute of the call (0-59)')
            .setRequired(false)
        )
        
        .addStringOption(option =>
            option
            .setName('messageid')
            .setDescription('The embed message ID of the previous call')
            .setRequired(false)
        ),
    async execute(interaction, client) {
        if(interaction.options.getString('manual') == 'no') {
            const messageid = interaction.options.getString('messageid');
            if(messageid != null) {
                const message = await interaction.channel.messages.fetch(messageid);
                file.set("callStartTime", Date.parse(message.createdAt));
                file.set("callDate", new Date(message.createdAt).toLocaleDateString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"));
                file.set("callTime", new Date(message.createdAt).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"));
                interaction.reply({content: `The call's time has been overriden to \`${message.createdAt}\``, ephemeral: true});
            }
        } else {
            var month = interaction.options.getString('month');
            var day = interaction.options.getInteger('day');
            var year = interaction.options.getInteger('year');
            var hour = interaction.options.getInteger('hour');
            var minute = interaction.options.getString('minute');

            if(month == null) {
                month = 'Jan';
            }
            if(day == null) {
                day = 1;
            }
            if(year == null) {
                year = 2023;
            }
            if(hour == null) {
                hour = 1;
            }
            if(minute == null) {
                minute = "00";
            }

            interaction.reply({content: `The call's time has been overriden to \`${month} ${day} ${year} ${hour}:${minute}\``, ephemeral: true});
            file.set("callStartTime", Date.parse(`${month} ${day} ${year} ${hour}:${minute}`));
            file.set("callDate", new Date(`${month} ${day} ${year} ${hour}:${minute}`).toLocaleDateString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"));
            file.set("callTime", new Date(`${month} ${day} ${year} ${hour}:${minute}`).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3"));
        }  
    }
}