async function getStats() {
  const stats = await fetch("https://nekoweb.org/api/site/info/vim.fish").then(
    (x) => x.json(),
  );

  const counter = document.querySelector("#view-counter");
  const updated = document.querySelector("#last-updated");

  if (counter && updated) {
    counter.innerText = `views: ${stats.views}`;
    updated.innerText = `last updated: ${
      new Date(stats.updated_at).toISOString().split("T")[0]
    }`;
  }
}

getStats();
