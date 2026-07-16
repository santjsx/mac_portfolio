import { useState, useEffect, useRef } from 'react';

export interface LiveData {
  spotify: {
    song: string;
    artist: string;
    album: string;
    albumArt: string;
    isPlaying: boolean;
  } | null;
  discordStatus: 'online' | 'idle' | 'dnd' | 'offline';
  discordActivity: string | null;
  spaceHeadcount: number | null;
  trendingMovie: {
    title: string;
    poster: string;
  } | null;
}

export function useLiveAPI() {
  const [data, setData] = useState<LiveData>({
    spotify: null,
    discordStatus: 'offline',
    discordActivity: null,
    spaceHeadcount: null,
    trendingMovie: null,
  });

  // Keep a ref to avoid stale state in WebSocket listener
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Lanyard WebSocket setup
  useEffect(() => {
    let ws: WebSocket;
    let heartbeatInterval: any;

    const connectLanyard = () => {
      ws = new WebSocket('wss://api.lanyard.rest/socket');

      ws.onopen = () => {
        // Connected successfully
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.op === 1) {
          // Hello packet, setup heartbeat
          const interval = msg.d.heartbeat_interval;
          heartbeatInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 3 }));
            }
          }, interval);

          // Subscribe to user presence
          ws.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: '1284925883240550552' }
          }));
        }

        if (msg.op === 0 && (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE')) {
          const presence = msg.d;
          const status = presence.discord_status || 'offline';
          
          // Check Lanyard Spotify
          let spotifyData = null;
          if (presence.listening_to_spotify && presence.spotify) {
            spotifyData = {
              song: presence.spotify.song,
              artist: presence.spotify.artist,
              album: presence.spotify.album,
              albumArt: presence.spotify.album_art_url,
              isPlaying: true,
            };
          }

          // Check custom presence activities
          let activityText = null;
          if (presence.activities && presence.activities.length > 0) {
            // Find rich presence (playing a game/coding)
            const active = presence.activities.find((a: any) => a.type === 0);
            if (active) {
              activityText = active.details ? `${active.name}: ${active.details}` : active.name;
            } else if (presence.activities[0].state) {
              activityText = presence.activities[0].state;
            }
          }

          setData(prev => ({
            ...prev,
            discordStatus: status,
            discordActivity: activityText,
            // Prioritize Lanyard Spotify. If offline, keep previous (which might be Last.fm fallback)
            spotify: spotifyData || (prev.spotify && !prev.spotify.albumArt.includes('last.fm') ? null : prev.spotify),
          }));
        }
      };

      ws.onerror = (err) => {
        console.error('Lanyard socket error:', err);
      };

      ws.onclose = () => {
        clearInterval(heartbeatInterval);
        setTimeout(connectLanyard, 5000); // Reconnect in 5s
      };
    };

    connectLanyard();

    return () => {
      clearInterval(heartbeatInterval);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // Last.fm & iTunes Search fallback polling
  useEffect(() => {
    const fetchLastFM = async () => {
      try {
        const lastfmUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=santhoshh25&api_key=a403d71a4af1bacfddab789750be1c18&format=json&limit=1`;
        const res = await fetch(lastfmUrl);
        const json = await res.json();
        
        const track = json?.recenttracks?.track?.[0];
        const isNowPlaying = track?.['@attr']?.nowplaying === 'true';

        if (isNowPlaying) {
          const songName = track.name;
          const artistName = track.artist['#text'];
          const albumName = track.album['#text'];
          let artwork = track.image?.[3]?.['#text'] || ''; // Large size

          // If Lanyard Spotify is already active and playing, don't overwrite it with Last.fm
          const currentSpotify = dataRef.current.spotify;
          if (currentSpotify && currentSpotify.isPlaying && !currentSpotify.albumArt.includes('last.fm')) {
            return;
          }

          // Fetch high-res artwork from iTunes Search API as specified in developer_details.txt
          try {
            const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(songName + ' ' + artistName)}&entity=song&limit=1`;
            const itunesRes = await fetch(itunesUrl);
            const itunesJson = await itunesRes.json();
            const itunesTrack = itunesJson?.results?.[0];
            if (itunesTrack?.artworkUrl100) {
              // Convert 100x100bb.jpg to 600x600bb.jpg for high-resolution cover
              artwork = itunesTrack.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg');
            }
          } catch (err) {
            console.error('iTunes Search API failed, using Last.fm cover:', err);
          }

          setData(prev => ({
            ...prev,
            spotify: {
              song: songName,
              artist: artistName,
              album: albumName,
              albumArt: artwork || '/logo.png',
              isPlaying: true
            }
          }));
        } else {
          // If nothing is playing on Last.fm, reset spotify state unless Lanyard Spotify is playing
          setData(prev => {
            if (prev.spotify && prev.spotify.isPlaying && !prev.spotify.albumArt.includes('last.fm')) {
              return prev; 
            }
            return {
              ...prev,
              spotify: null
            };
          });
        }
      } catch (err) {
        console.error('Last.fm fetch failed:', err);
      }
    };

    fetchLastFM();
    const interval = setInterval(fetchLastFM, 15000); // Poll Last.fm every 15s
    return () => clearInterval(interval);
  }, []);

  // TMDb API and Astros API fetching
  useEffect(() => {
    const fetchTMDb = async () => {
      try {
        const tmdbUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=15511e43224695bd75148dab05bc81fb`;
        const res = await fetch(tmdbUrl);
        const json = await res.json();
        const movie = json?.results?.[0];
        if (movie) {
          setData(prev => ({
            ...prev,
            trendingMovie: {
              title: movie.title || movie.name,
              poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            }
          }));
        }
      } catch (err) {
        console.error('TMDb fetch failed:', err);
      }
    };

    const fetchSpaceCount = async () => {
      try {
        // Fetch via allorigins secure proxy to bypass mixed content (HTTP -> HTTPS) blockages
        const spaceUrl = `https://api.allorigins.win/raw?url=http://api.opennotify.org/astros.json`;
        const res = await fetch(spaceUrl);
        const text = await res.text();
        const json = JSON.parse(text);
        if (json && typeof json.number === 'number') {
          setData(prev => ({
            ...prev,
            spaceHeadcount: json.number
          }));
        }
      } catch (err) {
        console.error('Space headcount API failed, falling back to mock:', err);
        // Standard fallback to average ISS headcount
        setData(prev => ({ ...prev, spaceHeadcount: 10 }));
      }
    };

    fetchTMDb();
    fetchSpaceCount();
  }, []);

  return data;
}
