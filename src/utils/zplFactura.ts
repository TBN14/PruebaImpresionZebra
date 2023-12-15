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
    ${generarTextoAlineado('Estrato', 440, 30, 215, 'center', 20)},
    ${generarTextoAlineado('1C', 470, 30, 215, 'center')},
    ${generarTextoAlineado('Ruta', 440, 215, 430, 'center', 20)},
    ${generarTextoAlineado('10010000', 470, 215, 430, 'center')},
    ${generarLinea(30, 500, 400, 0)}  // Línea #2 interior Caja 5
    ${generarTextoAlineado('Numero de', 510, 30, 215, 'center')},
    ${generarTextoAlineado('medidor', 530, 30, 215, 'center')},    
    ${generarTextoAlineado('0000000000', 555, 30, 215, 'center')},     
    ${generarTextoAlineado('Novedad', 510, 215, 430, 'center')},   
    ${generarTextoAlineado('MEDIDOR', 535, 215, 430, 'center')},   
    ${generarTextoAlineado('INVERTIDO', 555, 215, 430, 'center')},   
    ${generarLinea(30, 580, 400, 0)}  // Línea #3 interior Caja 5
    ${generarTextoAlineado('Lectura', 590, 30, 130, 'center', 20)},   
    ${generarTextoAlineado('anterior', 610, 30, 130, 'center', 20)},   
    ${generarTextoAlineado('1215', 635, 30, 130, 'center')},    
    ${generarTextoAlineado('Lectura', 590, 130, 230, 'center', 20)},   
    ${generarTextoAlineado('actual', 610, 130, 230, 'center', 20)},   
    ${generarTextoAlineado('1215', 635, 130, 230, 'center')},    
    ${generarTextoAlineado('Consumo', 600, 230, 300, 'center', 20)},      
    ${generarTextoAlineado('0', 635, 230, 330, 'center')},    
    ${generarTextoAlineado('Consumo', 590, 330, 430, 'center', 20)},      
    ${generarTextoAlineado('promedio', 610, 330, 430, 'center', 20)},      
    ${generarTextoAlineado('8', 635, 330, 430, 'center')},    
    ${generarLinea(30, 665, 400, 0)}  // Línea inferior Caja 5
    // ??????????????????????????????????????????????????????????????
    
    ${generarLinea(30, 680, 760, 0)}  // Línea superior Caja 6
    ${generarTextoAlineado('CONCEPTO', 690, 30, 200, 'left', 20)},
    ${generarTextoAlineado('M3', 690, 200, 250, 'left', 20)},
    ${generarTextoAlineado('VALOR UND', 690, 250, 370, 'left', 20)}, 
    ${generarTextoAlineado('ACUEDUCTO', 690, 370, 495, 'left', 20)},
    ${generarTextoAlineado('VALOR UND', 690, 495, 625, 'left', 20)},
    ${generarTextoAlineado('ALCANTARILLADO', 690, 625, 790, 'left', 20)},
    ${generarLinea(30, 710, 760, 0)}  // Línea interior horizontal #1 Caja 6
    ${generarTextoAlineado('Cargo Fijo', 720, 30, 200, 'left', 17)},
    ${generarTextoAlineado('Cons. Basico', 750, 30, 200, 'left', 17)},
    ${generarTextoAlineado('Cons. Complementario', 780, 30, 200, 'left', 17)},
    ${generarTextoAlineado('Cons. Suntuario', 810, 30, 200, 'left', 17)},
    ${generarTextoAlineado('Subsidio/Contribucion', 840, 30, 200, 'left', 17)},
    ${generarTextoAlineado('Tarifa Neta', 870, 30, 200, 'left', 17)},
    ${generarTextoAlineado('Saldo Anterior', 900, 30, 200, 'left', 17)},
    ${generarTextoAlineado('Interes Actual', 930, 30, 200, 'left', 17)},
    ${generarTextoAlineado('Ajuste', 960, 30, 200, 'left', 17)},
    ${generarTextoAlineado('Matricula', 990, 30, 200, 'left', 17)},
    ${generarTextoAlineado('Medidor', 1020, 30, 200, 'left', 17)},
    ${generarTextoAlineado(
      'Materiales Instalacion',
      1050,
      30,
      200,
      'left',
      17,
    )},
    ${generarTextoAlineado(
      'Cta. de Refinanciacion',
      1080,
      30,
      200,
      'left',
      17,
    )},
    ${generarTextoAlineado('Cuotas Anteriores', 1110, 30, 200, 'left', 17)},
    ${generarTextoAlineado('TOTAL A PAGAR', 1140, 30, 200, 'left', 17)},
    ${generarLinea(200, 680, 0, 480)}   // Línea interior vertical #1 Caja 6
    ${generarTextoAlineado('14', 750, 200, 250, 'center', 17)},
    ${generarTextoAlineado('14', 780, 200, 250, 'center', 17)},
    ${generarTextoAlineado('14', 810, 200, 250, 'center', 17)},
    ${generarLinea(250, 680, 0, 480)}   // Línea interior vertical #2 Caja 6
    ${generarTextoAlineado('1.442', 750, 250, 370, 'right', 17)},
    ${generarTextoAlineado('1.442', 780, 250, 370, 'right', 17)},
    ${generarTextoAlineado('1.442', 810, 250, 370, 'right', 17)},
    ${generarTextoAlineado('50%', 840, 250, 360, 'right', 17)},
    ${generarLinea(370, 680, 0, 480)}   // Línea interior vertical #3 Caja 6
    ${generarTextoAlineado('14.442', 720, 370, 495, 'right', 17)},
    ${generarTextoAlineado('14.442', 750, 370, 495, 'right', 17)},
    ${generarTextoAlineado('14.442', 780, 370, 495, 'right', 17)},
    ${generarTextoAlineado('14.442', 810, 370, 495, 'right', 17)},
    ${generarTextoAlineado('14.442', 840, 370, 495, 'right', 17)},
    ${generarTextoAlineado('14.442', 870, 370, 495, 'right', 17)},
    ${generarTextoAlineado('14.442', 900, 370, 495, 'right', 17)},
    ${generarTextoAlineado('14.442', 930, 370, 495, 'right', 17)},
    ${generarTextoAlineado('14.442', 960, 370, 495, 'right', 17)},
    ${generarTextoAlineado('14.442', 990, 370, 495, 'right', 17)},
    ${generarTextoAlineado('14.442', 1020, 370, 495, 'right', 17)},
    ${generarTextoAlineado('14.442', 1050, 370, 495, 'right', 17)},
    ${generarTextoAlineado('14.442', 1080, 370, 495, 'right', 17)},
    ${generarTextoAlineado('14.442', 1110, 370, 495, 'right', 17)},
    ${generarLinea(495, 680, 0, 480)}   // Línea interior vertical #4 Caja 6
    ${generarTextoAlineado('1.442', 750, 495, 625, 'right', 17)},
    ${generarTextoAlineado('1.442', 780, 495, 625, 'right', 17)},
    ${generarTextoAlineado('1.442', 810, 495, 625, 'right', 17)},
    ${generarTextoAlineado('50%', 840, 495, 615, 'right', 17)},
    ${generarLinea(625, 680, 0, 480)}   // Línea interior vertical #5 Caja 6
    ${generarTextoAlineado('14.442', 720, 625, 790, 'right', 17)},
    ${generarTextoAlineado('14.442', 750, 625, 790, 'right', 17)},
    ${generarTextoAlineado('14.442', 780, 625, 790, 'right', 17)},
    ${generarTextoAlineado('14.442', 810, 625, 790, 'right', 17)},
    ${generarTextoAlineado('14.442', 840, 625, 790, 'right', 17)},
    ${generarTextoAlineado('14.442', 870, 625, 790, 'right', 17)},
    ${generarTextoAlineado('14.442', 900, 625, 790, 'right', 17)},
    ${generarTextoAlineado('14.442', 930, 625, 790, 'right', 17)},
    ${generarTextoAlineado('14.442', 960, 625, 790, 'right', 17)},
    ${generarTextoAlineado('14.442', 990, 625, 790, 'right', 17)},
    ${generarTextoAlineado('14.442', 1020, 625, 790, 'right', 17)},
    ${generarTextoAlineado('14.442', 1050, 625, 790, 'right', 17)},
    ${generarTextoAlineado('14.442', 1080, 625, 790, 'right', 17)},
    ${generarTextoAlineado('14.442', 1110, 625, 790, 'right', 17)},
    ${generarLinea(30, 1160, 760, 0)}  // Línea inferior Caja 6
    ${generarLinea(30, 680, 0, 480)}   // Línea left Caja 6
    ${generarLinea(790, 680, 0, 480)}  // Línea right Caja 6
    ^XZ`;
  return zpl;
};
