//Lista de caracteres
const LISTA_DE_CARACTERES = new Array(
    "A", "B", "C", "D", "E",
    "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O",
    "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y",
    "Z", " ", ".", ",", "(",
    "+", "/", "&", "%", "#",
    ")", "{", "}", "[", "]",
    "-", "¡", "!", "¿", "?",
    "0", "1", "2", "3", "4",
    "5", "6", "7", "8", "9"
);
//llaves de los caracteres
let LLAVES_DE_CARACTERES = new Array();

//Listas
const ListaDeEncriptados = new Array();
const ListaDeDesencriptados = new Array();
//inputs
let CuadrosDeLLaves = new Array();

let tablaDeLlaves, Encabezado, CuerpoDeTabla;

//Variables Area
let textArea, textAreaR;
//Variables del canvas
let canvasBlanco, imagenAlura, textoNR;
//Variables Botones
let botonEncriptar, botonDesencriptar, botonCopiar, botonGuardar;
//Cadena Auxiliar
let cadenaProbicional, CadenaDeLLaveAux, CadenaDeCopiarAux;
//Banderas
let bandera = true;

//Principal (Despues de que carge la pagina)
window.onload = function () {

    try {
        const TodosLosCaracteres = "abcdefghijklmnopqrstuvwxyz0123456789,.[]()+-?¡¿!=*";
        //Llenamos el arreglo con llaves aleatorias
        for (let i = 0; i < LISTA_DE_CARACTERES.length; i++) {
            let cadenaAleatoria = "";
            for (let j = 0; j < 4; j++) {
                cadenaAleatoria += TodosLosCaracteres.charAt(Math.floor(Math.random() * TodosLosCaracteres.length));
            }
            LLAVES_DE_CARACTERES.push(cadenaAleatoria);
        }

        try {
            //Creamos tabla
            crearTabla();
        } catch (error) {
            alert("ERROR EN LA TABLA, -> " + error.name + ": " + error.message);
        }

        CadenaDeCopiarAux = "";

        //Area de texto
        textArea = document.getElementById("area");
        limpiarArea();
        textArea.focus();
        eventArea();

        //Boton encriptar
        botonEncriptar = document.getElementById("encriptar");
        desabilitarBoton(botonEncriptar, true);
        botonEncriptar.onclick = encriptar;

        //Boton encriptar
        botonDesencriptar = document.getElementById("desencriptar");
        desabilitarBoton(botonDesencriptar, true);
        botonDesencriptar.onclick = desencriptar;

        //vanvas, Imagen y Texto
        canvasBlanco = document.getElementById("rectanguloBlanco");
        imagenAlura = document.getElementById("imagenAlura");
        textoNR = document.getElementById("textoDeNingunResultado");

        //Area de texto del resultado
        textAreaR = document.getElementById("areaR");
        textAreaR.disabled = true; //Bloqueamos esta area

        //Boton de copiar
        botonCopiar = document.getElementById("copiar");
        botonGuardar = document.getElementById("guardar");
    } catch (error) {
        alert("ERROR, -> " + error.name + ": " + error.message);
    }


}

//--------- TABLA DE SIMBOLOS -----------------------


//TABLA
function crearTabla() {
    //Creamos tabla y componentes
    tablaDeLlaves = document.createElement('table');
    Encabezado = document.createElement('thead');
    CuerpoDeTabla = document.createElement('tbody');

    //Agregamos a la tabla
    tablaDeLlaves.appendChild(Encabezado);
    tablaDeLlaves.appendChild(CuerpoDeTabla);

    EncabezadoDeTabla();
    datosDeLaTabla();

    // Adding the entire table to the body tag
    document.getElementById('cajaD').appendChild(tablaDeLlaves);
}

//EncabezadoDeTabla
function EncabezadoDeTabla() {

    //ENCABEZADO
    let EncabezadoDeTabla = document.createElement('tr');
    let heading_1 = document.createElement('th');
    heading_1.innerHTML = "NUMERO";
    let heading_2 = document.createElement('th');
    heading_2.innerHTML = "CARACTER";
    let heading_3 = document.createElement('th');
    heading_3.innerHTML = "LLAVE";
    let heading_4 = document.createElement('th');
    heading_4.innerHTML = "CONCATENAR LLAVE";


    //Agregamos al encabesado
    EncabezadoDeTabla.appendChild(heading_1);
    EncabezadoDeTabla.appendChild(heading_2);
    EncabezadoDeTabla.appendChild(heading_3);
    EncabezadoDeTabla.appendChild(heading_4);
    Encabezado.appendChild(EncabezadoDeTabla);
}

//Datos de la tabla
function datosDeLaTabla() {

    for (let i = 0; i < LLAVES_DE_CARACTERES.length; i++) {
        //Creamos la fila N
        let FilaDeTabla = document.createElement('tr');

        //Numero de Fila
        let NumeroDeFila = document.createElement('td');
        NumeroDeFila.innerHTML = i + 1;
        //Caracter de la fila
        let CaracterDeFila = document.createElement('td');
        CaracterDeFila.innerHTML = LISTA_DE_CARACTERES[i];
        //Llave de la fila
        let LlaveDeFila = document.createElement('td');
        //Cuadro de texto
        CuadrosDeLLaves.push(LlaveDeFila.appendChild(document.createElement('input')));
        CuadrosDeLLaves[i].value = LLAVES_DE_CARACTERES[i];
        CuadrosDeLLaves[i].setAttribute("maxlength", "4"); //Max 4 elementos

        //Al entrar
        CuadrosDeLLaves[i].addEventListener('mouseover', function (objetoEvento) {
            CadenaDeLLaveAux = CuadrosDeLLaves[i].value;
            CuadrosDeLLaves[i].focus();
        });
        //Al Salir
        CuadrosDeLLaves[i].addEventListener('mouseout', function (objetoEvento) {
            noEspacios(i);
        });

        //Boton de la fila
        let BotonDeFila = document.createElement('button');
        BotonDeFila.innerHTML = "copiar";

        //Evento a este boton
        BotonDeFila.addEventListener('click', function (event) {
            concatenarTextoDeLlaves(i);
            //CuadrosDeLLaves[i].scrollIntoView(); //Vista
            const x = event.pageX;
            //y es igual a posicion y del objeto - la posision y del raton
            const y = event.pageY - event.clientY;
            window.scroll(x, y);

        });

        //Agregamos datos a la fila
        FilaDeTabla.appendChild(NumeroDeFila);
        FilaDeTabla.appendChild(CaracterDeFila);
        FilaDeTabla.appendChild(LlaveDeFila);
        FilaDeTabla.appendChild(BotonDeFila);

        //Agregamosa a la tabla
        CuerpoDeTabla.appendChild(FilaDeTabla);
    }

}

//Guardar nueva clave de llave
function guardarLlavePorFila(fila, texto) {

    //Cambiamos dato de la lista de llaves
    LLAVES_DE_CARACTERES[fila] = texto;
    CuadrosDeLLaves[fila].value = texto;
    CuadrosDeLLaves[fila].blur();
    //Resetiamos
    textArea.value = "Ingrese el texto aquí";
    textAreaR.value = null;


}

//No permitir espacios y con 4 elementos
function noEspacios(fila) {
    //Optenemos el texto en minuscula
    let texto = CuadrosDeLLaves[fila].value.toLowerCase();
    if (CadenaDeLLaveAux === CuadrosDeLLaves[fila].value) {
        CuadrosDeLLaves[fila].blur();
        return
    }
    var noValido = / /;
    //Si tiene menos de 4 elementos o espacios o ya existe esa llave
    if (texto.length < 4 || noValido.test(texto) || buscarLlave(LLAVES_DE_CARACTERES, texto)) {
        //Si tiene el mismo valor 
        if (texto === LISTA_DE_CARACTERES[fila].toLowerCase()) {
            guardarLlavePorFila(fila, texto);
            return;
        }
        CuadrosDeLLaves[fila].value = CadenaDeLLaveAux;
        CuadrosDeLLaves[fila].blur();
    } else {
        guardarLlavePorFila(fila, texto);
    }
}

//Copiar y concatenar llave
function concatenarTextoDeLlaves(fila) {
    //Creamos un imput
    let entrada = document.body.appendChild(document.createElement("input"));
    CadenaDeCopiarAux += CuadrosDeLLaves[fila].value;
    //Le damos valor del area al imput
    entrada.value = CadenaDeCopiarAux;

    try {

        //enfocamos un imput
        entrada.focus();
        //seleccionamos un imput
        entrada.select();
        //Copiamos
        document.execCommand('copy');
        //Eliminamos el imput
        entrada.parentNode.removeChild(entrada);
    } catch (error) {
        alert("ERROR, " + error.name + ": " + error.message);
    }
}

//Buscar texto en un arreglo
function buscarLlave(Array, texto) {

    for (let i = 0; i < Array.length; i++) {
        if (Array[i] === texto) {
            return true;
        }

    }

    return false;
    F

}

//--------- TEXTAREA -----------------------

//Eventos de area
function eventArea() {


    //Al entrar al area
    textArea.onmouseover = limpiarArea;

    //Al salir del area
    textArea.onmouseout = resetearArea;

}

//Limpiar Area
function limpiarArea(evt) {
    //Si tiene este texto
    if (textArea.value == "Ingrese el texto aquí") {
        textArea.value = null;
        textArea.style.cssText = 'opacity: 100%;';
    }

    //Enfocar area
    textArea.focus();

}

//Resetear Area
function resetearArea(evt) {
    //Si no tiene este texto
    if (textArea.value === "") {
        textArea.value = "Ingrese el texto aquí";
        textArea.style.cssText = 'opacity: 50%;';
        //bloqueamos botones
        desabilitarBoton(botonEncriptar, true);
        desabilitarBoton(botonDesencriptar, true);
    } else {
        //desbloqueamos botones
        desabilitarBoton(botonEncriptar, false);
        desabilitarBoton(botonDesencriptar, false);
    }
    //Desenfocar area
    textArea.blur();
}

//Abilitar o desabilitar boton
function desabilitarBoton(boton, estado) {
    if (estado) {
        boton.disabled = true;
    } else {
        boton.disabled = false;
    }

}


//--------- BOTON ENCRIPTAR -----------------

//Encriptar texto
function encriptar(evt) {
    //limpiamos la cadena auxiliar
    cadenaProbicional = "";
    //Optenemos en texto del area
    recorrerCadena(textArea.value);
    //Aumentamos la lista
    ListaDeEncriptados.push(cadenaProbicional);

    actualizar();

}

//Recorremos cadena
function recorrerCadena(cadena) {
    for (let i = 0; i < cadena.length; i++) {
        encriptarCaracteres(cadena[i]);
    }
}

//Ponemos valor a los caracteres
function encriptarCaracteres(caracter) {
    for (let i = 0; i < LISTA_DE_CARACTERES.length; i++) {
        //Si el caracter es una vocal mayuscula
        if (caracter.toUpperCase() === LISTA_DE_CARACTERES[i]) {
            //Le damos un caracter encriptado
            cadenaProbicional += LLAVES_DE_CARACTERES[i];
            return; //retornamos
        }
    }
    //Ponemos caracter por default
    cadenaProbicional += caracter;
}

//--------- BOTON DESENCRIPTAR -----------------

function actualizar() {
    //Mostramos en la cadena desencriptada
    textAreaR.value = cadenaProbicional;
    //Actualizamos boton de copiar
    botonCopiar.disabled = false;
    botonCopiar.style.backgroundColor = "var(--Color-Tema-A)";
    botonCopiar.style.color = "var(--Color-Tema-B)";
    botonCopiar.style.opacity = '100%';
    //Actualizamos boton de guardar
    botonGuardar.disabled = false;
    botonGuardar.style.backgroundColor = "var(--Color-Tema-A)";
    botonGuardar.style.color = "var(--Color-Tema-B)";
    botonGuardar.style.opacity = '100%'
    //Reseteamos Area
    textArea.value = null;
    resetearArea();
    //resetiamos concatenacion de numeros
    CadenaDeCopiarAux = "";

    //Solo una vez
    if (bandera) {
        //Ocultamos rectangulo y mostramos area
        actualizarCaja2();
        bandera = false;
    }

}

//Desencriptar texto
function desencriptar(evt) {
    //limpiamos la cadena auxiliar
    cadenaProbicional = "";
    //Optenemos en texto del area
    desencriptarCaracteres(textArea.value);
    //Aumentamos la lista
    ListaDeDesencriptados.push(cadenaProbicional);

    actualizar();

}

//Primera fase (Crear un arreglo de arreglos con las pociciones de las llaves)
function desencriptarCaracteres(cadena) {
    //Arreglo de arreglos
    let arrayAux = new Array();
    //Recoreremos el arreglo de llaves
    for (let i = 0; i < LLAVES_DE_CARACTERES.length; i++) {
        //Arreglo para saver cuantas llaves de este tipo existen
        let arrayProbicional = new Array();
        //Numero de auxilio
        let noAux = 0;
        //Cadena provicional
        let cadenaAux = cadena;
        //Recoreremos la cadena
        for (let j = 0; j < cadenaAux.length; j++) {
            //Saber la posicion de las llaves de cierto tipo desde el no auxiliar asta el fin de la cadena
            let posicion = cadenaAux.substring(noAux, cadenaAux.length).indexOf(LLAVES_DE_CARACTERES[i]);
            //Si encontro esta llave en la cadena
            if (posicion !== -1) {
                //Guardamos la posicion
                arrayProbicional.push(posicion + noAux);
                //le aumentamos a la posicion el tamaño de la llave
                noAux += posicion + LLAVES_DE_CARACTERES[i].length;
            }
        }
        //Ordenamos el arreglo de esta llave de menor a mayor 
        arrayProbicional = arrayProbicional.sort(function (a, b) {
            return a - b
        });
        //le ponemos al final la cadena de la llave
        arrayProbicional.push(LISTA_DE_CARACTERES[i]);
        //Guaradamos el arreglo de esta llave en el arreglo mayor
        arrayAux.push(arrayProbicional);
    }

    //Mandamos el array y la cadena para que se acomode
    acomodarTexto(arrayAux, cadena);

}

//Segunda fase (Acomodar los arreglos por las posiciones de la cadena)
function acomodarTexto(arrayDeArrays, cadena) {

    //Arreglos gemelos (Uno de posiciones y otro de los caracteres de las llave)
    let ArrayPociciones = new Array();
    let ArrayCaracteres = new Array();

    //Recorremos el arreglo de arreglos
    for (let i = 0; i < arrayDeArrays.length; i++) {

        //Creamos un sub arreglo
        let MiniArray = arrayDeArrays[i];

        //recorremos los arreglos inferiores excepto el del final que tiene la cadena
        for (let j = 0; j < MiniArray.length - 1; j++) {

            //Guardamos pociciones de esta llave
            ArrayPociciones.push(MiniArray[j]);
            //Guardamos caracter de esta llave (esta al final)
            ArrayCaracteres.push(MiniArray[MiniArray.length - 1]);

        }
    }

    //Copeamos el arreglo
    let arrayCopia = ArrayPociciones.slice();


    //Recorremos la cadena
    for (let i = 0; i < cadena.length; i++) {

        //Valor minimo de un arreglo
        let minimo = 0;

        //Si el arreglo tiene mas de un elemento
        if (ArrayPociciones.length > 1) {
            //Optenemos la posicion minima del array
            minimo = Math.min(...ArrayPociciones);
        } else { //cuando solo queda 1
            minimo = ArrayPociciones[0];
        }

        //Si el minimo se posiciona en el indice la cadena
        if (i == minimo) {
            //buscamos el caracter de esta llave y la obtenemos
            let caracter = ArrayCaracteres[retornarPosicion(arrayCopia, minimo)];
            //Concatenamos el caracter en la cadena de respuesta
            cadenaProbicional += caracter;
            //Eliminamos el numero minimo del arreglo y este se hace mas pequeño
            ArrayPociciones = eliminarElemento(ArrayPociciones, minimo);
            //el indice aumenta los espacios que ocupa esta llave
            i += retornarLlaves(caracter);
        } else {
            //Ponemos el caracter por defecto
            cadenaProbicional += cadena[i];
        }

    }

    //Convertimos a minusculas
    cadenaProbicional = cadenaProbicional.toLowerCase();

}

//Eliminar elemento
function eliminarElemento(Array, n) {

    //Recorremos
    for (let i = 0; i < Array.length; i++) {
        //Eliminar por busqueda
        if (Array[i] === n) {
            //Eliminamos la posicion del indice
            Array.splice(i, 1)
            return Array;
        }

    }
}

//Retornar una posicion
function retornarPosicion(Array, n) {
    //Recorremos
    for (let i = 0; i < Array.length; i++) {
        //Retornamos indice por busqueda
        if (parseInt(Array[i]) === parseInt(n)) {
            return i;
        }

    }
}

//retornar un caracter de una llave
function retornarLlaves(caracter) {

    //Recorremos
    for (let i = 0; i < LLAVES_DE_CARACTERES.length; i++) {
        //Buscamos caracter
        if (LISTA_DE_CARACTERES[i] === caracter) {
            //Retornamos la posicion de ese caracter
            return parseInt(LLAVES_DE_CARACTERES[i].length - 1);
        }

    }
}

//--------- Ocultar Area -----------------
//Ocultar el rectangulo y componentes y Mostrar Resultado
function actualizarCaja2() {
    const tx = "visibility: hidden;"
    //Ocultar
    canvasBlanco.style.cssText = tx;
    imagenAlura.style.cssText = tx;
    textoNR.style.cssText = tx;
    //Mostrar
    textAreaR.style.cssText = "visibility: visible;";
    botonCopiar.style.cssText = "visibility: visible;";
    botonGuardar.style.cssText = "visibility: visible;";

}

//Copiar un texto
function copiarTexto() {

    //Creamos un imput
    let entrada = document.body.appendChild(document.createElement("input"));
    //Le damos valor del area al imput
    entrada.value = textAreaR.value;

    try {

        //enfocamos un imput
        entrada.focus();
        //seleccionamos un imput
        entrada.select();
        //Copiamos
        document.execCommand('copy');
        //Eliminamos el imput
        entrada.parentNode.removeChild(entrada);
    } catch (error) {
        alert("ERROR, " + error.name + ": " + error.message);
    } finally {
        textAreaR.value = null;
        botonCopiar.disabled = true;
        botonCopiar.style.backgroundColor = "var(--Color-Tema-B)"; //C de fondo
        botonCopiar.style.color = "var(--Color-Tema-A)"; //C de letra
        botonCopiar.style.opacity = '50%';
        document.body.scrollIntoView(); //Ir asta arriba
    }
}

let NoDeGuardados = 1;

//Boton de guardado
function Botonguardar() {

    //Verificamos que tengamos historial
    if (ListaDeEncriptados.length === 0 && ListaDeDesencriptados.length === 0) {
        alert("ERROR, Aun no hacer alguna accion");
        return;
    }

    let contenido = "HISTORIAL DEL INCRIPTADOR\n";

    //Fecha y hora
    const d = new Date();
    const hora = d.getHours() +
        ":" + d.getMinutes() +
        ":" + d.getSeconds();
    const fecha = d.getDay() +
        "-" + (d.getMonth() + 1) +
        "-" + d.getFullYear();

    contenido += "Hora: " + hora +
        " Fecha: " + fecha + "\n\n";

    //Lista
    contenido += "Encriptados (" + ListaDeEncriptados.length + "): \n"
    for (let i = 0; i < ListaDeEncriptados.length; i++) {
        contenido += (i + 1) + ". " + ListaDeEncriptados[i] + "\n";
    }
    contenido += "Desencriptados(" + ListaDeDesencriptados.length + "): \n"
    for (let i = 0; i < ListaDeDesencriptados.length; i++) {
        contenido += (i + 1) + ". " + ListaDeDesencriptados[i] + "\n";
    }

    //Lista de simbolos
    contenido += "\n\n LISTA DE SIMBOLOS";
    contenido += "\nSIMBOLO ---> LLAVES\n"
    let Aux = 0;
    for (let i = 0; i < LLAVES_DE_CARACTERES.length; i++) {
        if (Aux < 5) {
            contenido += "   " + LISTA_DE_CARACTERES[i] + "    ---> " + LLAVES_DE_CARACTERES[i] + "    ";
        } else {
            contenido += "\n\n";
            Aux = 0;
        }
        Aux++;
    }

    //Nombre del archivo
    let nombre = "";
    if (NoDeGuardados > 1) {
        nombre = "Historial del encriptador " + fecha + " (" + NoDeGuardados + ")";
    } else {
        nombre = "Historial del encriptador " + fecha;
    }
    //Guardamos
    guardarArchivoDeTexto(contenido, nombre);

}

//Guardar TXT
function guardarArchivoDeTexto(contenido, nombre) {
    //Tipo de archivo
    const file_type = 'text/plain';
    //Archivo (tipo blob texto/plano)
    let file = new Blob([contenido], {
        type: file_type
    });

    try {

        //Verificamos si el navegador tiene soporte para msSaveOrOpenBlob
        if (window.navigator.msSaveOrOpenBlob)
            window.navigator.msSaveOrOpenBlob(file, file_name);
        else { //si no
            //Creamos una etiqueta de anclaje
            let a = document.createElement("a"),
                //La url
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = nombre;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
        //Aumentamos
        NoDeGuardados++;

        //Actualizamos boton
        botonGuardar.disabled = true;
        botonGuardar.style.backgroundColor = "var(--Color-Tema-B)"; //C de fondo
        botonGuardar.style.color = "var(--Color-Tema-A)"; //C de letra
        botonGuardar.style.opacity = '50%';
        document.body.scrollIntoView(); //Ir asta arriba

    } catch (error) {
        alert("ERROR, -> " + error.name + ": " + error.message);
    }

}




/*
 //Seleccionamos el texto del area
             var textoAcopiar = document.getElementById('areaR').innerHTML;
        navigator.clipboard.writeText(textoAcopiar)
            .then(() => {

                let input = document.body.appendChild(document.createElement("input"));
                input.value = textAreaR.value;
                console.log(input.value );
                input.focus();
                input.select();
                document.execCommand('copy');
                input.parentNode.removeChild(input);
                console.log("Texto copiado al portapapeles...")
            })
            .catch(err => {
                console.log('Algo salió mal: ', err);
            });
        let res;
        let textoCpiar = document.getElementById("areaR");
        //Creamos un intervalo de selección
        let seleccion = document.createRange();
        //Se añade a la selección el elemento
        seleccion.selectNodeContents(textoCpiar);
        //Se deselecciona cualquier cosa que estuviese previamente seleccionada en la página
        window.getSelection().removeAllRanges();
        //Se realiza la selección del contenido mediante los método getSelection().addRange()
        window.getSelection().addRange(seleccion);
        //Se lanza el comando de copiado
        res = document.execCommand('copy');
        //Se deselecciona el elemento, ya que de no hacerlo quedaría resaltado en la página
        window.getSelection().removeRange(seleccion);
*/