async function getLibreFmNowPlaying() {
  const librefm = await fetch(
    "https://libre.fm/2.0/?method=user.getrecenttracks&user=vimtriloquist&format=json",
  ).then((x) => x.json());

  const artist = librefm.recenttracks.track[0].artist["#text"];
  const song = librefm.recenttracks.track[0].name;

  const element = document.querySelector("#librefm");

  if (element) {
    element.innerText = `${artist.toLowerCase()} - ${song.toLowerCase()}`;
  }
}

getLibreFmNowPlaying();
