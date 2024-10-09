Config = {}

Config.Framework = 'newesx' --newesx, oldesx, qbcore, custom

Config.Lenguage = 'en'
Config.DiscordURL = 'https://www.discord.com'
Config.Youtube = 'https://www.youtube.com'
Config.Instagram = 'https://www.instagram.com'
Config.X = 'https://www.twitter.com'
Config.WebSite = 'myWebsite.com'

Config.ByeMSG = 'Gracias por jugar a nuestro servidor'

--Number is the min of players with that job to be avalible
--To remove one of that in the hud, only put in false.
Config.JobsEnabled = {
    ['police'] = 1,
    ['ambulance'] = 1,
    ['mechanic'] = 1,
}

Config.EnableAnim = true
Config.DisarmPlayer = true
Config.Animation = {
    "amb@code_human_in_bus_passenger_idles@female@tablet@idle_a",
    "idle_a",
    "Tablet 2",
    AnimationOptions = {
        Prop = "prop_cs_tablet",
        PropBone = 28422,
        PropPlacement = {
            -0.05,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0
        },
        EmoteLoop = true,
        EmoteMoving = true
    }
}

Config.Locale = {}

Config.Locale['en'] = {
    cashMoney= 'Cash Money',
    bankMoney= 'Bank Money',
    blackMoney= 'Black Money',
    vipMoney= 'VIP Money',
    map= 'Map',
    settings= 'Settings',
    discord= 'Discord',
    cancel= 'Cancel',
    exit= 'Exit',
    playersOnline= 'Players online',
    ems= 'EMS',
    police= 'Police',
    mechanic= 'Mechanic',
    exitMsg= 'Are you sure your want to exit the game?',
    bindings = 'Bindings',
    allowed = 'Avaliable',
    not_allowed = 'Not avalible'
}

Config.Locale['es'] = {
    cashMoney= 'Dinero',
    bankMoney= 'Dinero de banco',
    blackMoney= 'Dinero sucio',
    vipMoney= 'VIP Coins',
    map= 'Mapa',
    settings= 'Ajustes',
    discord= 'Discord',
    cancel= 'Cancelar',
    exit= 'Salir',
    playersOnline= 'Jugadores online',
    ems= 'EMS',
    police= 'Policía',
    mechanic= 'Mecánico',
    exitMsg= '¿Estás seguro de que quieres salir del juego?',
    bindings = 'Bindeos',
    allowed = 'Disponible',
    not_allowed = 'No disponible'
}