import { SlashCommandBuilder, ChannelType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits } from 'discord.js';

const PANEL_IMAGE = 'https://cdn.discordapp.com/attachments/1438037917124788267/1438581877966508082/Picsart_25-10-16_13-18-43-513.jpg?ex=69176747&is=691615c7&hm=a7a8f4310ba5e484ad1d8521055199b63ad3c9f6aa846889813b64021f9d1929&';
const ALLOWED_ROLES = ['1428103206705172673', '1418942792121585724', '1436792989644095488'];

export default {
	data: new SlashCommandBuilder()
		.setName('setup-tickets')
		.setDescription('إرسال/تعديل لوحة التذاكر في قناة محددة')
		.addChannelOption(o => o.setName('channel').setDescription('القناة المستهدفة').addChannelTypes(ChannelType.GuildText).setRequired(true)),
	execute: async interaction => {
		const member = await interaction.guild.members.fetch(interaction.user.id).catch(() => null);
		if (!member || !ALLOWED_ROLES.some(r => member.roles.cache.has(r))) {
			return interaction.reply({ content: 'ليس لديك الصلاحية لاستخدام هذا الأمر.', ephemeral: true });
		}
		const channel = interaction.options.getChannel('channel', true);
		const embed = new EmbedBuilder()
			.setColor(0x808080)
			.setTitle('تذكره الدعم الفني')
			.setImage(PANEL_IMAGE);

		const select = new StringSelectMenuBuilder()
			.setCustomId('ticket_select')
			.setPlaceholder('اختر نوع التذكرة')
			.addOptions([
				{ label: 'الدعم الفني', value: 'support', emoji: { id: '1386132899874472098', name: 'estaff_ds' } },
			]);
		const row = new ActionRowBuilder().addComponents(select);

		// try to find existing panel and edit it
		const messages = await channel.messages.fetch({ limit: 50 }).catch(() => null);
		const existing = messages?.find(m => m.author.id === interaction.client.user.id && m.components?.some(r => r.components?.some(c => c.customId === 'ticket_select')));
		if (existing) {
			await existing.edit({ embeds: [embed], components: [row] });
			return interaction.reply({ content: 'تم تحديث لوحة التذاكر.', ephemeral: true });
		}
		await channel.send({ embeds: [embed], components: [row] });
		await interaction.reply({ content: 'تم إرسال لوحة التذاكر.', ephemeral: true });
	},
};


