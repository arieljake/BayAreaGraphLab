


// [-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z\{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
// var urlRegex = new RegExp(//);

var retweetPatterns = new RegExp(/(RT|via)\s(\@\w+)/i);

var TweetFunctions = module.exports =
{
    getRetweetSources: function(text)
    {
        return retweetPatterns.exec(text);
    },

    getUrlsFromParts: function(parts)
    {
        return getTokensWhich(parts,function(elem)
        {
            return elem.indexOf(".") >= 0 && elem.indexOf("/") >= 0;
        });
    },

    getAtRefsFromParts: function(parts)
    {
        return getTokensWhich(parts,function(elem)
        {
            return elem.indexOf("@") == 0;
        });
    },

    getHashesFromParts: function(parts)
    {
        return getTokensWhich(parts,function(elem)
        {
            return elem.indexOf("#") == 0;
        },function(elem)
        {
            return "#" + /\w+/.exec(elem)[0];
        });
    }
}

function getTokensWhich(parts,test,valFxn)
{
    var refs = [];
    var val;

    parts.forEach(function(elem,index)
    {
        if (test(elem) == true)
        {
            if (valFxn)
                val = valFxn(elem);
            else
                val = elem;

            refs.push(val);
        }
    })

    return refs;
}