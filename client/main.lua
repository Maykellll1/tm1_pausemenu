X = {}
X.Open = false
PlayerProps = {}

RegisterNetEvent("esx:playerLoaded", function()
    TriggerServerEvent('tm1_pausemenu:playerLoaded')
end)

RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    TriggerServerEvent('tm1_pausemenu:playerLoaded')
end)

RegisterNetEvent("esx:setJob", function(Job)
    TriggerServerEvent('tm1_pausemenu:jobChanged')
end)

RegisterNetEvent("QBCore:Server:OnJobUpdate", function()
    TriggerServerEvent('tm1_pausemenu:jobChanged')
end)

AddEventHandler('onResourceStart', function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then
      return
    end
    TriggerServerEvent('tm1_pausemenu:playerLoaded')
end)  

RegisterNetEvent('tm1_pausemenu:requestedData', function(data)

    data.locale = Config.Locale[Config.Lenguage]

    local data = {
        action = 'getData',
        data = data
    }

    local data2 = {
        action = 'togglePauseMenu',
        data = {
            enabled = true
        }
    }

    OnEmotePlay(Config.Animation)
    TriggerScreenblurFadeIn(200)
    SetNuiFocus(true, true)
    SendNuiMessage(json.encode(data))
    SendNuiMessage(json.encode(data2))
end)

function SwitchPM(source, args, rawCommand)

    if IsPauseMenuActive() then return end

    X.Open = not X.Open

    if X.Open then
        TriggerServerEvent('tm1_pausemenu:requestData')
    else
        local data = {
            action = 'togglePauseMenu'
        }
    
        SetNuiFocus(false, false)
        SendNuiMessage(json.encode(data))
    end
end

RegisterCommand('switchpm', SwitchPM, false)

RegisterKeyMapping('switchpm', 'Switch Pause Menu', 'keyboard', 'ESCAPE')

RegisterNuiCallback('openLink', function(data)
    local url = data

    SendNuiMessage(json.encode({
        action = 'openUrl',
        data = {
            url = url
        }
    }))
end)

RegisterNuiCallback('closeUI', function(data)
    EmoteCancel()
    TriggerScreenblurFadeOut(200)
    SetNuiFocus(false, false)
    X.Open = false
end)

RegisterNuiCallback('openMap', function(data)
    local data = {
        action = 'togglePauseMenu',
        data = {
            enabled = false
        }
    }

    EmoteCancel()
    TriggerScreenblurFadeOut(200)
    SetNuiFocus(false, false)
    SendNuiMessage(json.encode(data))

    X.Open = false

    ActivateFrontendMenu(GetHashKey('FE_MENU_VERSION_MP_PAUSE'), 0, -1)
end)

RegisterNuiCallback('openSettings', function(data)
    local data = {
        action = 'togglePauseMenu',
        data = {
            enabled = false
        }
    }

    EmoteCancel()
    TriggerScreenblurFadeOut(200)
    SetNuiFocus(false, false)
    SendNuiMessage(json.encode(data))
    X.Open = false

    ActivateFrontendMenu(-1031775802, 0, 0)
end)

RegisterNuiCallback('openBindings', function(data)
    local data = {
        action = 'togglePauseMenu',
        data = {
            enabled = false
        }
    }

    EmoteCancel()
    TriggerScreenblurFadeOut(200)
    SetNuiFocus(false, false)
    SendNuiMessage(json.encode(data))

    X.Open = false

    ActivateFrontendMenu(GetHashKey('FE_MENU_VERSION_LANDING_KEYMAPPING_MENU'), 0, 0)
end)

RegisterNuiCallback('exit', function(data)
    TriggerServerEvent('tm1_pausemenu:disconnect')
end)

Citizen.CreateThread(function()
	while true do
        Citizen.Wait(0)
        SetPauseMenuActive(false)
	end
end)

function OnEmotePlay(EmoteName, textureVariation)
    if not Config.EnableAnim then return end
    
    InVehicle = IsPedInAnyVehicle(PlayerPedId(), true)
	Pointing = false

    if not DoesEntityExist(PlayerPedId()) then
        return false
    end

    ChosenDict, ChosenAnimation, ename = table.unpack(EmoteName)
    ChosenAnimOptions = EmoteName.AnimationOptions
    AnimationDuration = -1

    if ChosenDict == "Expression" then
        SetFacialIdleAnimOverride(PlayerPedId(), ChosenAnimation, 0)
        return
    end

    if Config.DisarmPlayer then
        if IsPedArmed(PlayerPedId(), 7) then
            SetCurrentPedWeapon(PlayerPedId(), joaat('WEAPON_UNARMED'), true)
        end
    end

    if PlayerHasProp then
        DestroyAllProps()
    end

    if ChosenDict == "MaleScenario" or "Scenario" then
        CheckGender()
        if ChosenDict == "MaleScenario" then if InVehicle then return end
            if PlayerGender == "male" then
                ClearPedTasks(PlayerPedId())
                TaskStartScenarioInPlace(PlayerPedId(), ChosenAnimation, 0, true)
                IsInAnimation = true
                RunAnimationThread()
            end
            return
        elseif ChosenDict == "ScenarioObject" then if InVehicle then return end
            BehindPlayer = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 0 - 0.5, -0.5);
            ClearPedTasks(PlayerPedId())
            TaskStartScenarioAtPosition(PlayerPedId(), ChosenAnimation, BehindPlayer['x'], BehindPlayer['y'], BehindPlayer['z'], GetEntityHeading(PlayerPedId()), 0, 1, false)
            IsInAnimation = true
            RunAnimationThread()
            return
        elseif ChosenDict == "Scenario" then if InVehicle then return end
            ClearPedTasks(PlayerPedId())
            TaskStartScenarioInPlace(PlayerPedId(), ChosenAnimation, 0, true)
            IsInAnimation = true
            RunAnimationThread()
            return
        end
    end

    if EmoteName.AnimationOptions and EmoteName.AnimationOptions.StartDelay then
        Wait(EmoteName.AnimationOptions.StartDelay)
    end

    if not LoadAnim(ChosenDict) then
        return
    end

    if EmoteName.AnimationOptions then
        if EmoteName.AnimationOptions.EmoteLoop then
            MovementType = 1
            if EmoteName.AnimationOptions.EmoteMoving then
                MovementType = 51 -- 110011
            end

        elseif EmoteName.AnimationOptions.EmoteMoving then
            MovementType = 51 -- 110011
        elseif EmoteName.AnimationOptions.EmoteMoving == false then
            MovementType = 0
        elseif EmoteName.AnimationOptions.EmoteStuck then
            MovementType = 50 -- 110010
        end

    else
        MovementType = 0
    end

    if InVehicle == 1 then
        MovementType = 51
    end

    if EmoteName.AnimationOptions then
        if EmoteName.AnimationOptions.EmoteDuration == nil then
            EmoteName.AnimationOptions.EmoteDuration = -1
            AttachWait = 0
        else
            AnimationDuration = EmoteName.AnimationOptions.EmoteDuration
            AttachWait = EmoteName.AnimationOptions.EmoteDuration
        end

        if EmoteName.AnimationOptions.PtfxAsset then
            PtfxAsset = EmoteName.AnimationOptions.PtfxAsset
            PtfxName = EmoteName.AnimationOptions.PtfxName
            if EmoteName.AnimationOptions.PtfxNoProp then
                PtfxNoProp = EmoteName.AnimationOptions.PtfxNoProp
            else
                PtfxNoProp = false
            end
            Ptfx1, Ptfx2, Ptfx3, Ptfx4, Ptfx5, Ptfx6, PtfxScale = table.unpack(EmoteName.AnimationOptions.PtfxPlacement)
            PtfxBone = EmoteName.AnimationOptions.PtfxBone
            PtfxColor = EmoteName.AnimationOptions.PtfxColor
            PtfxInfo = EmoteName.AnimationOptions.PtfxInfo
            PtfxWait = EmoteName.AnimationOptions.PtfxWait
            PtfxCanHold = EmoteName.AnimationOptions.PtfxCanHold
            PtfxNotif = false
            PtfxPrompt = true
            -- RunAnimationThread() -- ? This call should not be required, see if needed with tests

            TriggerServerEvent("rpemotes:ptfx:sync", PtfxAsset, PtfxName, vector3(Ptfx1, Ptfx2, Ptfx3), vector3(Ptfx4, Ptfx5, Ptfx6), PtfxBone, PtfxScale, PtfxColor)
        else
            PtfxPrompt = false
        end
    end

    TaskPlayAnim(PlayerPedId(), ChosenDict, ChosenAnimation, 5.0, 5.0, AnimationDuration, MovementType, 0, false, false, false)
    RemoveAnimDict(ChosenDict)
    IsInAnimation = true
    RunAnimationThread()
    MostRecentDict = ChosenDict
    MostRecentAnimation = ChosenAnimation
	
    if EmoteName.AnimationOptions then
        if EmoteName.AnimationOptions.Prop then
            PropName = EmoteName.AnimationOptions.Prop
            PropBone = EmoteName.AnimationOptions.PropBone
            PropPl1, PropPl2, PropPl3, PropPl4, PropPl5, PropPl6 = table.unpack(EmoteName.AnimationOptions.PropPlacement)
            if EmoteName.AnimationOptions.SecondProp then
                SecondPropName = EmoteName.AnimationOptions.SecondProp
                SecondPropBone = EmoteName.AnimationOptions.SecondPropBone
                SecondPropPl1, SecondPropPl2, SecondPropPl3, SecondPropPl4, SecondPropPl5, SecondPropPl6 = table.unpack(EmoteName
                    .AnimationOptions.SecondPropPlacement)
                SecondPropEmote = true
            else
                SecondPropEmote = false
            end
            Wait(AttachWait)
            if not AddPropToPlayer(PropName, PropBone, PropPl1, PropPl2, PropPl3, PropPl4, PropPl5, PropPl6, textureVariation) then return end
            if SecondPropEmote then
                if not AddPropToPlayer(SecondPropName, SecondPropBone, SecondPropPl1, SecondPropPl2, SecondPropPl3,
                    SecondPropPl4, SecondPropPl5, SecondPropPl6, textureVariation) then 
                    DestroyAllProps()
                    return 
                end
            end
        end
    end
end

function DestroyAllProps()
    for _, v in pairs(PlayerProps) do
        DeleteEntity(v)
    end
    PlayerHasProp = false
end

function CheckGender()
    local hashSkinMale = joaat("mp_m_freemode_01")
    local hashSkinFemale = joaat("mp_f_freemode_01")

    if GetEntityModel(PlayerPedId()) == hashSkinMale then
        PlayerGender = "male"
    elseif GetEntityModel(PlayerPedId()) == hashSkinFemale then
        PlayerGender = "female"
    end
end

function RunAnimationThread()
    if AnimationThreadStatus then return end
    AnimationThreadStatus = true
    CreateThread(function()
        local sleep
        while AnimationThreadStatus and (IsInAnimation or PtfxPrompt) do
            sleep = 500

            if IsInAnimation then
                sleep = 0
                if IsPedShooting(PlayerPedId()) then
                    EmoteCancel()
                end
            end

            if PtfxPrompt then
                sleep = 0
                if not PtfxNotif then
                    SimpleNotify(PtfxInfo)
                    PtfxNotif = true
                end
                if IsControlPressed(0, 47) then
                    PtfxStart()
                    Wait(PtfxWait)
                    if PtfxCanHold then
                        while IsControlPressed(0, 47) and IsInAnimation and AnimationThreadStatus do
                            Wait(5)
                        end
                    end
                    PtfxStop()
                end
            end

            Wait(sleep)
        end
    end)
end

function LoadAnim(dict)
    if not DoesAnimDictExist(dict) then
        return false
    end

    while not HasAnimDictLoaded(dict) do
        RequestAnimDict(dict)
        Wait(10)
    end

    return true
end

function LoadPropDict(model)
    while not HasModelLoaded(joaat(model)) do
        RequestModel(joaat(model))
        Wait(10)
    end
end

function AddPropToPlayer(prop1, bone, off1, off2, off3, rot1, rot2, rot3, textureVariation)
    local Player = PlayerPedId()
    local x, y, z = table.unpack(GetEntityCoords(Player))

    if not HasModelLoaded(prop1) then
        LoadPropDict(prop1)
    end

    prop = CreateObject(joaat(prop1), x, y, z + 0.2, true, true, true)
    if textureVariation ~= nil then
        SetObjectTextureVariation(prop, textureVariation)
    end
    AttachEntityToEntity(prop, Player, GetPedBoneIndex(Player, bone), off1, off2, off3, rot1, rot2, rot3, true, true,
        false, true, 1, true)
    table.insert(PlayerProps, prop)
    PlayerHasProp = true
    SetModelAsNoLongerNeeded(prop1)
    return true
end

function EmoteCancel(force)
    if not Config.EnableAnim then return end

    local ply = PlayerPedId()

    if ChosenDict == "MaleScenario" and IsInAnimation then
        ClearPedTasksImmediately(ply)
        IsInAnimation = false
    elseif ChosenDict == "Scenario" and IsInAnimation then
        ClearPedTasksImmediately(ply)
        IsInAnimation = false
    end

    PtfxNotif = false
    PtfxPrompt = false
	Pointing = false

    if IsInAnimation then
        DetachEntity(ply, true, false)
        DestroyAllProps()

        ClearPedTasks(ply)
        IsInAnimation = false
    end
    AnimationThreadStatus = false
end