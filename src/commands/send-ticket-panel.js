import { SlashCommandBuilder, ChannelType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

const PANEL_IMAGE = 'https://media.discordapp.net/attachments/1438134187004530750/1459909692242530364/ABS2GSnAhIvVwhzggaCdU-_Xyf5ExWivUBfKGMXJlgVXXk_VjIEL3kBvIgHZiSn1rM2KCG0ZJ4EOiUSi9hZwUE0Zqd8nqtosMZgDXCYn_PD5mzJTA37ulkwuPzxD6rpOwHQB-qm0QdGcTID66NhnYMgSzEmMcHf_q2-84I05ny7-a5YpoXCXjgs1024-rj.png?ex=6964fe5a&is=6963acda&hm=a1036dd1bce960ac042a8523b339fdafab710020a90a3923bcc410cb67fde3c3&=&format=webp&quality=lossless&width=866&height=227';
const TARGET_CHANNEL_ID = '1397022592954663016';
const ALLOWED_ROLES = ['1419306155145953400', '1418942792121585724', '1436792989644095488'];

export default {
    data: new SlashCommandBuilder()
        .setName('send-ticket-panel')
        .setDescription('إرسال لوحة التيكيت في القناة المحددة'),
    
    execute: async interaction => {
        const member = await interaction.guild.members.fetch(interaction.user.id).catch(() => null);
        if (!member || !ALLOWED_ROLES.some(r => member.roles.cache.has(r))) {
            return interaction.reply({ content: 'ليس لديك الصلاحية لاستخدام هذا الأمر.', ephemeral: true });
        }

        const channel = await interaction.guild.channels.fetch(TARGET_CHANNEL_ID).catch(() => null);
        if (!channel || channel.type !== ChannelType.GuildText) {
            return interaction.reply({ content: 'القناة المحددة غير موجودة أو غير صالحة.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x808080)
            .setTitle('تذكرة الريوارد')
            .setImage(PANEL_IMAGE);

        const select = new StringSelectMenuBuilder()
            .setCustomId('ticket_select')
            .setPlaceholder('اختر نوع التذكرة')
            .addOptions([
                { label: 'ريوارد', value: 'reward', emoji: '🎁' }
            ]);

        const row = new ActionRowBuilder().addComponents(select);

        // محاولة العثور على اللوحة الموجودة وتحديثها
        const messages = await channel.messages.fetch({ limit: 50 }).catch(() => null);
        const existing = messages?.find(m => 
            m.author.id === interaction.client.user.id && 
            m.components?.some(r => r.components?.some(c => c.customId === 'ticket_select'))
        );

        if (existing) {
            await existing.edit({ embeds: [embed], components: [row] });
            return interaction.reply({ content: 'تم تحديث لوحة التذاكر.', ephemeral: true });
        }

        await channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: 'تم إرسال لوحة التذاكر.', ephemeral: true });
    }
};
