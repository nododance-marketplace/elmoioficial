export const LINKS = {
  spotifyTrack: 'https://open.spotify.com/track/5mDiKMfgDtbrOwaKY48M7V',
  spotifyEmbed:
    'https://open.spotify.com/embed/track/5mDiKMfgDtbrOwaKY48M7V?utm_source=generator&theme=0',
  spotifySearch: 'https://open.spotify.com/search/',
  appleArtist: 'https://music.apple.com/us/artist/el-moi/1792519364',
  youtube: 'https://www.youtube.com/@ElMoiOficial',
  youtubeReact: 'https://www.youtube.com/@ElMoiOficial/videos',
  instagram: 'https://www.instagram.com/elmoioficial/',
  tiktok: 'https://www.tiktok.com/@el_moi_oficial',
  nododance: 'https://nododance.com',
} as const

export type Track = {
  no: number
  title: string
  duration: string
  apple: string
  spotifyQuery: string
}

export const RELEASE = {
  title: 'SBK Vol. 1.',
  kind: 'Single',
  label: 'Sazon Records',
  date: 'May 6, 2026',
  genre: 'Latin',
  composer: 'Moises J Castillo',
  executiveProducer: 'Kevin Gerez',
  artwork:
    'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/60/6c/f4/606cf424-c931-890b-c145-24c65746cee6/artwork.jpg/640x640bb.jpg',
} as const

export const TRACKS: Track[] = [
  {
    no: 1,
    title: 'Incompatible',
    duration: '2:55',
    apple: 'https://music.apple.com/us/album/incompatible/6767342966?i=6767343147',
    spotifyQuery: 'Incompatible El Moi',
  },
  {
    no: 2,
    title: 'Cuando llego la mañana',
    duration: '2:30',
    apple: 'https://music.apple.com/us/album/cuando-llego-la-ma%C3%B1ana/6767342966?i=6767343148',
    spotifyQuery: 'Cuando llego la mañana El Moi',
  },
  {
    no: 3,
    title: 'Telefone da madrugada',
    duration: '1:55',
    apple: 'https://music.apple.com/us/album/telefone-da-madrugada/6767342966?i=6767343149',
    spotifyQuery: 'Telefone da madrugada El Moi',
  },
]
