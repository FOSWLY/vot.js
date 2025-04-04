// Sites host Invidious. I tested the performance only on invidious.kevin.rocks, youtu.be and inv.vern.cc
const sitesInvidious = [
  "yewtu.be",
  "yt.artemislena.eu",
  "invidious.flokinet.to",
  "iv.melmac.space",
  "inv.nadeko.net",
  "inv.tux.pizza",
  "invidious.private.coffee",
  "yt.drgnz.club",
  "vid.puffyan.us",
  "invidious.dhusch.de",
] as const;

// Sites host Piped. I tested the performance only on piped.video
const sitesPiped = [
  "piped.video",
  "piped.tokhmi.xyz",
  "piped.moomoo.me",
  "piped.syncpundit.io",
  "piped.mha.fi",
  "watch.whatever.social",
  "piped.garudalinux.org",
  "efy.piped.pages.dev",
  "watch.leptons.xyz",
  "piped.lunar.icu",
  "yt.dc09.ru",
  "piped.mint.lgbt",
  "il.ax",
  "piped.privacy.com.de",
  "piped.esmailelbob.xyz",
  "piped.projectsegfau.lt",
  "piped.in.projectsegfau.lt",
  "piped.us.projectsegfau.lt",
  "piped.privacydev.net",
  "piped.palveluntarjoaja.eu",
  "piped.smnz.de",
  "piped.adminforge.de",
  "piped.qdi.fi",
  "piped.hostux.net",
  "piped.chauvet.pro",
  "piped.jotoma.de",
  "piped.pfcd.me",
  "piped.frontendfriendly.xyz",
] as const;

const sitesProxiTok = [
  "proxitok.pabloferreiro.es",
  "proxitok.pussthecat.org",
  "tok.habedieeh.re",
  "proxitok.esmailelbob.xyz",
  "proxitok.privacydev.net",
  "tok.artemislena.eu",
  "tok.adminforge.de",
  "tt.vern.cc",
  "cringe.whatever.social",
  "proxitok.lunar.icu",
  "proxitok.privacy.com.de",
] as const;

// Sites host Peertube. I tested the performance only on dalek.zone and tube.shanti.cafe
const sitesPeertube = [
  "peertube.1312.media",
  "tube.shanti.cafe",
  "bee-tube.fr",
  "video.sadmin.io",
  "dalek.zone",
  "review.peertube.biz",
  "peervideo.club",
  "tube.la-dina.net",
  "peertube.tmp.rcp.tf",
  "peertube.su",
  "video.blender.org",
  "videos.viorsan.com",
  "tube-sciences-technologies.apps.education.fr",
  "tube-numerique-educatif.apps.education.fr",
  "tube-arts-lettres-sciences-humaines.apps.education.fr",
  "beetoons.tv",
  "comics.peertube.biz",
  "makertube.net",
] as const;

// Sites host Poketube. I tested the performance only on poketube.fun
const sitesPoketube = [
  "poketube.fun",
  "pt.sudovanilla.org",
  "poke.ggtyler.dev",
  "poke.uk2.littlekai.co.uk",
  "poke.blahai.gay",
] as const;

const sitesRicktube = ["ricktube.ru"] as const;

const sitesMaterialious = [
  "materialious.nadeko.net",
  "app.materialio.us",
] as const;

// If you know what the correct name of this engine is, let me know so that I change the name
const sitesCoursehunterLike = ["coursehunter.net", "coursetrain.net"] as const;

export {
  sitesInvidious,
  sitesPiped,
  sitesProxiTok,
  sitesPeertube,
  sitesPoketube,
  sitesRicktube,
  sitesMaterialious,
  sitesCoursehunterLike,
};
