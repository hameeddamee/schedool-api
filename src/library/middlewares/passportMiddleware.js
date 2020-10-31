const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;

const config = require("../../config");
const userModule = require("../../components").user;
const { genCryptoRandomId } = require("../../library/helpers/stringHelpers");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userModule.service.findUserById(id);

  done(null, user);
});


passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleOauth.clientID,
      clientSecret: config.googleOauth.clientSecret,
      callbackURL: `${config.api.prefix}/user/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const currentUser = await userModule.service.findUserByOauthId(
        profile.id
      );

      try {
        if (currentUser) {
          return done(null, currentUser);
        } else {
          const userExist = await userModule.service.checkUserExist(
            profile.emails[0].value
          );

          if (userExist) {
            throw new Error("Account already exist.");
          }

          //TODO:Make the extraction of images from google work
          const image = profile.photos[0].value.substring(
            0,
            profile.photos[0].value.indexOf("?")
          );

          const numberId = genCryptoRandomId(11, "numeric");
          const userData = {
            formattedFirstName: profile.name.givenName,
            formattedLastName: profile.name.familyName,
            formattedfullNames: `${profile.name.givenName} ${profile.name.familyName}`,
            oauthId: profile.id,
            email: profile.emails[0].value,
            oauthAvatar: image,
            oauthType: "google",
            platformId: parseInt(numberId),
          };
          const newUser = await userModule.service.signUp(userData);
          return done(null, newUser);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: config.fbOauth.clientID,
      clientSecret: config.fbOauth.clientSecret,
      callbackURL: `${config.api.prefix}/user/facebook/callback`,
      profileFields: ["id", "displayName", "name", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const userProfile = profile._json;
      const currentUser = await userModule.service.findUserByOauthId(
        userProfile.id
      );

      try {
        if (currentUser) {
          return done(null, currentUser);
        } else {
          const userExist = await userModule.service.checkUserExist(
            userProfile.email
          );

          if (userExist) {
            throw new Error("Account already exist.");
          }

          //TODO:Make the extraction of images from facebook work
          const image = undefined;
          // const image = profile.photos[0].value.substring(
          //   0,
          //   profile.photos[0].value.indexOf("?")
          // );

          const numberId = genCryptoRandomId(11, "numeric");
          const userData = {
            formattedFirstName: profile.name.first_name,
            formattedLastName: profile.name.last_name,
            formattedfullNames: `${userProfile.first_name} ${userProfile.last_name}`,
            oauthId: userProfile.id,
            email: userProfile.email,
            oauthAvatar: image,
            oauthType: "facebook",
            platformId: parseInt(numberId),
          };
          const newUser = await userModule.service.signUp(userData);
          return done(null, newUser);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Twitter Strategy
// passport.use(
//   new TwitterStrategy(
//     {
//       consumerKey: "nAsRdF40TX5fQ7QivmuJGWWSj", // Replace with your Twitter Developer App consumer key
//       consumerSecret: "WH4MaKulaiPzrBttgS5KlQzanXmZIKZ4hmAlflfwX8jk3WNTwA", // Replace with your Twitter Developer App consumer secret
//       callbackURL: "http://www.herokutestapp3z24.com/auth/twitter/callback", // Replace with your Twitter Developer App callback URL
//       userProfileURL:
//         "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
//     },
//     function(token, tokenSecret, profile, done) {
//       if (profile.emails) {
//         User.findOne({ email: profile.emails[0].value })
//           .select("username active password email")
//           .exec(function(err, user) {
//             if (err) {
//               done(err);
//             } else {
//               if (user && user !== null) {
//                 done(null, user);
//               } else {
//                 done(err);
//               }
//             }
//           });
//       } else {
//         user = {}; // Since no user object exists, create a temporary one in order to return an error
//         user.id = "null"; // Temporary id
//         user.active = true; // Temporary status
//         user.error = true; // Ensure error is known to exist
//         done(null, user); // Serialize and catch error
//       }
//     }
//   )
// );
