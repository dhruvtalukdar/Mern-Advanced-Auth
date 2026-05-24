import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserRepository from "../repositories/user.repository.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				// Check if user already exists with this Google ID
				let user = await UserRepository.findOne({ googleId: profile.id });

				if (user) {
					user.lastLogin = new Date();
					await UserRepository.save(user);
					return done(null, user);
				}

				// Check if user exists with same email
				user = await UserRepository.findOne({ email: profile.emails[0].value });

				if (user) {
					// Link Google account to existing user
					user.googleId = profile.id;
					user.isVerified = true;
					user.avatar = user.avatar || profile.photos[0]?.value || "";
					user.lastLogin = new Date();
					await UserRepository.save(user);
					return done(null, user);
				}

				// Create new user
				user = await UserRepository.create({
					googleId: profile.id,
					email: profile.emails[0].value,
					name: profile.displayName,
					avatar: profile.photos[0]?.value || "",
					isVerified: true,
				});

				return done(null, user);
			} catch (error) {
				return done(error, null);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, UserRepository.getId(user));
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await UserRepository.findById(id);
		done(null, user);
	} catch (error) {
		done(error, null);
	}
});

export default passport;
