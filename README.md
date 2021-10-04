## Elder Drake
This is a Discord bot that fetches information about the game League of Legends.

It is built in TypeScript and hosted on Heroku. 

The API we are using to fetch this information is hosted by Meraki Analytics, considering the offical League of Legends API is considered defunct by it's own creators. (lol)
## Commands
* `!elder [champion name]`

Returns general champion info like lore, role, price, splash image, damage types, and soforth. 
* `!elder [champion name] [ability code (q, w, r, etc)]`

Returns the specified champion's ability information, including any details or notes by the developers.
* `!elder [champion name] skins`

Returns a list of all of the released skins for the specified champion.
* `!elder [champion name] skins [skin name]`

Returns an image and information on the specified champion's specified skin. Includes lore, image, chroma names (if any), and price.

* `!elder [champion name] skins [skin name] chroma [chroma name]`

Returns an image and lore on the specified champion's specified skin's specified chroma. (Whew!)
* `!elder [item name]`

Returns the most updated information on the specified item, including build paths, price, and stats. (Not yet implemented)


## FAQ
> Why doesn't this just display all skins/chromas of a specific champion?

Discord only allows one image per message. 

Technically, I ***could*** show all images but in cases of Riot Babies™ like Ezreal or Lux, that's over 20 individual messages of images.

I don't think anyone wants that many new message pings in their server.   

**To Add:** Prehaps I will add a nice command to do so? If there is a demand. :^)

> Why can't I get a skin by just asking for something like "Spirit Blossom Thresh" instead of "thresh skins spirit blossom"?

I'm considering adding this, but for now, the latter command is what works.

Reason being, each champion holds its own list of skins. With the message "Spirit Blossom Thresh" the bot would have to search the message for any words that match champion names, which means it'll have to have a list of champion names on hand to check each word for. There are hundreds of champion in LoL, not to mention some with weird names with spaces, puncuation, etc. Then, it would have to search through that champion's skins and see if any match the rest of the words in the message. It gets even more complicated once chromas are thrown in the mix!

Not to say it isn't technically possible, it's just more work than I'm willing to put in at the current time.

*Do you want to build this feature? Make a [pull request](https://github.com/myumi/elder-drake/compare).*

> Can you add [some feature, some extra info, etc]?

Probably. If it's not already listed on my task list, open an issue and I'll consider it.

Or, if you're a developer, feel free to *make a [pull request](https://github.com/myumi/elder-drake/compare)*.

> I encountered an error/weird bug!

Oh no!

Well, first make sure your message is free from typos and follows the syntax of commands listed above.

If it does, open an issue on this repo  with as much information as you can (command sent, message received, error, expected behavior, etc) and I'll look into it.
## Task List
**FIXES**
* fix how abilities are parsed from message
* fix messages with message length problem
* make notes an optional field

**FEATURES**
* add item search
* add help command to show possible commands
* create a new command to display images of all skins/chromas
  * make champ info shopw all skins by default
  * make command "champ name skins" prompt user (react with emoji) if they actually want to see all skins with the amount of messages that will be sent
  * if prompt accepted, send multiple messages of skin info

**CONSIDER**
* making the skin/chroma search command more clear
  * consider generating a type from champion names in order to do the above
  * seems like a bad idea... kind of want to bot to manage itself... but items will be doing something similar so idk yet
* fuzzy search?

#### Notes
Compile with `tsc bot.ts`.
This will generate the compiled .js files.