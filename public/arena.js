const elementThatWrapsAllTheStuff = document.getElementById("whatever-the-id-is");

// axios is a client for fetching data from any api
const axiosArena = axios.create({
  baseURL: "https://api.are.na/v2/",
});

// while it loads, let people knoooww
let loading = document.createElement("div");
loading.className = "loading";
loading.innerHTML = 'loading...';
elementThatWrapsAllTheStuff.appendChild(loading);

axiosArena.defaults.headers.Authorization = 'Bearer ---' ;
axiosArena.get("channels/name-of-channel?per=100").then(response => {
  // check that youre getting data back
  console.log(response);
  if (response.data && response.data.contents.length > 1) {
    // remove the loading placeholder
    elementThatWrapsAllTheStuff.removeChild(loading);
    // push into a new function
    showAllTheArenaStuff(response.data.contents);
  }
});

function showAllTheArenaStuff(arenaData) {
  for (let i=0; i<arenaData.length; i++) {
    //create a container element
    let container = document.createElement("div");
    container.className = "container";

    //if arena data is a block that is a link!
    if (arenaData[i].source) {
      container = document.createElement("a");
      container.className = "container";
      container.href = arenaData[i].source.url;
      container.target = "_blank";
    }

    //if arena data is a channel
    if (arenaData[i].class === "Channel") {
      container = document.createElement("a");
      container.className = "channel";
      container.href = `https://are.na/${arenaData[i].user.slug}/${arenaData[i].slug}`;
      container.target = "_blank";
    }

    //if arena data is a block that is an image
    if (arenaData[i].image && arenaData[i].image) {
      const image = document.createElement("img");
      image.className = "image";
      image.src = arenaData[i].image.square.url;
      container.appendChild(image);
    }
    //get the block title, and append it to the container
    if (arenaData[i].title) {
      const title = document.createElement("div");
      title.className = "title";
      title.innerHTML = arenaData[i].title;
      container.appendChild(title);
    }

    //if arena data is a block that is just text
    if (arenaData[i].class === "Text") {
      const text = document.createElement("div");
      text.className = "text";
      text.innerHTML = arenaData[i].content;
      container.appendChild(text);
    }

    elementThatWrapsAllTheStuff.appendChild(container);
  }
}
