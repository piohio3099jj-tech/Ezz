import { SlashCommandBuilder, ChannelType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('setup-tickets')
        .setDescription('إعداد نظام التذاكر')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('القناة التي سيتم إرسال لوحة التذاكر فيها')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const channel = interaction.options.getChannel('channel');

            const PANEL_IMAGE = 'https://cdn.discordapp.com/attachments/1438037917124788267/1438521792296652800/Picsart_25-10-16_13-18-43-513.jpg?ex=69172f51&is=6915ddd1&hm=11fe8fbf7548e562ec12486d86dd5432923a9796582c42275bec8742ca9e157b&';

            const embed = new EmbedBuilder()
                .setColor(101056)
                .setTitle('تذكره الدعم الفني')
                .setImage(PANEL_IMAGE);

            const select = new StringSelectMenuBuilder()
                .setCustomId('ticket_select')
                .setPlaceholder('اختر نوع التذكرة')
                .addOptions([
                    { label: 'الدعم الفني', value: 'support', emoji: '🛠️' },
                    { label: 'ريوارد', value: 'reward', emoji: '🎁' },
                    { label: 'إعلان', value: 'advertisement', emoji: '📢' },
                    { label: 'Reset Menu', value: 'reset_menu', emoji: '🔄' }
                ]);

            const row = new ActionRowBuilder().addComponents(select);

            await channel.send({
                embeds: [embed],
                components: [row]
            });

            await interaction.editReply({
                content: `✅ تم إرسال لوحة التذاكر في ${channel}!`
            });

        } catch (error) {
            console.error('خطأ في إعداد نظام التذاكر:', error);
            await interaction.editReply({
                content: '❌ حدث خطأ أثناء إعداد نظام التذاكر.'
            });
        }
    }
};
