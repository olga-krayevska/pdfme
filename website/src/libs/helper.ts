import { Template, checkTemplate } from '@pdfme/generator';
import { examplePdfb64, dogPngb64 } from './sampleData';

export const getSampleTemplate = (): Template => ({
  schemas: [
    {
      name: {
        type: 'text',
        position: {
          x: 25.06,
          y: 26.35,
        },
        width: 77.77,
        height: 18.7,
        fontSize: 36,
        fontColor: '#14b351',
      },

      photo: {
        type: 'image',
        position: {
          x: 24.99,
          y: 65.61,
        },
        width: 60.66,
        height: 93.78,
      },
      age: {
        type: 'text',
        position: {
          x: 36,
          y: 179.46,
        },
        width: 43.38,
        height: 6.12,
        fontSize: 12,
      },
      sex: {
        type: 'text',
        position: {
          x: 36,
          y: 186.23,
        },
        width: 43.38,
        height: 6.12,
        fontSize: 12,
      },
      weight: {
        type: 'text',
        position: {
          x: 40,
          y: 192.99,
        },
        width: 43.38,
        height: 6.12,
        fontSize: 12,
      },
      breed: {
        type: 'text',
        position: {
          x: 40,
          y: 199.09,
        },
        width: 43.38,
        height: 6.12,
        fontSize: 12,
      },
      owner: {
        type: 'qrcode',
        position: {
          x: 115.09,
          y: 204.43,
        },
        width: 26.53,
        height: 26.53,
      },
    },
  ],
  basePdf: examplePdfb64,
  sampledata: [
    {
      name: 'Pet Name',
      photo: dogPngb64,
      age: '4 years',
      sex: 'Male',
      weight: '33 pounds',
      breed: 'Mutt',
      owner: 'https://pdfme.com/',
    },
  ],
  columns: ['name', 'photo', 'age', 'sex', 'weight', 'breed', 'owner'],
});

export const cloneDeep = (obj) => JSON.parse(JSON.stringify(obj));

export const downloadJsonFile = (json: any, title: string) => {
  if (typeof window !== 'undefined') {
    const blob = new Blob([JSON.stringify(json)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
};

export const readFile = (file: File | null, type: 'text' | 'dataURL' | 'arrayBuffer') => {
  return new Promise<string | ArrayBuffer>((r) => {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', (e) => {
      if (e && e.target && e.target.result && file !== null) {
        r(e.target.result);
      }
    });
    if (file !== null) {
      if (type === 'text') {
        fileReader.readAsText(file);
      } else if (type === 'dataURL') {
        fileReader.readAsDataURL(file);
      } else if (type === 'arrayBuffer') {
        fileReader.readAsArrayBuffer(file);
      }
    }
  });
};

export const getTemplateFromJsonFile = (file: File) => {
  return readFile(file, 'text').then((jsonStr) => {
    const template: Template = JSON.parse(jsonStr as string);
    try {
      checkTemplate(template);
      return template;
    } catch (e) {
      throw e;
    }
  });
};

const templateFmt4SampleCode = (template: Template) =>
  JSON.stringify(
    Object.assign(cloneDeep(template), { columns: undefined, sampledata: undefined }),
    null,
    2
  );

export const getGeneratorSampleCode = (template: Template) =>
  `import { generate } from "pdfme";

(async () => {
  const template = ${templateFmt4SampleCode(template)};
  const inputs = ${JSON.stringify(cloneDeep(template.sampledata), null, 2)};

  const pdf = await generate({ template, inputs });

  // Node.js
  // fs.writeFileSync(path.join(__dirname, 'test.pdf'), pdf);

  // Browser
  const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
  window.open(URL.createObjectURL(blob));
})();`.trim();

export const getDesignerSampleCode = (template: Template) =>
  `import { Designer } from "pdfme";

const domContainer = document.getElementById('container');
const template = ${templateFmt4SampleCode(template)};

const designer = new Designer({ domContainer, template });`.trim();

export const getFormSampleCode = (template: Template) =>
  `import { Form } from "pdfme";

const domContainer = document.getElementById('container');
const template = ${templateFmt4SampleCode(template)};
const inputs = ${JSON.stringify(cloneDeep(template.sampledata), null, 2)};

const form = new Form({ domContainer, template, inputs });`.trim();

export const getViewerSampleCode = (template: Template) =>
  `import { Viewer } from "pdfme";

const domContainer = document.getElementById('container');
const template = ${templateFmt4SampleCode(template)};
const inputs = ${JSON.stringify(cloneDeep(template.sampledata), null, 2)};

const viewer = new Viewer({ domContainer, template });`.trim();
