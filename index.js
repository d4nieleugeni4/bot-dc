const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

// Criando o cliente do bot com as intenções necessárias
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Evento quando o bot está pronto
client.once('ready', () => {
    console.log(`✅ Bot online como ${client.user.tag}!`);
    console.log(`📊 Estou em ${client.guilds.cache.size} servidores`);
    
    // Definir status do bot
    client.user.setPresence({
        activities: [{ name: '👋 Dando boas-vindas!', type: 3 }],
        status: 'online'
    });
});

// Evento quando um membro entra no servidor
client.on('guildMemberAdd', async (member) => {
    console.log(`🎉 Novo membro: ${member.user.tag} entrou no servidor!`);
    
    // Canal de boas-vindas (substitua pelo ID do seu canal)
    const welcomeChannel = member.guild.channels.cache.get('SEU_CANAL_ID_AQUI');
    
    // Se não encontrar pelo ID, tenta encontrar pelo nome
    if (!welcomeChannel) {
        const channel = member.guild.channels.cache.find(
            ch => ch.name.toLowerCase().includes('boas-vindas') || 
                  ch.name.toLowerCase().includes('welcome') ||
                  ch.name.toLowerCase().includes('geral')
        );
        if (!channel) return;
        
        sendWelcomeMessage(member, channel);
        return;
    }
    
    sendWelcomeMessage(member, welcomeChannel);
});

// Função para enviar mensagem de boas-vindas personalizada
function sendWelcomeMessage(member, channel) {
    // Criar embed bonito
    const welcomeEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle(`🎉 Bem-vindo(a) ao servidor, ${member.user.username}!`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .setDescription(
            `**Olá ${member}!**\n\n` +
            `✨ Esperamos que você se divirta aqui!\n` +
            `📚 Leia as regras em <#ID_DO_CANAL_DE_REGRAS>\n` +
            `💬 Converse com a comunidade!\n` +
            `👥 Você é o ${member.guild.memberCount}º membro!`
        )
        .addFields(
            { name: '📅 Entrou em', value: `<t:${Math.floor(Date.now() / 1000)}:d>`, inline: true },
            { name: '🕐 Conta criada', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
        )
        .setImage('https://i.imgur.com/w3duR07.png') // Imagem de banner (opcional)
        .setFooter({ 
            text: `Boas-vindas • ${member.guild.name}`, 
            iconURL: member.guild.iconURL({ dynamic: true }) 
        })
        .setTimestamp();

    // Enviar mensagem com botão de mencionar (opcional)
    channel.send({ 
        content: `👋 ${member} acabou de entrar! Sejam todos bem-vindos!`,
        embeds: [welcomeEmbed] 
    }).then(() => {
        console.log(`✅ Mensagem de boas-vindas enviada para ${member.user.tag}`);
    }).catch(console.error);
    
    // Opcional: Enviar DM de boas-vindas
    sendWelcomeDM(member);
}

// Função para enviar mensagem privada
async function sendWelcomeDM(member) {
    try {
        const dmEmbed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`👋 Olá ${member.user.username}!`)
            .setDescription(
                `Seja muito bem-vindo(a) ao **${member.guild.name}**!\n\n` +
                `📖 **Leia as regras** para evitar problemas\n` +
                `🎭 **Personalize seu perfil** com /perfil\n` +
                `💬 **Participe das conversas** e faça amigos!\n\n` +
                `*Estamos felizes por ter você aqui! 😊*`
            )
            .setFooter({ text: 'Qualquer dúvida, chame a staff!' });
        
        await member.send({ embeds: [dmEmbed] });
        console.log(`📨 DM enviada para ${member.user.tag}`);
    } catch (error) {
        console.log(`❌ Não foi possível enviar DM para ${member.user.tag}`);
    }
}

// Evento de mensagens (opcional - comando de teste)
client.on('messageCreate', async (message) => {
    // Evitar que o bot responda a si mesmo
    if (message.author.bot) return;
    
    // Comando de teste
    if (message.content === '!testewelcome') {
        const testEmbed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🧪 Teste de Boas-Vindas')
            .setDescription('Esta é uma prévia de como ficará a mensagem de boas-vindas!')
            .addFields(
                { name: '📊 Status', value: '✅ Sistema funcionando', inline: true },
                { name: '👥 Membros', value: `${message.guild.memberCount}`, inline: true }
            )
            .setTimestamp();
        
        message.reply({ embeds: [testEmbed] });
    }
    
    // Comando para ver informações do servidor
    if (message.content === '!serverinfo') {
        const serverEmbed = new EmbedBuilder()
            .setColor('#9B59B6')
            .setTitle(`🏰 ${message.guild.name}`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '👑 Dono', value: `<@${message.guild.ownerId}>`, inline: true },
                { name: '👥 Membros', value: `${message.guild.memberCount}`, inline: true },
                { name: '📅 Criado em', value: `<t:${Math.floor(message.guild.createdTimestamp / 1000)}:R>`, inline: true }
            )
            .setFooter({ text: `ID: ${message.guild.id}` });
        
        message.reply({ embeds: [serverEmbed] });
    }
});

// Tratamento de erros
client.on('error', console.error);
process.on('unhandledRejection', console.error);

// Login do bot
client.login(process.env.DISCORD_TOKEN);
