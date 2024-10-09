Framework = nil
Utils = {}


if Config.Framework == 'oldesx' then
    TriggerEvent('esx:getSharedObject', function(obj) Framework = obj end)
elseif Config.Framework == 'newesx' then
    Framework = exports["es_extended"]:getSharedObject()
elseif Config.Framework == 'qbcore' then
    Framework = exports['qb-core']:GetCoreObject()
end

function Utils.GetName(src)
    if Config.Framework == 'oldesx' or Config.Framework == 'newesx' then
        local Player = Framework.GetPlayerFromId(src)
        if Player then
            return Player.getName()
        end
    elseif Config.Framework == 'qbcore' then
        local Player = Framework.Functions.GetPlayer(src)
        if Player then
            return Player.PlayerData.charinfo.firstname .. " " .. Player.PlayerData.charinfo.lastname
        end
    end

    return 'Desconocido'
end

function Utils.GetJob(src)
    if Config.Framework == 'oldesx' or Config.Framework == 'newesx' then
        local Player = Framework.GetPlayerFromId(src)
        if Player then
            return Player.job.label
        end
    elseif Config.Framework == 'qbcore' then
        local Player = Framework.Functions.GetPlayer(src)
        if Player then
            return Player.PlayerData.job.label
        end
    end

    return 'Desconocido'
end

function Utils.GetJobName(src)
    if Config.Framework == 'oldesx' or Config.Framework == 'newesx' then
        local Player = Framework.GetPlayerFromId(src)
        if Player then
            return Player.job.name
        end
    elseif Config.Framework == 'qbcore' then
        local Player = Framework.Functions.GetPlayer(src)
        if Player then
            return Player.PlayerData.job.name
        end
    end

    return nil
end

function Utils.GetSecondJob(src)
    if Config.Framework == 'oldesx' or Config.Framework == 'newesx' then
        local Player = Framework.GetPlayerFromId(src)
        if Player and Player.job2 then
            return Player.job2.label
        end
    elseif Config.Framework == 'qbcore' then
        local Player = Framework.Functions.GetPlayer(src)
        if Player and Player.PlayerData.job2 then
            return Player.PlayerData.job2.label
        end
    end

    return nil
end

function Utils.GetMoney(src)
    if Config.Framework == 'oldesx' or Config.Framework == 'newesx' then
        local Player = Framework.GetPlayerFromId(src)
        if Player then
            return Player.getMoney()
        end
    elseif Config.Framework == 'qbcore' then
        local Player = Framework.Functions.GetPlayer(src)
        if Player and Player.PlayerData.job2 then
            return Player.PlayerData.money['cash']
        end
    end

    return nil
end

function Utils.GetBank(src)
    if Config.Framework == 'oldesx' or Config.Framework == 'newesx' then
        local Player = Framework.GetPlayerFromId(src)
        if Player then
            local account = Player.getAccount('bank')
            return account and account.money
        end
    elseif Config.Framework == 'qbcore' then
        local Player = Framework.Functions.GetPlayer(src)
        if Player and Player.PlayerData.job2 then
            return Player.PlayerData.money['bank']
        end
    end

    return nil
end

function Utils.GetBlackMoney(src)
    if Config.Framework == 'oldesx' or Config.Framework == 'newesx' then
        local Player = Framework.GetPlayerFromId(src)
        if Player then
            local account = Player.getAccount('black_money')
            return account and account.money
        end
    elseif Config.Framework == 'qbcore' then
        local Player = Framework.Functions.GetPlayer(src)
        if Player and Player.PlayerData.job2 then
            return Player.PlayerData.money['black_money']
        end
    end

    return nil
end

function Utils.GetVIPMoney(src)
    if Config.Framework == 'oldesx' or Config.Framework == 'newesx' then
        local Player = Framework.GetPlayerFromId(src)
        if Player then
            local account = Player.getAccount('vip')
            return account and account.money
        end
    elseif Config.Framework == 'qbcore' then
        local Player = Framework.Functions.GetPlayer(src)
        if Player then
            return Player.PlayerData.money['vip']
        end
    end

    return nil
end

function Utils.GetNumPlayers()
    return #GetPlayers()
end

function Utils.GetMaxPlayers()
    return GetConvar("sv_maxClients", 0)
end

Jobs = {}

RegisterNetEvent('tm1_pausemenu:playerLoaded', function()
    Jobs[source] = Utils.GetJobName(source)
end)

RegisterNetEvent('tm1_pausemenu:jobChanged', function()
    Jobs[source] = Utils.GetJobName(source)
end)

AddEventHandler('playerDropped', function()
    Jobs[source] = nil
end)

function Utils.GetJobCount(name)
    local count = 0

    for i,v in pairs(Jobs) do
        if v == name then
            count = count + 1
        end
    end

    return count
end