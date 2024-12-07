RegisterNetEvent('tm1_pausemenu:requestData', function()
    local data = {
        action = 'openNUI',
        data = {
            playerName = Utils.GetName(source),
            job = Utils.GetJob(source),
            secondaryJob = Utils.GetSecondJob(source),
            cashMoney= Utils.GetMoney(source),
            bankMoney= Utils.GetBank(source),
            blackMoney= Utils.GetBlackMoney(source),
            vipMoney= Utils.GetVIPMoney(source),
            playersOnline= Utils.GetNumPlayers(),
            playersMax= Utils.GetMaxPlayers(),
            policeState= Config and Config.JobsEnabled and Config.JobsEnabled['police'] and (Utils.GetJobCount('police') >= Config.JobsEnabled['police'] and Config.Locale[Config.Lenguage].allowed or Config.Locale[Config.Lenguage].not_allowed) or nil,
            emsState= Config and Config.JobsEnabled and Config.JobsEnabled['ambulance'] and (Utils.GetJobCount('ambulance') >= Config.JobsEnabled['ambulance'] and Config.Locale[Config.Lenguage].allowed or Config.Locale[Config.Lenguage].not_allowed) or nil,
            mechanicState= Config and Config.JobsEnabled and Config.JobsEnabled['mechanic'] and (Utils.GetJobCount('mechanic') >= Config.JobsEnabled['mechanic'] and Config.Locale[Config.Lenguage].allowed or Config.Locale[Config.Lenguage].not_allowed) or nil,
            discordURL= Config.DiscordURL,
            website = Config.WebSite,
            youtubeURL = Config.Youtube,
            twitterURL = Config.X,
            instagramURL = Config.Instagram
      }
    }

    TriggerClientEvent('tm1_pausemenu:requestedData', source, data)
end)

RegisterNetEvent('tm1_pausemenu:disconnect', function()
    DropPlayer(source, Config.ByeMSG)
end)