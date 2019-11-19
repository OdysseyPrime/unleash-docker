'use strict';

/**
 * Google OAath 2.0
 *
 * You should read Using OAuth 2.0 to Access Google APIs:
 * https://developers.google.com/identity/protocols/OAuth2
 *
 * This example assumes that all users authenticating via
 * google should have access. You would proably limit access
 * to users you trust.
 *
 * The implementation assumes the following environement variables:
 *
 *  - GOOGLE_CLIENT_ID
 *  - GOOGLE_CLIENT_SECRET
 *  - GOOGLE_CALLBACK_URL
 */

const  { User, AuthenticationRequired } = require('unleash-server');

const passport = require('@passport-next/passport');
const GoogleOAuth2Strategy = require('@passport-next/passport-google-oauth2')
  .Strategy;

passport.use(
    new GoogleOAuth2Strategy(
        {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
        },
        (accessToken, refreshToken, profile, done) => {
            const domain = profile._json.hd
            if(domain === "odysseyprime.nl" || domain === "goprime.io") {
                done(null,
                    new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                    })
                );
            } else {
                // fail        
                done(new Error("Invalid host domain"));
            }
        }
    )
);

function enableGoogleOauth(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
    app.get('/api/admin/login', passport.authenticate('google'));

    app.get(
        '/api/auth/callback',
        passport.authenticate('google', {
            failureRedirect: '/api/admin/error-login',
        }),
        (req, res) => {
            // Successful authentication, redirect to your app.
            res.redirect('/');
        }
    );

    app.use('/api/admin/', (req, res, next) => {
        if (req.user) {
            next();
        } else {
            // Instruct unleash-frontend to pop-up auth dialog
            return res
                .status('401')
                .json(
                    new AuthenticationRequired({
                        path: '/api/admin/login',
                        type: 'custom',
                        message: `You have to identify yourself in order to use Unleash. 
                        Click the button and follow the instructions.`,
                    })
                )
                .end();
        }
    });
}

module.exports = enableGoogleOauth;