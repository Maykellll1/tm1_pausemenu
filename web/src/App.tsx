import { useCallback, useEffect, useState } from 'react'
import './App.scss'
import logo from '/logo.png';
import useNuiEvent from './hooks/useNuiEvents'
import hoverSound from '/audio/hover.wav';
import clickSound from '/audio/click.wav';
import backgroundMusic from '/audio/background.mp3';
import { fetchNui } from './utils/fetchNui';
import FadeInMusic from './components/fadeIn';

function App() {
  const [paused, setPaused] = useState<boolean>(false);
  const [exitPopup, setExitPopup] = useState<boolean>(false);
  
  const [data, setData] = useState({
    action: 'klk',
    data: {
      playerName: 'Johnny',
      job: 'Police',
      secondaryJob: null,
      cashMoney: 1456,
      bankMoney: 25000,
      blackMoney: 500000,
      vipMoney: null,
      discordURL: 'https://www.discord.com',
      playersOnline: '150',
      playersMax: '200',
      policeState: 'available',
      emsState: 'not available',
      mechanicState: 'available',
      website: 'myWebsite.com',
      youtubeURL: 'https://www.youtube.com',
      twitterURL: 'https://www.twitter.com',
      instagramURL: 'https://www.instagram.com'
    },
    locale: {
      cashMoney: 'Cash Money',
      bankMoney: 'Bank Money',
      blackMoney: 'Black Money',
      vipMoney: 'VIP Money',
      map: 'Map',
      settings: 'Settings',
      discord: 'Discord',
      cancel: 'Cancel',
      exit: 'Exit',
      playersOnline: 'Players online',
      ems: 'EMS',
      police: 'Police',
      mechanic: 'Mechanic',
      exitMsg: 'Are you sure your want to exit the game?',
      bindings: 'Bindings'
    }
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPaused(false);
        fetchNui('closeUI', {});
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (paused) {
      playBackgroundMusic();
    } else {
      decreaseBackgroundMusic();
    }

    let root = document.getElementById('root');

    if (root) {
      if (paused) {
        root.className = 'rootFadeIn';
      } else {
        root.className = 'rootFadeOut';
      }
    }

    let container = document.getElementById('mainContainer');

    if (container) {
      if (paused) {
        container.className = 'main-container containerFadeIn';
      } else {
        container.className = 'main-container containerFadeOut';
      }
    }

    setExitPopup(false);
  }, [paused]);
  
  const [lastSounded, setLastSounded] = useState<number>(0);
  const [audio, setAudio] = useState<HTMLAudioElement>();

  const playHoverSound = () => {
    if((Date.now() - lastSounded) < 100) return setLastSounded(Date.now());

    setLastSounded(Date.now());
    new Audio(hoverSound).play();
  }

  const playBackgroundMusic = useCallback(() => {
    console.log('empiezp')
    let audio = new Audio(backgroundMusic);
    setAudio(audio)

    audio.volume = 0.0;
    audio.play();

    const interval = setInterval(() => {
      if(paused == false) {
        return;
      }
      if(audio.volume + 0.01 < 0.1) {
        audio.volume += 0.01;
      }
    }, 15000 / 100); // Increment volume over the given duration

    return () => clearInterval(interval);
  }, [paused, audio]);

  const decreaseBackgroundMusic = useCallback(() => {
    audio && audio.pause();
    // const interval = setInterval(() => {
    //   console.log(audio)
    //   if(paused == false) {
    //     return;
    //   }
      
    //   if(audio && audio.volume - 0.01 > 0) {
    //     audio.volume -= 0.01;
    //   }
    // }, 15000 / 100); // Increment volume over the given duration

    // return () => clearInterval(interval);
  }, [paused, audio]);

  const playClickSound = () => {
    new Audio(clickSound).play();
  }

  const openInNewTab = (url: string) => {
    fetchNui('openLink', url);
  };

  const handleMapClick = () => {
    fetchNui('openMap', {});
  };

  const handleSettingsClick = () => {
    fetchNui('openSettings', {});
  };

  const handleBindingsClick = () => {
    fetchNui('openBindings', {});
  };

  const handleExitClick = () => {
    fetchNui('exit', {});
  };

  useNuiEvent('togglePauseMenu', (data) => {
    setPaused(data.enabled);
  });

  useNuiEvent('getData', (data) => {
    setData(data);
  });

  return (
    <>
      <section className={`exit-popup-container ${exitPopup ? 'rootFadeIn' : 'exit-hide'}`}>
        <div className="exit-popup-content">
          <span id="exit-text">{data.locale.exitMsg}</span>
          <div className="exit-popup-btns">
            <button className="cancel-btn"
              onMouseEnter={() => playHoverSound()}
              onClick={() => {
                playClickSound();
                setExitPopup(false);
              }}>{data.locale.cancel}
            </button>
            <button className="exit-btn"
              onMouseEnter={() => playHoverSound()}
              onClick={() => {
                playClickSound();
                handleExitClick();
              }}>{data.locale.exit}
            </button>
          </div>
        </div>
      </section>
      <section className="main-container" id="mainContainer">
        <div className="top">
          <span id="player-name">
            {data.data.playerName}
          </span>
          <div className="jobs-list">
            <div className="job-card">
              <span>{data.data.job}</span>
            </div>
            {
              data.data.secondaryJob != undefined ? (
                <div className="job-card secondary">
                  <span>{data.data.secondaryJob}</span>
                </div>
              ) : null
            }
          </div>
          <div className="bottom-row">
            {
              data.data.cashMoney != undefined ? (
                <div className="info-card cash">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 26 26"><path fill="currentColor" d="M16.688 0c-.2.008-.393.044-.594.094L2.5 3.406C.892 3.8-.114 5.422.281 7.031l1.906 7.782A2.99 2.99 0 0 0 4 16.875V15c0-2.757 2.243-5 5-5h12.594l-1.875-7.719A3.004 3.004 0 0 0 16.687 0zm1.218 4.313l.813 3.406l-3.375.812l-.844-3.375zM9 12c-1.656 0-3 1.344-3 3v8c0 1.656 1.344 3 3 3h14c1.656 0 3-1.344 3-3v-8c0-1.656-1.344-3-3-3zm0 1.594h14c.771 0 1.406.635 1.406 1.406v1H7.594v-1c0-.771.635-1.406 1.406-1.406M7.594 19h16.812v4c0 .771-.635 1.406-1.406 1.406H9A1.414 1.414 0 0 1 7.594 23z"></path></svg>
                  <div className="info-right">
                    <span>{data.locale.cashMoney}</span>
                    <span id="money">{data.data.cashMoney}$</span>
                  </div>
                </div>
              ) : null
            }
            {
              data.data.bankMoney != undefined ? (
                <div className="info-card">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 26 26"><path fill="currentColor" d="M16.688 0c-.2.008-.393.044-.594.094L2.5 3.406C.892 3.8-.114 5.422.281 7.031l1.906 7.782A2.99 2.99 0 0 0 4 16.875V15c0-2.757 2.243-5 5-5h12.594l-1.875-7.719A3.004 3.004 0 0 0 16.687 0zm1.218 4.313l.813 3.406l-3.375.812l-.844-3.375zM9 12c-1.656 0-3 1.344-3 3v8c0 1.656 1.344 3 3 3h14c1.656 0 3-1.344 3-3v-8c0-1.656-1.344-3-3-3zm0 1.594h14c.771 0 1.406.635 1.406 1.406v1H7.594v-1c0-.771.635-1.406 1.406-1.406M7.594 19h16.812v4c0 .771-.635 1.406-1.406 1.406H9A1.414 1.414 0 0 1 7.594 23z"></path></svg>
                  <div className="info-right">
                    <span>{data.locale.bankMoney}</span>
                    <span id="money">{data.data.bankMoney}$</span>
                  </div>
                </div>
              ) : null
            }
            {
              data.data.blackMoney != undefined ? (
                <div className="info-card black">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 26 26"><path fill="currentColor" d="M16.688 0c-.2.008-.393.044-.594.094L2.5 3.406C.892 3.8-.114 5.422.281 7.031l1.906 7.782A2.99 2.99 0 0 0 4 16.875V15c0-2.757 2.243-5 5-5h12.594l-1.875-7.719A3.004 3.004 0 0 0 16.687 0zm1.218 4.313l.813 3.406l-3.375.812l-.844-3.375zM9 12c-1.656 0-3 1.344-3 3v8c0 1.656 1.344 3 3 3h14c1.656 0 3-1.344 3-3v-8c0-1.656-1.344-3-3-3zm0 1.594h14c.771 0 1.406.635 1.406 1.406v1H7.594v-1c0-.771.635-1.406 1.406-1.406M7.594 19h16.812v4c0 .771-.635 1.406-1.406 1.406H9A1.414 1.414 0 0 1 7.594 23z"></path></svg>
                  <div className="info-right">
                    <span>{data.locale.blackMoney}</span>
                    <span id="money">{data.data.blackMoney}$</span>
                  </div>
                </div>
              ) : null
            }
            {
              data.data.vipMoney != undefined ? (
                <div className="info-card vip">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 26 26"><path fill="currentColor" d="M16.688 0c-.2.008-.393.044-.594.094L2.5 3.406C.892 3.8-.114 5.422.281 7.031l1.906 7.782A2.99 2.99 0 0 0 4 16.875V15c0-2.757 2.243-5 5-5h12.594l-1.875-7.719A3.004 3.004 0 0 0 16.687 0zm1.218 4.313l.813 3.406l-3.375.812l-.844-3.375zM9 12c-1.656 0-3 1.344-3 3v8c0 1.656 1.344 3 3 3h14c1.656 0 3-1.344 3-3v-8c0-1.656-1.344-3-3-3zm0 1.594h14c.771 0 1.406.635 1.406 1.406v1H7.594v-1c0-.771.635-1.406 1.406-1.406M7.594 19h16.812v4c0 .771-.635 1.406-1.406 1.406H9A1.414 1.414 0 0 1 7.594 23z"></path></svg>
                  <div className="info-right">
                    <span>{data.locale.vipMoney}</span>
                    <span id="money">{data.data.vipMoney}$</span>
                  </div>
                </div>
              ) : null
            }
          </div>
        </div>
        <div className="center">
        <div className="center-left-btns" title="Discord">
        <button className="center-button settings" title="Settings"
            onMouseEnter={() => playHoverSound()}
            onClick={() => {
              playClickSound();
              handleSettingsClick();
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M10.825 22q-.675 0-1.162-.45t-.588-1.1L8.85 18.8q-.325-.125-.612-.3t-.563-.375l-1.55.65q-.625.275-1.25.05t-.975-.8l-1.175-2.05q-.35-.575-.2-1.225t.675-1.075l1.325-1Q4.5 12.5 4.5 12.337v-.675q0-.162.025-.337l-1.325-1Q2.675 9.9 2.525 9.25t.2-1.225L3.9 5.975q.35-.575.975-.8t1.25.05l1.55.65q.275-.2.575-.375t.6-.3l.225-1.65q.1-.65.588-1.1T10.825 2h2.35q.675 0 1.163.45t.587 1.1l.225 1.65q.325.125.613.3t.562.375l1.55-.65q.625-.275 1.25-.05t.975.8l1.175 2.05q.35.575.2 1.225t-.675 1.075l-1.325 1q.025.175.025.338v.674q0 .163-.05.338l1.325 1q.525.425.675 1.075t-.2 1.225l-1.2 2.05q-.35.575-.975.8t-1.25-.05l-1.5-.65q-.275.2-.575.375t-.6.3l-.225 1.65q-.1.65-.587 1.1t-1.163.45zm1.225-6.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.488 1.025T8.55 12t1.013 2.475T12.05 15.5"></path></svg>
            <span>{data.locale.settings}</span>
          </button>
          <button className="center-button bindings" title="Bindings"
            onMouseEnter={() => playHoverSound()}
            onClick={() => {
              playClickSound();
              handleBindingsClick();
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="currentColor" d="M3.5 4A1.5 1.5 0 0 0 2 5.5v8A1.5 1.5 0 0 0 3.5 15h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 16.5 4zm2.755 3.252a.752.752 0 1 1-1.505 0a.752.752 0 0 1 1.505 0m6 0a.752.752 0 1 1-1.505 0a.752.752 0 0 1 1.505 0M5 12.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m9.502-4.495a.752.752 0 1 1 0-1.505a.752.752 0 0 1 0 1.505m-7.504 2.5a.752.752 0 1 1 0-1.505a.752.752 0 0 1 0 1.505m3.757-.753a.752.752 0 1 1-1.505 0a.752.752 0 0 1 1.505 0m2.252.753a.752.752 0 1 1 0-1.505a.752.752 0 0 1 0 1.505M9.255 7.252a.752.752 0 1 1-1.505 0a.752.752 0 0 1 1.505 0"/></svg>
            <span>{data.locale.bindings}</span>
          </button>
          </div>
          <button className="center-button map" id="map-button" title="Map"
            onMouseEnter={() => playHoverSound()}
            onClick={() => {
              playClickSound();
              handleMapClick();
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203.21l-4.243 4.242a3 3 0 0 1-4.097.135l-.144-.135l-4.244-4.243A9 9 0 0 1 18.364 4.636M12 8a3 3 0 1 0 0 6a3 3 0 0 0 0-6"></path></svg>
            <span>{data.locale.map}</span>
          </button>
          <div className="center-right-btns" title="Discord">
            <button className="center-button discord"
              onMouseEnter={() => playHoverSound()}
              onClick={() => {
                playClickSound();
                openInNewTab(data.data.discordURL);
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.1.1 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.1 16.1 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12"></path></svg>
              <span>{data.locale.discord}</span>
            </button>
            <button className="center-button exit" title="Exit"
              onMouseEnter={() => playHoverSound()}
              onClick={() => {
                playClickSound();
                setExitPopup(true);
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><path fill="currentColor" fillRule="evenodd" d="M4.714 1.485c0-.784.636-1.42 1.42-1.42h6.434a1.42 1.42 0 0 1 1.419 1.42v11.03a1.42 1.42 0 0 1-1.42 1.42h-4.9c.077-.214.12-.445.12-.685v-1.818q0-.124-.01-.247q.262.047.531.047H9.68a2 2 0 0 0 .56-3.92a2.88 2.88 0 1 0-4.714-2.966a3 3 0 0 0-.81-.217V1.485Zm1.93 3.722a1.63 1.63 0 1 1 3.26 0a1.63 1.63 0 0 1-3.26 0m.083 1.62l.002.003l1.49 1.49a.13.13 0 0 0 .089.037h1.371a.875.875 0 1 1 0 1.75H8.308c-.497 0-.974-.197-1.326-.549l-.874-.874l-.71.71l.714.712c.351.352.549.829.549 1.326V13a.875.875 0 0 1-1.75 0v-1.568a.13.13 0 0 0-.037-.088l-.725-.726A1.88 1.88 0 0 1 3.015 11H1a.875.875 0 0 1 0-1.75h2.015a.13.13 0 0 0 .089-.037L4.87 7.446l-.428-.427a.13.13 0 0 0-.088-.037H2.536a.875.875 0 0 1 0-1.75h1.819c.497 0 .974.198 1.325.55l1.044 1.043l.003.003Z" clipRule="evenodd"></path></svg>
              <span>{data.locale.exit}</span>
            </button>
          </div>
        </div>
        <div className="bottom">
          <div className="bottom-first">
            <div className="bottom-card">
              <div style={{display: 'flex'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M8 2.002a1.998 1.998 0 1 0 0 3.996a1.998 1.998 0 0 0 0-3.996M12.5 3a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3m-9 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3M5 7.993A1 1 0 0 1 6 7h4a1 1 0 0 1 1 1v3a3 3 0 0 1-.146.927A3.001 3.001 0 0 1 5 11zM4 8c0-.365.097-.706.268-1H2a1 1 0 0 0-1 1v2.5a2.5 2.5 0 0 0 3.436 2.319A4 4 0 0 1 4 10.999zm8 0v3c0 .655-.157 1.273-.436 1.819A2.5 2.5 0 0 0 15 10.5V8a1 1 0 0 0-1-1h-2.268c.17.294.268.635.268 1"></path></svg>
                <div className="bottom-card-info">
                  <span id="title">{data.locale.playersOnline}</span>
                  <span id="info">{data.data.playersOnline} / {data.data.playersMax}</span>
                </div>
              </div>
            </div>
            {
              data.data.policeState != undefined ? (
                <div className="bottom-card police">
                  <div style={{display: 'flex'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m22 4l-2-2c-1.15.64-2.6 1-4 1s-2.86-.37-4-1c-1.14.63-2.6 1-4 1s-2.85-.36-4-1L2 4s2 2 2 4s-2 6-2 8c0 4 10 6 10 6s10-2 10-6c0-2-2-6-2-8s2-4 2-4m-6.95 12.45l-3.08-1.86l-3.07 1.86l.82-3.5L7 10.61l3.58-.31L11.97 7l1.4 3.29l3.58.31l-2.72 2.34z"></path></svg>
                    <div className="bottom-card-info">
                      <span id="title">{data.locale.police}</span>
                      <span id="info">{data.data.policeState}</span>
                    </div>
                  </div>
                </div>
              ) : null
            }
            {
              data.data.emsState != undefined ? (
                <div className="bottom-card ems">
                  <div style={{display: 'flex'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 22q-.825 0-1.412-.587T2 20V8q0-.825.588-1.412T4 6h4V4q0-.825.588-1.412T10 2h4q.825 0 1.413.588T16 4v2h4q.825 0 1.413.588T22 8v12q0 .825-.587 1.413T20 22zm6-16h4V4h-4zm1 9v3h2v-3h3v-2h-3v-3h-2v3H8v2z"></path></svg>
                    <div className="bottom-card-info">
                      <span id="title">{data.locale.ems}</span>
                      <span id="info">{data.data.emsState}</span>
                    </div>
                  </div>
                </div>
              ) : null
            }
            {
              data.data.mechanicState != undefined ? (
                <div className="bottom-card mechanic">
                  <div style={{display: 'flex'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M20.96 16.45c.01-.15.04-.3.04-.45v.5zM11 16c0 .71.15 1.39.42 2H6v1c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1v-8l2.08-6c.2-.58.76-1 1.42-1h11c.66 0 1.22.42 1.42 1L21 11v5c0-2.76-2.24-5-5-5s-5 2.24-5 5m-3-2.5c0-.83-.67-1.5-1.5-1.5S5 12.67 5 13.5S5.67 15 6.5 15S8 14.33 8 13.5M19 10l-1.5-4.5h-11L5 10zm3.87 11.19l-4.11-4.11c.41-1.04.18-2.26-.68-3.11c-.9-.91-2.25-1.09-3.34-.59l1.94 1.94l-1.35 1.36l-1.99-1.95c-.54 1.09-.29 2.44.59 3.35a2.91 2.91 0 0 0 3.12.68l4.11 4.1c.18.19.45.19.63 0l1.04-1.03c.22-.18.22-.5.04-.64"></path></svg>
                    <div className="bottom-card-info">
                      <span id="title">{data.locale.mechanic}</span>
                      <span id="info">{data.data.mechanicState}</span>
                    </div>
                  </div>
                </div>
              ) : null
            }
          </div>
          <div className="bottom-second">
            <div className="bottom-left">
              {
                data.data.website != undefined ? (
                  <button className="web-btn"
                    onMouseEnter={() => playHoverSound()}
                    onClick={() => {
                      playClickSound();
                      openInNewTab("https://www." + data.data.website);
                    }}>
                    <span>{data.data.website}</span>
                  </button>
                ) : null
              }
            </div>
            <div className="bottom-center">
              <img src={logo} alt="logo" />
            </div>
            <div className="bottom-right">
              {
                data.data.youtubeURL != undefined ? (
                  <button className="link-btn" title="Youtube"
                    onMouseEnter={() => playHoverSound()}
                    onClick={() => {
                      playClickSound();
                      openInNewTab(data.data.youtubeURL);
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73"></path></svg>
                  </button>
                ) : null
              }
              {
                data.data.twitterURL != undefined ? (
                  <button className="link-btn" title="X"
                    onMouseEnter={() => playHoverSound()}
                    onClick={() => {
                      playClickSound();
                      openInNewTab(data.data.twitterURL);
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.2 4.2 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.52 8.52 0 0 1-5.33 1.84q-.51 0-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23"></path></svg>
                  </button>
                ) : null
              }
              {
                data.data.instagramURL != undefined ? (
                  <button className="link-btn" title="Instagram"
                    onMouseEnter={() => playHoverSound()}
                    onClick={() => {
                      playClickSound();
                      openInNewTab(data.data.instagramURL);
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M13.028 2c1.125.003 1.696.009 2.189.023l.194.007c.224.008.445.018.712.03c1.064.05 1.79.218 2.427.465c.66.254 1.216.598 1.772 1.153a4.9 4.9 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428c.012.266.022.487.03.712l.006.194c.015.492.021 1.063.023 2.188l.001.746v1.31a79 79 0 0 1-.023 2.188l-.006.194c-.008.225-.018.446-.03.712c-.05 1.065-.22 1.79-.466 2.428a4.9 4.9 0 0 1-1.153 1.772a4.9 4.9 0 0 1-1.772 1.153c-.637.247-1.363.415-2.427.465l-.712.03l-.194.006c-.493.014-1.064.021-2.189.023l-.746.001h-1.309a78 78 0 0 1-2.189-.023l-.194-.006a63 63 0 0 1-.712-.031c-1.064-.05-1.79-.218-2.428-.465a4.9 4.9 0 0 1-1.771-1.153a4.9 4.9 0 0 1-1.154-1.772c-.247-.637-.415-1.363-.465-2.428l-.03-.712l-.005-.194A79 79 0 0 1 2 13.028v-2.056a79 79 0 0 1 .022-2.188l.007-.194c.008-.225.018-.446.03-.712c.05-1.065.218-1.79.465-2.428A4.9 4.9 0 0 1 3.68 3.678a4.9 4.9 0 0 1 1.77-1.153c.638-.247 1.363-.415 2.428-.465c.266-.012.488-.022.712-.03l.194-.006a79 79 0 0 1 2.188-.023zM12 7a5 5 0 1 0 0 10a5 5 0 0 0 0-10m0 2a3 3 0 1 1 .001 6a3 3 0 0 1 0-6m5.25-3.5a1.25 1.25 0 0 0 0 2.5a1.25 1.25 0 0 0 0-2.5"></path></svg>
                  </button>
                ) : null
              }
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default App
