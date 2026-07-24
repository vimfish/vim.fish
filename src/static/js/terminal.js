let commandHistory = ["neofetch"];

const software = [
  "Debian",
  "Librewolf",
  "Godot",
  "VSCodium",
  "Aseprite",
  "Blender",
  "Trenchbroom",
];

const commands = [
  "help",
  "software",
  "about",
  "neofetch",
  "socials",
  "clear",
  "blog",
  "projects",
  "interests",
  "gui",
  "now",
  "guestbook",
];

const htmlCommands = [
  "neofetch",
  "about",
  "socials",
  "contact",
  "interests",
  "projects",
];

const socials = `<article><p><span class="highlight">bsky</span>: <a href="https://bsky.app/profile/vim.fish" target="_blank">@vim.fish</a>
<span class="highlight">email</span>: <a href="mailto:hi@vim.fish" target="_blank">hi@vim.fish</a>
<span class="highlight">cohost</span>: you will be missed, eggbug :c
</p></article>`;

const neofetch = `<article style="display: flex; gap: 1rem;">
<img style="align-self: center;" width="270" height="270" src="/static/img/cube.jpg" />
<p><span class="highlight">vimtriloquist</span>@<span>vim.fish</span><br>------------------
<span class="highlight">Usernames</span>: vimtriloquist / vim
<span class="highlight">Pronouns</span>: they/them
<span class="highlight">Country</span>: brazil
<span class="highlight">Job</span>: solutions architect
<span class="highlight">Uptime</span>: 26 years (2000-02-22T22:13:00:00)
<span class="highlight">Email</span>: <a href="mailto:hi@vim.fish">hi@vim.fish</a>
<span class="highlight">Politics</span>: communist ☭
<span class="highlight">Sexuality</span>: pansexual
</p></article>`;

const projects = `<article><p>
<a href="#" target="_blank">TBD</a>: ---
</p></article>`;

const interests = `<article><p>
---
</p></article>`;

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

function writeText(target, content, delay = 5) {
  return new Promise((resolve) => {
    const contentArray = content.split("");
    const terminal = document.querySelector("#terminal");

    let current = 0;

    while (current < contentArray.length) {
      ((curr) => {
        setTimeout(() => {
          target.innerHTML += contentArray[curr];
          terminal.scrollTo(0, terminal.scrollHeight);

          if (curr === contentArray.length - 1) resolve();
        }, delay * curr);
      })(current++);
    }
  });
}

function writeHtml(target, text) {
  target.innerHTML += text;
  terminal.scrollTo(0, terminal.scrollHeight);
}

function handleKeypress(e, input, output) {
  function noInputHasFocus() {
    const elements = ["INPUT", "TEXTAREA", "BUTTON"];
    return elements.indexOf(document.activeElement.tagName) === -1;
  }

  if (noInputHasFocus) {
    if (e.key === "Enter") {
      const command = input.innerText;
      const history = output.innerText;
      const lastCommand = commandHistory[commandHistory.length - 1] ?? "";
      input.innerHTML = "";

      if (
        history.length > 0 &&
        ![" ", "\n"].includes(history.charAt(history.length - 1)) &&
        !htmlCommands.includes(lastCommand)
      ) {
        output.innerHTML += "\n$: > <strong>" + command + "</strong>\n";
      } else {
        output.innerHTML += "$: > <strong>" + command + "</strong>\n";
      }

      commandHistory.push(command);

      if (!htmlCommands.includes(command)) {
        writeText(output, execute(command));
      } else {
        writeHtml(output, execute(command));
      }
    } else if (e.key === "Backspace") {
      input.innerHTML = input.innerHTML.substring(
        0,
        input.innerHTML.length - 1,
      );
    } else if (e.key.length === 1) input.insertAdjacentText("beforeend", e.key);
  }
}

function execute(command) {
  switch (command.toLowerCase()) {
    case "":
      return `\n`;

    case "clear":
      commandHistory = [];
      output.innerHTML = "";
      return "";

    case "blog":
      return "";

    case "software":
      let softwareString = "Software I use:\n";
      software.forEach(
        (s, i) =>
          (softwareString += i < software.length - 1 ? `${s}, ` : `${s}.`),
      );
      return softwareString;

    case "about":
    case "neofetch":
      return neofetch;

    case "socials":
    case "contact":
      return socials;

    case "help":
      let helpString = "";
      commands.forEach((c) => (helpString += `${c}\t`));
      return helpString;

    case "guestbook":
      return "";

    case "gui":
      window.open("https://losswaffle.nekoweb.org/home.html").focus();
      return;

    case "projects":
      return projects;

    case "interests":
      return socials;

    case "now":
      window.open("https://losswaffle.nekoweb.org/now.html").focus();
      return "";

    case "missing":
      return `missing implementation: '${command.toLowerCase()}'.`;

    default:
      return `unknown Command: '${command.toLowerCase()}'`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const asciiText = document.getElementById("ascii");
  const asciiArt = asciiText.innerText;
  asciiText.innerHTML = "";

  const instructions = document.getElementById("instructions");
  const prompt = document.getElementById("prompt");
  const cursor = document.getElementById("cursor");

  await wait(1000);
  await writeText(asciiText, asciiArt);
  await wait(500);

  await writeText(
    instructions,
    `Enter a command. Enter 'help' to see a list of commands.\n\n`,
  );

  prompt.prepend("$: >");
  cursor.innerHTML = "_";

  const input = document.getElementById("command-input");
  const output = document.getElementById("output");
  document.addEventListener("keydown", (e) => handleKeypress(e, input, output));
  writeHtml(output, execute("neofetch"));
});
