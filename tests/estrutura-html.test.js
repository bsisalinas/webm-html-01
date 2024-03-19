const fs = require("fs");
const { JSDOM } = require("jsdom");
const path = require("path");

// Diretório atual
const directory = path.join(__dirname, "..");

function getAllHTMLFileNames(directory) {
  try {
    // Ler o conteúdo do diretório atual
    const files = fs.readdirSync(directory);

    // Filtrar apenas os arquivos com extensão .html
    const htmlFiles = files.filter((file) => path.extname(file) === ".html");

    // Retornar apenas os nomes dos arquivos HTML
    return htmlFiles.map((file) => file);
  } catch (err) {
    console.error("Erro ao ler o diretório:", err);
    return [];
  }
}

const htmlFileNames = getAllHTMLFileNames(directory);

htmlFileNames.forEach((pagina) => {
  describe(`Testando ${pagina}`, () => {
    let dom;
    let document;
    let htmlContent;

    beforeAll(() => {
      // Carregar o conteúdo do arquivo HTML para teste
      htmlContent = fs.readFileSync(pagina, "utf8");
      // Criar um ambiente DOM usando jsdom
      dom = new JSDOM(htmlContent);
      document = dom.window.document;
    });

    test("!DOCTYPE", () => {
      const doctype = document.doctype;
      // Verifica se o doctype é HTML5
      expect(doctype.name).toBe("html");
      expect(doctype.publicId).toBe("");
      expect(doctype.systemId).toBe("");
    });

    test("<html>", () => {
      expect(htmlContent).toContain("<html");
      expect(htmlContent).toContain("</html>");
    });

    test("<head>", () => {
      expect(htmlContent).toContain("<head>");
      expect(htmlContent).toContain("</head>");
    });

    test("<body>", () => {
      expect(htmlContent).toContain("<body>");
      expect(htmlContent).toContain("</body>");
    });

    test("<title>", () => {
      const titleElement = dom.window.document.querySelector("title");
      // Verificar se existe o elemento title
      expect(titleElement).not.toBeNull();
      // Verificar se o texto dentro da tag title não está vazio
      const titleText = titleElement.textContent.trim();
      expect(titleText).not.toBe("");
    });
  });
});
