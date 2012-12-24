var program = require("commander");
var OAuth = require("oauth").OAuth;
var _ = require("underscore");

var YAHOO_CONSUMER_KEY = "dj0yJmk9aG1FcmV6azdKTUFCJmQ9WVdrOWJHNXVhV3MzTnpZbWNHbzlNVGt6TmpFMk5UazJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD0yNg--";
var YAHOO_CONSUMER_SECRET = "d0ffbe32db5fc50ac6fd5b469926575d45a3c4a7";

var yahoo;
var req_token = "qhfj2tp";
var req_secret = "ebd84a2221ed35953b868dfbb8176635f4b5564d";
var code = "kkrdvc";
var access_token = "A=3qiEg.TO5zokkv_DqIJKLZP6nOtOkOXyK171.5J6aIwVDTqMYtPPCHDJkTR_0ZjaCnRhqY7YOLVvvT03CwYnT5U0KfU5tJshs649ZVYoyun6_qJjcZtUSwM5WX6m15zAAHhlg5A0TeD91aYMJADyD2X.lJjttK0d5PFVIkQDkT41yo6Vd9PQTvlIK3h6xVaHXQNwKqYsqY5OwsiUV3IE7WOl4JZd6DUm7YhTBGqdPa7usFf.X5QZ9qfVGCQkq0tXNJwIu.3mB30aXoSw4VmbRm1Ijiysstwvewz3VUvBZva1mBygJBRn8n_H81fmaPCPq7hxzHei8XL4aInBbNcDAnlWYhUPMyx_N.BRdpi0g8Wv_cz38Ca_6mYEFjiDvXcQLx1msZ48T90FRn_plazgqxD8YeLlntuJiWqMotEoONFoDvytlifTmuoEcChXbjXOpnLswWtR.La_i6Rjy6kt70h_WTtGynqqI28ap1fNfFeXzn3jVHbf26E36ZGu_2yXthJh0i31HzJzegfdXDQT_FGlbuxRumv9uEvljVKB9viGm.gSz.h_MG4jg_RA3xPsEJ6.rMViSSN355Za0KN3hqH1LbOSbGj0MinpssCWdaMCDgX3HCMRQZUn3Mvd_s3gNQ44UlzeUQOTJ5gqAEtJQhch5Gtc0C3LVFeXCiZqsTn36Nozd2bYkIzbVmoEaRR_2Nn4Sf7k8sTKVVgq.L0ByXk4mXjBn1m9Tuq8ckjGFuQs6bbaCqQJtn0pgHoTlBfDODnQeSx8mqCM2tT67M7SrqJPraF6_PLvl.jrd3X2VJxZOcpfTNR6QQNpOu4AUDQuQayfdG_RISFqqDMOnOo-";
var access_secret = "10d33b301dbb4f60abb0b21594dccd904b5b9ce8";

initialize();

program
    .version('0.0.1')
    .option('-d, --debug', 'debug mode');

program
    .command("getRequestToken")
    .action(function () {
        yahoo.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
            if (error) {
                console.log(error);
            }
            else {
                req_token = oauth_token;
                req_secret = oauth_token_secret;

                console.log(req_token);
                console.log(req_secret);
                console.log("https://api.login.yahoo.com/oauth/v2/request_auth?oauth_token=" + req_token);
            }
        });
    });

program
    .command("getAccessToken")
    .action(function () {
        yahoo.getOAuthAccessToken(req_token, req_secret, code,
            function (error, oauth_access_token, oauth_access_token_secret, results) {
                if (error) {
                    console.log(error);
                } else {
                    access_token = oauth_access_token;
                    access_secret = oauth_access_token_secret;
                    console.log(access_token);
                    console.log(access_secret);
                    console.log(results);

                    yahoo.getOAuthAccessToken(access_token, access_secret,
                        function (error, oauth_access_token, oauth_access_token_secret, results) {
                            if (error) {
                                console.log(error);
                            } else {
                                access_token = oauth_access_token;
                                access_secret = oauth_access_token_secret;
                                console.log(access_token);
                                console.log(access_secret);
                                console.log(results);
                            }
                        }
                    );
                }
            }
        );
    });

program
    .command("refreshAccessToken")
    .action(function () {
        yahoo.getOAuthAccessToken(access_token, access_secret,
            function (error, oauth_access_token, oauth_access_token_secret, results) {
                if (error) {
                    console.log(error);
                } else {
                    access_token = oauth_access_token;
                    access_secret = oauth_access_token_secret;
                    console.log(access_token);
                    console.log(access_secret);
                    console.log(results);
                }
            }
        );
    });

program
    .command("user")
    .action(function () {
        yahoo.get("http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1?format=json",access_token,access_secret,function(error,response)
        {
            if (error) {
                console.log(error);
            } else {
                var results = JSON.parse(response);
                console.dir(results);
            }
        })
    });

program
    .command("teams")
    .action(function () {
        yahoo.get("http://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games?format=json",access_token,access_secret,function(error,response)
        {
            if (error) {
                console.log(error);
            } else {
                var results = JSON.parse(response);
                var games = results["fantasy_content"]["users"]["0"]["user"][1]["games"];
                games = _.values(games);

                games.forEach(function(game)
                {
                    console.dir(ga);
                })
            }
        })
    });

program.parse(process.argv);


function initialize() {
    yahoo = new OAuth(
        "https://api.login.yahoo.com/oauth/v2/get_request_token",
        "https://api.login.yahoo.com/oauth/v2/get_token",
        YAHOO_CONSUMER_KEY, YAHOO_CONSUMER_SECRET, "1.0", undefined, "HMAC-SHA1", undefined)
}
