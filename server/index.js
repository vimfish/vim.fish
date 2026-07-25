const express = require("express");
const path = require("path");
const SSI = require("ssi");
const fs = require("fs");

const app = express();
const PORT = 3000;

const tmpDir = path.join(__dirname, "..", "tmp");
const srcDir = path.join(__dirname, "..", "src");

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

app.use((req, res, next) => {
  if (req.url === "/" || req.url.endsWith(".html")) {
    const fileName = req.url === "/" ? "index.html" : req.url;

    try {
      const parser = new SSI(srcDir, tmpDir, "/**/*.html");
      parser.compile();

      const compiledFilePath = path.join(tmpDir, fileName);
      const htmlContent = fs.readFileSync(compiledFilePath, "utf8");

      return res.send(htmlContent);
    } catch (err) {
      console.error(`[SSI Error Detail]:`, err.message);

      const errorPagePath = path.join(srcDir, "not_found.html");

      if (fs.existsSync(errorPagePath)) {
        const errorHtml = fs.readFileSync(errorPagePath, "utf8");
        return res.status(404).send(errorHtml);
      } else {
        return res
          .status(404)
          .send("SSI Error: Page and not_found.html missing.");
      }
    }
  }
  next();
});

app.use(express.static(path.join(__dirname, "..", "src")));

app.listen(PORT, () => {
  console.log(`SSI Server active at http://localhost:${PORT}`);
});
