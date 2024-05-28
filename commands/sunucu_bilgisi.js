/////////////////////////////////////////
const mongo_planss = require("../mongoDB/plans.js");
let admins = [
  "445142958447263747"
];
const { MessageEmbed } = require("discord.js");
/////////////////////////////////////////
module.exports = {
  name: "sunucu_bilgisi",
  usage: "/sunucu_bilgisi <basvuru_id>",
  options: [
    {
      name: "basvuru_id",
      description: "Başvuru ID.",
      type: "STRING",
      required: true,
    },
  ],
  category: "Bot",
  description: "Sunucu Durumunu Gösterir.",
  run: async (client, interaction) => {
    let basvuru_id = interaction.options.getString("basvuru_id");
    if(basvuru_id.length !== 24) return interaction.reply({ content: "Başvuru ID'si hatalı." });
    let userID = interaction.user.id;
    if (!userID.includes(admins)) return interaction.reply({ content: "Bu komutu kullanabilmek için yetkili olmanız gerekmektedir." });
    let basvuru = await mongo_planss.findOne({ _id: basvuru_id }) || "NaN";
    if (basvuru === "NaN") return interaction.reply({ content: "Bu ID'ye sahip bir başvuru bulunamadı." });

    let sunucu = client.guilds.cache.get(basvuru.sunucuID);
    if(!sunucu) return interaction.reply({ content: "Bu sunucu bulunamadı." });
    //sunucu invite create
    let sunucu_link = await sunucu.channels.cache.get(basvuru.log_channel_id).createInvite({ maxAge: 0, maxUses: 0 });
    let sunucu_bilgisi = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Sunucu Bilgisi")
      .addField("Sunucu Adı", `${sunucu.name}`)
      .addField("Üye Sayısı", `${sunucu.memberCount}`)
      .addField("Boost Sayısı", `${sunucu.premiumSubscriptionCount}`)
      .addField("Özel URL", `https://discord.gg/${sunucu.vanityURLCode}`)
      .addField("Keşif", `${sunucu.discoverySplash}`)
      .addField("Sunucu Daveti", `${sunucu_link}`);
    interaction.reply({ embeds: [sunucu_bilgisi] });
  },
};

/*
ref *2> Guild {
  id: '982824742052560906',
  name: '𝐇𝐄𝐋𝐈̇𝐎𝐒'      ,
  icon: '466929ff9105d6797aebd86a647e16aa',
  features: [ 'ANIMATED_ICON', 'THREE_DAY_THREAD_ARCHIVE', 'INVITE_SPLASH' ],
  commands: <ref *1> GuildApplicationCommandManager {
    permissions: ApplicationCommandPermissionsManager {
      manager: [Circular *1],
      guild: [Circular *2],
      guildId: '982824742052560906',
      commandId: null
    },
    guild: [Circular *2]
  },
  members: GuildMemberManager { guild: [Circular *2] },
  channels: GuildChannelManager { guild: [Circular *2] },
  bans: GuildBanManager { guild: [Circular *2] },
  roles: RoleManager { guild: [Circular *2] },
  presences: PresenceManager {},
  voiceStates: VoiceStateManager { guild: [Circular *2] },
  stageInstances: StageInstanceManager { guild: [Circular *2] },
  invites: GuildInviteManager { guild: [Circular *2] },
  scheduledEvents: GuildScheduledEventManager { guild: [Circular *2] },
  available: true,
  shardId: 0,
  splash: null,
  banner: null,
  description: null,
  verificationLevel: 'NONE',
  vanityURLCode: null,
  nsfwLevel: 'DEFAULT',
  premiumSubscriptionCount: 4,
  discoverySplash: null,
  memberCount: 88,
  large: true,
  premiumProgressBarEnabled: false,
  applicationId: null,
  afkTimeout: 300,
  afkChannelId: null,
  systemChannelId: '982851608272592916',
  premiumTier: 'TIER_1',
  explicitContentFilter: 'DISABLED',
  mfaLevel: 'NONE',
  joinedTimestamp: 1656140718689,
  defaultMessageNotifications: 'ALL_MESSAGES',
  systemChannelFlags: SystemChannelFlags { bitfield: 9 },
  maximumMembers: 500000,
  maximumPresences: null,
  approximateMemberCount: null,
  approximatePresenceCount: null,
  vanityURLUses: null,
  rulesChannelId: null,
  publicUpdatesChannelId: null,
  preferredLocale: 'en-US',
  ownerId: '450344757802041344',
  emojis: GuildEmojiManager { guild: [Circular *2] },
  stickers: GuildStickerManager { guild: [Circular *2] }
}

*/