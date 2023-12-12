interface IHTMLData {
  html: string;
  fileName: string;
  directory: string;
  base64: boolean;
  height?: number;
  width?: number;
}

export const htmlFactura = async (): Promise<IHTMLData> => {
  const html: IHTMLData = {
    html: `<html lang="en">
    <head>
    <style>${htmlStyles}</style>
    <link rel="stylesheet" href="styles.css" />
    </head>
    <body class="body">
              <p class="p-textos-titulos">Monterrey</p>
              <p class="p-textos-titulos">NIT 112184889</p>
    </body>
  </html>
  `,
    fileName: 'TEBAN',
    directory: 'Download',
    base64: false,
    height: 4400,
    width: 2200,
    // height: 1100,
    // width: 550,
  };
  return html;
};

const htmlStyles = `.body {
  width: 100%;
  /* background-color: lime; */
  height: 100%;
}
.p-textos-titulos {
  /* background-color: white; */
  width: 100%;
  height: 20%;
  margin: 0;
  text-align: center;
  font-size:100px;
}
`;
