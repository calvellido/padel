/*
 */

/*Inicialización*/
$(document).ready(function () {
  cargarCruces();
  cargarClasif();
  $("#table_id").DataTable();
  $("#tabla_cruces").DataTable();

  /*Botones para mostrar columnas adicionales*/
  $(".toggle-vis:input").on("change", function (e) {
    e.preventDefault();
    var column = $("#table_id").DataTable().column($(this).attr("data-column")); // Get the column API object
    column.visible(!column.visible()); // Toggle the visibility
    $("th").unbind("click.DT"); //Para desactivar ordenamiento en esta nueva columna
  });

  /*Establecer con cuántos puntos se considera victoria*/

  puntos_victoria = 21;

  $("input[name='puntos_victoria']").TouchSpin({
    min: 1,
    max: 100,
    step: 1,
    decimals: 0,
    boostat: 1,
    maxboostedstep: 1,
    initval: 21,
    buttondown_class: "btn btn-default btn-sm",
    buttonup_class: "btn btn-default btn-sm",
  });

  $("input[name='puntos_victoria']").on("change", function (e) {
    puntos_victoria = Number($(this).val());
    calculo_todos();
    $("#table_id").DataTable().destroy();
    cargarClasif();
  });
});

/*Obtención de datos*/
/*$.get('data/ip-pure_08.txt', function(data) {
	var perLine=data.split('\n');
    var myVars=[];
    for(i=0;i<perLine.length;i++){
		var line=perLine[i].split(' ');
		myVars[i]={
			'ronda':line[0],
			'cancha':line[1],
			'parejas':line[2]
        }
    }
    //alert(myVars);
    console.log(myVars);
    //console.log(myVars[0].time);
    //console.log(myVars[0].event);
    //console.log(myVars[0].color);
}, 'text');*/

function Jugador(letra) {
  this.letra = letra;
  this.nombre = letra || "X";
  this.puntos = [];
  this.puntos[0] =
    this.puntos[1] =
    this.puntos[2] =
    this.puntos[3] =
    this.puntos[4] =
    this.puntos[5] =
    this.puntos[6] =
      "";
  this.total_puntos = 0;
  this.balance = [];
  this.balance[0] =
    this.balance[1] =
    this.balance[2] =
    this.balance[3] =
    this.balance[4] =
    this.balance[5] =
    this.balance[6] =
      "";
  this.total_balance = 0;
  this.victorias = 0;
}

Jugador.prototype.calculo = function () {
  var sum = 0;
  var cont = 0;
  var dif = 0;
  for (var i = 0; i < this.puntos.length; ++i) {
    dif += Number(this.balance[i]);
    sum += Number(this.puntos[i]);
    if (this.puntos[i] === puntos_victoria) cont++;
  }
  this.victorias = cont;
  this.total_puntos = sum;
  this.total_balance = dif;
};

Jugador.prototype.borrar_puntos = function () {
  for (var i = 0; i < this.puntos.length; ++i) {
    this.balance[i] = "";
    this.puntos[i] = "";
  }
  this.victorias = 0;
  this.total_puntos = 0;
  this.total_balance = 0;
};

var jugadores = [
  new Jugador("A"),
  new Jugador("B"),
  new Jugador("C"),
  new Jugador("D"),
  new Jugador("E"),
  new Jugador("F"),
  new Jugador("G"),
  new Jugador("H"),
];
var letras = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7 };

function calculo_todos() {
  for (var i = 0; i < jugadores.length; ++i) {
    jugadores[i].calculo();
  }
}

function borrar_puntos_todos() {
  for (var i = 0; i < jugadores.length; ++i) {
    jugadores[i].borrar_puntos();
  }
}

function Partido(ronda, cancha, j1, j2, j3, j4) {
  this.ronda = ronda || 0;
  this.cancha = cancha || 0;
  this.jugador1 = j1;
  this.jugador2 = j2;
  this.jugador3 = j3;
  this.jugador4 = j4;
}

Partido.prototype.crearFormulario = function () {
  var j1_nombre = jugadores[letras[this.jugador1]].nombre;
  var j2_nombre = jugadores[letras[this.jugador2]].nombre;
  var j3_nombre = jugadores[letras[this.jugador3]].nombre;
  var j4_nombre = jugadores[letras[this.jugador4]].nombre;
  var j1j2_puntos = jugadores[letras[this.jugador1]].puntos[this.ronda - 1];
  var j3j4_puntos = jugadores[letras[this.jugador3]].puntos[this.ronda - 1];

  return (
    "<form role='form' class='resultadoCruces'>\
				<div class='form-group form-cruces'>\
					<label class='col-xs-9 col-sm-6 control-label' for='_" +
    this.jugador1 +
    this.jugador2 +
    "_'>" +
    j1_nombre +
    "/" +
    j2_nombre +
    "</label>\
					<div class='col-xs-3 col-sm-3'>\
						<input class='form-control text-center' type='number' maxlength='2' size='3' data-ronda='" +
    this.ronda +
    "' data-rivales='" +
    this.jugador3 +
    this.jugador4 +
    "' id='_" +
    this.jugador1 +
    this.jugador2 +
    "_' value='" +
    j1j2_puntos +
    "'>\
					</div>\
				</div>\
				<div class='form-group form-cruces'>\
					<label class='col-xs-9 col-sm-6 control-label' for='_" +
    this.jugador3 +
    this.jugador4 +
    "_'>" +
    j3_nombre +
    "/" +
    j4_nombre +
    "</label>\
					<div class='col-xs-3 col-sm-3'>\
						<input class='form-control text-center' type='number' maxlength='2' size='3' data-ronda='" +
    this.ronda +
    "' data-rivales='" +
    this.jugador1 +
    this.jugador2 +
    "' id='_" +
    this.jugador3 +
    this.jugador4 +
    "_' value='" +
    j3j4_puntos +
    "'>\
					</div>\
				</div>\
			</form>"
  );
};

var partidos_normal = [
  new Partido(1, 1, "A", "B", "C", "D"),
  new Partido(1, 2, "E", "F", "G", "H"),
  new Partido(2, 1, "A", "C", "E", "G"),
  new Partido(2, 2, "B", "D", "F", "H"),
  new Partido(3, 1, "B", "C", "F", "G"),
  new Partido(3, 2, "A", "D", "E", "H"),
  new Partido(4, 1, "A", "E", "B", "F"),
  new Partido(4, 2, "C", "G", "D", "H"),
  new Partido(5, 1, "B", "E", "D", "G"),
  new Partido(5, 2, "A", "F", "C", "H"),
  new Partido(6, 1, "B", "H", "C", "E"),
  new Partido(6, 2, "A", "G", "D", "F"),
  new Partido(7, 1, "C", "F", "D", "E"),
  new Partido(7, 2, "A", "H", "B", "G"),
];

var partidos_wiseman = [
  new Partido(1, 1, "H", "G", "F", "C"),
  new Partido(1, 2, "B", "A", "D", "E"),
  new Partido(2, 1, "G", "D", "H", "E"),
  new Partido(2, 2, "C", "B", "F", "A"),
  new Partido(3, 1, "H", "C", "E", "B"),
  new Partido(3, 2, "D", "A", "G", "F"),
  new Partido(4, 1, "E", "G", "B", "F"),
  new Partido(4, 2, "A", "C", "D", "H"),
  new Partido(5, 1, "A", "E", "C", "G"),
  new Partido(5, 2, "F", "H", "B", "D"),
  new Partido(6, 1, "C", "D", "G", "B"),
  new Partido(6, 2, "E", "F", "H", "A"),
  new Partido(7, 1, "D", "F", "E", "C"),
  new Partido(7, 2, "B", "H", "A", "G"),
];

var torneo = partidos_normal;

function cargarCruces() {
  $("#tabla_cruces").DataTable({
    paging: false,
    searching: false,
    info: false,
    autoWidth: true,
    data: torneo,
    columns: [
      { data: "ronda", visible: false },
      { data: "cancha", width: "5px" },
      { data: null, render: "crearFormulario" },
    ],
    order: [
      [0, "asc"],
      [1, "asc"],
      [2, "desc"],
    ],
    drawCallback: function (settings) {
      var api = this.api();
      var rows = api.rows({ page: "current" }).nodes();
      var last = null;
      api
        .column(0, { page: "current" })
        .data()
        .each(function (group, i) {
          if (last !== group) {
            $(rows)
              .eq(i)
              .before(
                '<td class="grupo-ronda" colspan="3">Ronda ' +
                  group +
                  "<td></td></td>"
              );
            last = group;
          }
        });
    },
  });
  $("th").unbind("click.DT");
}

function cargarClasif() {
  $("#table_id").DataTable({
    paging: false,
    searching: false,
    info: false,
    data: jugadores,
    columns: [
      /*{ data: 'letra' },*/
      { data: "nombre" },
      { data: "victorias" },
      {
        data: "total_balance",
        render: function (data, type, row) {
          //Añadir símbolo + a balance positivo
          return data < 1 ? data : "+" + data;
        },
      },
      { data: "total_puntos", visible: false },
    ],
    order: [
      [1, "desc"],
      [2, "desc"],
      [3, "desc"],
    ],
  });

  $("th").unbind("click.DT");
}

$("#registro").on("change", ":input", function () {
  var jugador_letra = $(this).attr("id");
  var jugador_num = $(this).attr("name");
  var oldValue = $(this).attr("data-initial-value");
  var newVal = $(this).val();
  var jugadorModificado = jugadores.filter(function(jugador) {
    return jugador.nombre === oldValue;
  })[0];
  jugadorModificado.nombre = newVal;
  $(this).attr('data-initial-value', newVal);

  $("#table_id").DataTable().destroy();
  cargarClasif();
  $("#tabla_cruces").DataTable().destroy();
  cargarCruces();
});

$("#tabla_cruces").on("change", ":input", function () {
  var jugador1_letra = $(this).attr("id").charAt(1);
  var jugador2_letra = $(this).attr("id").charAt(2);
  var ronda = parseInt($(this).data("ronda"), 10);
  var puntos = parseInt($(this).val(), 10);

  var rival1 = $(this).data("rivales").charAt(0);
  var rival2 = $(this).data("rivales").charAt(1);

  var diferencia = puntos - Number(jugadores[letras[rival1]].puntos[ronda - 1]);

  jugadores[letras[jugador1_letra]].puntos[ronda - 1] = puntos || "";
  jugadores[letras[jugador2_letra]].puntos[ronda - 1] = puntos || "";

  jugadores[letras[jugador1_letra]].balance[ronda - 1] = diferencia;
  jugadores[letras[jugador2_letra]].balance[ronda - 1] = diferencia;
  jugadores[letras[rival1]].balance[ronda - 1] = -diferencia;
  jugadores[letras[rival2]].balance[ronda - 1] = -diferencia;

  jugadores[letras[jugador1_letra]].calculo();
  jugadores[letras[jugador2_letra]].calculo();
  jugadores[letras[rival1]].calculo();
  jugadores[letras[rival2]].calculo();

  $("#table_id").DataTable().destroy();
  cargarClasif();
});

function cambiarTorneo(datos) {
  datos === "torneo_normal"
    ? (torneo = partidos_normal)
    : (torneo = partidos_wiseman);
  borrar_puntos_todos();
  $("#tabla_cruces").DataTable().destroy();
  cargarCruces();
  $("#table_id").DataTable().destroy();
  cargarClasif();
}

function sortearOrden() {
  var numPermutaciones = Math.floor(Math.random() * 8) + 8;

  for (var i = 0; i < numPermutaciones; ++i) {
    var numeroAleatorioA = Math.floor(Math.random() * 8);
    var numeroAleatorioB = Math.floor(Math.random() * 8);
  
    var nombreInicial = jugadores[numeroAleatorioA].nombre;
    jugadores[numeroAleatorioA].nombre = jugadores[numeroAleatorioB].nombre
    jugadores[numeroAleatorioB].nombre = nombreInicial;
  }

  borrar_puntos_todos();
  $("#tabla_cruces").DataTable().destroy();
  cargarCruces();
  $("#table_id").DataTable().destroy();
  cargarClasif();
}

function cambiarPistas() {
  for (var i = 1; i < jugadores.length; ++i) {
    var partidosPista = torneo.filter(function(partido) {
      return (partido.ronda === i);
    });

    var pistaInicial = partidosPista[0].cancha;
    partidosPista[0].cancha = partidosPista[1].cancha
    partidosPista[1].cancha = pistaInicial;
  }

  borrar_puntos_todos();
  $("#tabla_cruces").DataTable().destroy();
  cargarCruces();
  $("#table_id").DataTable().destroy();
  cargarClasif();
}

function resetear() {
  for (var i = 0; i < jugadores.length; ++i) {
    jugadores[i].nombre = $("#registro input[name='" + i + "']").val()
  }

  for (var i = 1; i < jugadores.length; ++i) {
    var partidosPista = torneo.filter(function(partido) {
      return (partido.ronda === i);
    });

    partidosPista[0].cancha = 1
    partidosPista[1].cancha = 2;
  }

  borrar_puntos_todos();
  $("#tabla_cruces").DataTable().destroy();
  cargarCruces();
  $("#table_id").DataTable().destroy();
  cargarClasif();
}

$(function () {
  $(".tipo_torneo .btn").click(function () {
    cambiarTorneo($(this).children("input").attr("id"));
  });
  $("#sortear").click(function () {
    sortearOrden();
  });
  $("#pistas").click(function () {
    cambiarPistas();
  });
  $("#resetear").click(function () {
    resetear();
  });
});

/*Evitar que se recargue la página al introducir resultado y pasar al siguiente campo*/
$("#cruces").on("submit", ".resultadoCruces", function () {
  //$('#A').focus();
  //$(this).next(".input").focus();
  //console.log($(this));
  return false;
});

/* Funciones auxiliares de aspecto general */
/* Para hacer que (des)aparezca la sombra de la barra de navegación según la posición de y */
$(window).scroll(function (e) {
  if ($(".navbar").offset().top > 25) {
    if (!$(".navbar").hasClass("shadow")) $(".navbar").addClass("shadow");
  } else $(".navbar").removeClass("shadow");
});

/* Para cerrar la lista cuando se clica un elemento de la barra de navegación colapsada */
$(".navbar a").on("click", function () {
  if ($(".navbar-toggle").is(":visible") && $(".navbar-nav").is(":visible"))
    $(".navbar-toggle").click();
});

/* Scrolling suave */
$(document).on("click", 'a[href^="#"]', function (e) {
  e.preventDefault();
  var $link = $(this);
  var anchor = $link.attr("href");
  $("html, body")
    .stop()
    .animate(
      {
        scrollTop: $(anchor).offset().top,
      },
      600
    );
});
