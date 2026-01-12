import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('come')
        .setDescription('استدعاء عضو إلى الروم الحالي')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('العضو المراد استدعاؤه')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('message')
                .setDescription('رسالة اختيارية للعضو')
                .setRequired(false)
        ),

    async execute(interaction) {
        const ALLOWED_ROLE_ID = '1419306051164966964';
        
        // التحقق من الصلاحية
        if (!interaction.member.roles.cache.has(ALLOWED_ROLE_ID)) {
            await interaction.reply({
                content: 'ليس لديك صلاحية لاستخدام هذا الأمر',
                ephemeral: true
            });
            return;
        }

        const targetUser = interaction.options.getUser('user');
        const customMessage = interaction.options.getString('message');
        const currentChannel = interaction.channel;

        // إرسال رد في الروم
        const channelEmbed = new EmbedBuilder()
            .setColor(0x000080)
            .setTitle('✅ تم إرسال النداء بنجاح')
            .setDescription(`**تم استدعاء العضو**\n${targetUser}`)
            .addFields(
                { name: 'الروم', value: `${currentChannel}`, inline: true },
                { name: 'المستدعي', value: `${interaction.user}`, inline: true },
                { name: 'الوقت', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
            );

        if (customMessage) {
            channelEmbed.addFields({ name: 'الرسالة المرسلة', value: customMessage, inline: false });
        }

        channelEmbed.setFooter({ text: `تم الإرسال بواسطة ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [channelEmbed] });

        // إرسال رسالة خاصة للعضو
        try {
            const dmEmbed = new EmbedBuilder()
                .setColor(0x000080)
                .setTitle('📢 لديك استدعاء جديد')
                .setDescription(`**أنت مطلوب في الروم التالي**`)
                .addFields(
                    { name: 'الروم المطلوب', value: `${currentChannel}`, inline: false },
                    { name: 'السيرفر', value: `${interaction.guild.name}`, inline: true },
                    { name: 'المستدعي', value: `${interaction.user}`, inline: true },
                    { name: 'الوقت', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
                );

            if (customMessage) {
                dmEmbed.addFields({ name: '💬 الرسالة', value: customMessage, inline: false });
            }

            dmEmbed.setFooter({ text: 'يرجى التوجه إلى الروم في أقرب وقت' })
                .setTimestamp();

            await targetUser.send({ embeds: [dmEmbed] });
        } catch (error) {
            console.error(`فشل إرسال رسالة خاصة إلى ${targetUser.tag}:`, error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('❌ فشل الإرسال')
                .setDescription(`**تعذر إرسال رسالة خاصة إلى ${targetUser}**`)
                .addFields(
                    { name: 'السبب المحتمل', value: 'الرسائل الخاصة للعضو مغلقة', inline: false }
                )
                .setFooter({ text: 'يمكنك إخبار العضو مباشرة في السيرفر' })
                .setTimestamp();

            await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
