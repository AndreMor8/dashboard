const DS = require('passport-discord').Strategy;
const DiscordUser = require("../models/DiscordUser.js");
const passport = require('passport');
const OAuth2 = require("../models/OAuth2Credentials");
const utils = require("../utils/utils");
passport.serializeUser((user, done) => {
  done(null, user.discordId)
})

passport.deserializeUser(async (id, done) => {
  const user = await DiscordUser.findOne({ discordId: id });
  if (user) done(null, user)
})

passport.use(new DS({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callback: process.env.CLIENT_REDIRECT,
  scope: ['identify', 'guilds']
}, async (acc, ref, p, done) => {
  try {
    const eat = utils.encrypt(acc).toString();
    const ert = utils.encrypt(ref).toString();
    const user = await DiscordUser.findOneAndUpdate({ discordId: p.id }, {
      username: `${p.username}#${p.discriminator}`,
      guilds: p.guilds,
      avatar: p.avatar,
      premium_type: p.premium_type
    });
    const findCredentials = await OAuth2.findOneAndUpdate({ discordId: p.id }, {
      accessToken: eat,
      refreshToken: ert,
    })
    if (user) {
      if (!findCredentials) {
        await OAuth2.create({
          discordId: p.id,
          accessToken: eat,
          refreshToken: ert
        });
      }
      done(null, user);
    }
    else {
      const newUser = await DiscordUser.create({
        discordId: p.id,
        username: `${p.username}#${p.discriminator}`,
        guilds: p.guilds,
        avatar: p.avatar,
        premium_type: p.premium_type
      });
      await OAuth2.create({
        discordId: p.id,
        accessToken: eat,
        refreshToken: ert
      });
      done(null, newUser);
    }
  }
  catch (err) {
    console.log(err);
    done(err, null);
  }
}))