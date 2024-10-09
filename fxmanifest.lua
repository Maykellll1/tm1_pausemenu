fx_version 'cerulean'
games { 'rdr3', 'gta5' }

author 'Miguel Reyes'
description 'Interfaz system resource'
version '1.0.0'

lua54 'yes'

client_scripts {
    'config.lua',
    'client/*.lua'
}

server_scripts {
    'config.lua',
    'server/utils.lua',
    'server/main.lua',
}

ui_page 'web/build/index.html'

escrow_ignore {
    'config.lua',
    'server/utils.lua',
    'server/main.lua',
}

files {
    'web/build/*.html',
    'web/build/assets/*.css',
    'web/build/assets/*.js',
    'web/build/audio/*.wav',
    'web/build/audio/*.m4a',
    'web/build/audio/*.mp3',
    'web/build/*.svg',
    'web/build/*.png',
    'web/build/*.jpg',
    'web/build/*.m4a',
    'web/build/*.mp3',
}