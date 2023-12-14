export const zplFactura = async (): Promise<string> => {
  const generarLinea = (x: number, y: number, largoX: number, largoY: number) =>
    `^FO${x},${y}^GB${largoX + 1},${largoY + 1},2^FS`;

  const generarTexto = (
    x: number,
    y: number,
    texto: string,
    tamanioLetra: number = 25,
  ) => `^FO${x},${y}^A0,${tamanioLetra}^FD${texto}^FS`;

  const generarTextoAlineado = (
    texto: string,
    posicionY: number,
    coordenada1: number,
    coordenada2: number,
    alineacion: 'left' | 'center' | 'right' = 'left',
    tamanioLetra: number = 25,
  ) => {
    let posicionX: number;

    const anchoContenedor = coordenada2 - coordenada1;

    if (alineacion === 'center') {
      const longitudTexto = texto.length * tamanioLetra * 0.5; // Ajuste aproximado para centrar
      posicionX = coordenada1 + (anchoContenedor - longitudTexto) / 2;
    } else if (alineacion === 'right') {
      const longitudTexto = texto.length * tamanioLetra * 0.6;
      posicionX = coordenada1 + anchoContenedor - longitudTexto;
    } else {
      posicionX = coordenada1 + 10;
    }

    return generarTexto(posicionX, posicionY, texto, tamanioLetra);
  };

  const zpl: string = `^XA
    ${generarTexto(50, 60, 'LOGO')}  
    ${generarTexto(700, 60, 'LOGO')} 
    ${generarTextoAlineado('Nombre de la Empresa', 60, 0, 850, 'center', 30)}, 
    ${generarTextoAlineado('NIT de la Empresa', 90, 0, 850, 'center', 30)}, 
    ${generarTextoAlineado('Correo de la Empresa', 120, 0, 850, 'center', 30)}, 
    ${generarTextoAlineado(
      'Direccion de la Empresa',
      150,
      0,
      850,
      'center',
      30,
    )}, 
    ${generarTextoAlineado(
      'Telefono de la Empresa',
      180,
      0,
      850,
      'center',
      30,
    )}, 
// ???? #Factura, Peridodo, meses y fecha de impresion
    ${generarLinea(30, 220, 190, 0)}  // Línea superior Caja 1
    ${generarLinea(30, 290, 190, 0)}  // Línea inferior Caja 1
    ${generarLinea(30, 220, 0, 70)}   // Línea left Caja 1
    ${generarLinea(220, 220, 0, 71)}  // Línea right Caja 1

    ${generarLinea(220, 220, 201, 0)}  // Línea superior Caja 2 
    ${generarLinea(220, 290, 201, 0)}  // Línea inferior Caja 2
    ${generarLinea(220, 220, 0, 61)}   // Línea left Caja 2
    ${generarLinea(430, 220, 0, 61)}  // Línea right Caja 2

    ${generarLinea(420, 220, 171, 0)}  // Línea superior Caja 3
    ${generarLinea(420, 290, 171, 0)}  // Línea inferior Caja 3
    ${generarLinea(430, 220, 0, 71)}   // Línea left Caja 3
    ${generarLinea(590, 220, 0, 71)}  // Línea right Caja 3

    ${generarLinea(570, 220, 220, 0)}  // Línea superior Caja 4
    ${generarLinea(570, 290, 220, 0)}  // Línea inferior Caja 4
    ${generarLinea(590, 220, 0, 71)}   // Línea left Caja 4
    ${generarLinea(790, 220, 0, 71)}  // Línea right Caja 4

    ${generarTexto(45, 230, 'Factura de venta:', 23)}      
    ${generarTextoAlineado('788089', 260, 30, 220, 'center')},

    ${generarTexto(240, 230, 'Periodo facturado:', 23)}     
    ${generarTextoAlineado('2023/11', 260, 220, 430, 'center')},
    
    ${generarTexto(450, 230, 'Meses mora:', 23)}      
    ${generarTextoAlineado('14', 260, 430, 590, 'center')},
    
    ${generarTexto(610, 230, 'Fecha Impresion:', 23)},   
    ${generarTextoAlineado('2023/11/22', 260, 590, 790, 'center')},
    // ???????????????????????????????????????????????????????????????
    
    // ??? Datos del usuario
    ${generarLinea(30, 300, 0, 365)}  // Línea left Caja 5
    ${generarLinea(430, 300, 0, 365)}   // Línea right Caja 5
    ${generarLinea(30, 300, 400, 0)}  // Línea superior Caja 5
    ${generarTextoAlineado('DATOS DEL USUARIO', 310, 30, 430, 'center')},
    ${generarLinea(30, 335, 400, 0)}  // Línea #1 interior Caja 5
    ${generarTexto(40, 345, 'Nombre:', 20)}   
    ${generarTextoAlineado('PARADOR TURISTICO LOCAL', 345, 110, 430)},
    ${generarTexto(40, 380, 'Direccion:', 20)}   
    ${generarTextoAlineado('CRA 11 24 LA GLORIETA', 380, 125, 430)},
    ${generarTexto(40, 410, 'Codigo:', 20)}   
    ${generarTextoAlineado('1000001', 410, 100, 430)},
    ${generarTexto(100, 440, 'Estrato:', 20)}   
    ${generarTexto(280, 440, 'Ruta:', 20)}   
    ${generarTexto(130, 470, '1C')}   
    ${generarTexto(250, 470, '10010000')}   
    ${generarLinea(30, 500, 400, 0)}  // Línea #2 interior Caja 5
    ${generarTexto(80, 510, 'Numero de', 20)}   
    ${generarTexto(90, 530, 'medidor:', 20)}   
    ${generarTexto(280, 510, 'Novedad:', 20)}   
    ${generarTexto(70, 550, '0000000000')}   
    ${generarTexto(270, 530, 'MEDIDOR')}   
    ${generarTexto(265, 555, 'INVERTIDO')}   
    ${generarLinea(30, 580, 400, 0)}  // Línea #3 interior Caja 5
    ${generarTexto(50, 590, 'Lectura', 20)}   
    ${generarTexto(50, 610, 'anterior:', 20)}   
    ${generarTexto(140, 590, 'Lectura', 20)}   
    ${generarTexto(145, 610, 'actual:', 20)}   
    ${generarTexto(230, 600, 'Consumo:', 20)}   
    ${generarTexto(345, 590, 'Consumo', 20)}   
    ${generarTexto(340, 610, 'promedio:', 20)}   
    ${generarTexto(50, 635, '1215')}   
    ${generarTexto(145, 635, '1215')}   
    ${generarTexto(260, 635, '0')}   
    ${generarTexto(375, 635, '8')}   
    ${generarLinea(30, 665, 400, 0)}  // Línea inferior Caja 5
    // ??????????????????????????????????????????????????????????????

    ${generarLinea(30, 680, 760, 0)}  // Línea superior Caja 6
    ${generarTexto(70, 690, 'CONCEPTO', 20)}   
    ${generarTexto(215, 690, 'M3', 20)}   
    ${generarTexto(260, 690, 'VALOR UND', 20)}   
    ${generarTexto(385, 690, 'ACUEDUCTO', 20)}   
    ${generarTexto(510, 690, 'VALOR UND', 20)}   
    ${generarTexto(635, 690, 'ALCANTARILLADO', 20)}   
    ${generarLinea(30, 710, 760, 0)}  // Línea interior horizontal #1 Caja 6
    ${generarLinea(200, 680, 0, 600)}   // Línea interior vertical #1 Caja 6
    ${generarLinea(250, 680, 0, 600)}   // Línea interior vertical #2 Caja 6
    ${generarLinea(370, 680, 0, 600)}   // Línea interior vertical #3 Caja 6
    ${generarLinea(495, 680, 0, 600)}   // Línea interior vertical #4 Caja 6
    ${generarLinea(625, 680, 0, 600)}   // Línea interior vertical #5 Caja 6
    ${generarLinea(30, 1280, 760, 0)}  // Línea inferior Caja 6
    ${generarLinea(30, 680, 0, 600)}   // Línea left Caja 6
    ${generarLinea(790, 680, 0, 600)}  // Línea right Caja 6
    ^XZ`;
  return zpl;
};
