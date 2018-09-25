var uuid = '';
var boolUpdate = false;

var app = {
    initialize: function() {
      this.bindEvents();
    },
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        initPushwoosh();

        $('#loader').modal('show');

        uuid = device.uuid;

        Keyboard.hideFormAccessoryBar(true);

        document.addEventListener("offline", onOffline, false);
        checkConnection();

        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var url_put = 'https://bdtecnicomirage.firebaseio.com/users/' + uuid + '.json';

        $.ajax({
                url: url_put,
                type: "GET",
                success: function (data) {

                    if (data) {
                        var dataUser = {
                            nombre : data.nombre,
                            apellido : data.apellido,
                            correo : data.correo,
                            tel : data.tel,
                            estado : data.estado,
                            municipio : data.municipio,
                            cp : data.cp,
                            isCsam : data.isCsam,
                            csamNum : data.csamNum,
                            csamAut : data.csamAut,
                        }

                        sessionStorage.setItem('user', JSON.stringify(dataUser));

                        $('.mnu-perfil').removeClass('is-hidden');
                    }
                    else {
                        $('.mnu-registro').removeClass('is-hidden');

                        var dataUser = {
                            isCsam : 0,
                        }

                        sessionStorage.setItem('user', JSON.stringify(dataUser));

                        setTimeout(function(){
                            $('#loader').modal('hide');
                        },1000);
                    }

                    $('.noticia-fill').empty();
                    loadNoticias();
                },
                error: function(error) {
                    swal('', 'Estamos presentando una falla, favor de regresar mas tarde. (err01)');
                    $('.noticia-fill').empty();
                    loadNoticias();
                }
            });

        if (window.screen.height > 480) {
            $('.regP1, .perfil').find('div.input-group').addClass('input-group-lg');
            $('.regP1, .perfil').find('div.input-group').removeClass('mb-2').addClass('mb-3');
        }

        var noticia = document.querySelector('.noticia'), ntc = new Hammer(noticia);

        ntc.on("tap", function(ev) {
            var $target = $(ev.target);

            if (ev.type == 'tap') {
                $('.noticia').css("transition","");

                if ($target.data('item') == 'menu') {
                    if ($('.noticia').hasClass('is-center')) {
                        $('.noticia').removeClass('is-center').addClass('is-half');
                    }
                    else {
                        $('.noticia').removeClass('is-half').addClass('is-center');
                    }
                }
                else if ($target.data('link') == 'articulo') {
                    $('.articulo-fill').empty();
                    var news = JSON.parse(sessionStorage.getItem('news'));
                    var newIndex = $target.data('num');
                    $('.articulo-fill').append(news[newIndex].articulo);

                    $('.noticia').removeClass('is-center').addClass('is-left');
                    $('.articulo').removeClass('is-right').addClass('is-center');
                }
                else if ($target.data('link') == 'back') {
                    $('.noticia').removeClass('is-center').addClass('is-half');
                }
                else if ($target.data('item') == 'update') {
                    $('#loader').modal('show');
                    $('.noticia-fill').empty();
                    loadNoticias();
                }
            }
        });

        var articulo = document.querySelector('.articulo'), art = new Hammer(articulo);

        art.on("tap", function(ev) {
            var $target = $(ev.target);

            if ($target.data('link') == 'back') {
                $('.articulo').removeClass('is-center').addClass('is-right');
                $('.noticia').removeClass('is-left').addClass('is-center');
            }
        });
    }
};

function checkOutMenu(element, fuente) {
    var $e1 = $(element[0]);

    for (var i = 0; i < fuente.length; i++) {
        var e = fuente[i];
        e.removeClass('is-half').removeClass('is-center').addClass('is-right');
    }

    $e1.removeClass('is-right').addClass('is-center');
}

function onOffline() {
    swal('', 'Favor de conectarse a la red');
}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
}

// Descargar Noticias
function loadNoticias() {
    var url_put = 'https://bdtecnicomirage.firebaseio.com/news.json';

    $.ajax({
        url: url_put,
        type: "GET",
        success: function (data) {
            setTimeout(function() {

                try {

                    if (data != null) {
                        var dataUser = JSON.parse(sessionStorage.getItem('user'));
                        var estado = checkEstado(dataUser.estado), today = moment(), isCsam = dataUser.csamAut;

                        var arr = [];
                        arr = $.map(data, function(value, index) {

                            var fecha = value.fecha;
                            var realDate = moment().year(parseInt(fecha.substr(6,4))).month(parseInt(fecha.substr(3,2)) -1).date(parseInt(fecha.substr(0,2)));

                            if (today.diff(realDate, 'days') >= 0) {

                                if ((value.estado == estado) || (value.estado == 0)) {
                                    if (isCsam == 1) {
                                        return [value];
                                    }
                                    else {
                                        if (value.csam == 0) {
                                            return [value];
                                        }
                                    }
                                }
                            }
                        });
                        arr.reverse();
                        sessionStorage.setItem('news', JSON.stringify(arr));
                        fillNoticias(arr, true);
                    }
                    else {
                        fillNoticias(data, false);
                    }

                } catch (e) {
                    fillNoticias(data, false);
                }

                $('#loader').modal('hide');
            }, 1000);

        },
        error: function(error) {
            fillNoticias(data, false)
        }
    });
}

function fillNoticias(data, bool) {
    var finale = "";

    if (bool) {
        var tmp = "";
        tmp += "<section class='notice typeA d-flex flex-column justify-content-between mb-2'>";
        tmp += "<header class='notice-header d-flex flex-column justify-content-between :importantHeader:'>";
        tmp += "<div class='notice-title' data-link='articulo' data-num=':num:'>:titulo:</div>";
        tmp += "<div class='notice-date' data-link='articulo' data-num=':num:'>:fecha:</div>";
        tmp += "</header>";
        tmp += "<article class='notice-body d-flex justify-content-between align-items-center :importantBody:' data-link='articulo' data-num=':num:'>";
        tmp += "<div class='notice-text' data-link='articulo' data-num=':num:'>:descripcion:</div>";
        tmp += "<i class='fas fa-chevron-right' data-link='articulo' data-num=':num:'></i>";
        tmp += "</article>";
        tmp += "</section>";

        var dataUser = JSON.parse(sessionStorage.getItem('user'));

        data.forEach(function (el, i) {
            var temp;

            var headImportant = '', bodyImportant = '';

            if (el.importancia === "1") {
                headImportant = 'is-importHighHead';
                bodyImportant = 'is-importHighBody';
            }
            else if (el.importancia === "2") {
                headImportant = 'is-importMidHead';
                bodyImportant = 'is-importMidBody';
            }
            else {
                headImportant = 'is-importLowHead';
                bodyImportant = 'is-importLowBody';
            }

            temp = tmp.replace(':titulo:', el.titulo)
                .replace(':fecha:', el.fecha)
                .replace(':descripcion:', el.descripcion)
                .replace(':importantHeader:', headImportant)
                .replace(':importantBody:', bodyImportant)
                .replace(/:num:/g, i);

            // if (i === 0) {
            //     temp = tmp.replace(':titulo:', el.titulo)
            //     .replace(':fecha:', el.fecha)
            //     .replace(':descripcion:', el.descripcion)
            //     .replace(':importantHeader:', headImportant)
            //     .replace(':importantBody:', bodyImportant)
            //     .replace(/:num:/g, i);
            // }
            // else {
            //     temp = tmp2.replace(':titulo:', el.titulo)
            //     .replace(':fecha:', el.fecha)
            //     .replace(':descripcion:', el.descripcion)
            //     .replace(':importantHeader:', headImportant)
            //     .replace(':importantBody:', bodyImportant)
            //     .replace(/:num:/g, i);
            // }

            finale += temp;
        });
    }
    else {
        finale += "<article class='text-center mx-auto mt-5' style='width:200px;'>";
        finale += "<i class='fas fa-cloud mb-3' style='font-size:68px; color:rgba(0,0,0,.6)'></i>";
        finale += "<p class='text-muted'>Por el momento no se han generado noticias.</p>";
        finale += "<small class='text-muted'>Toque el boton de actualización en la parte superior de la derecha.</small>";
        finale += "</article>";
    }

    var $finale = $(finale);
    $('.noticia-fill').empty();
    $('.noticia-fill').append($finale);
}

function onPushwooshInitialized(pushNotification) {

	pushNotification.getPushwooshHWID(
		function(token) {
			console.log('Pushwoosh HWID: ' + token);
		}
	);

}

function initPushwoosh() {
	var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");

	document.addEventListener('push-notification',
		function(event) {
			var message = event.notification.message;
			var userData = event.notification.userdata;

			if (typeof(userData) != "undefined") {
				console.log('user data: ' + JSON.stringify(userData));
			}
		}
    );

    pushNotification.onDeviceReady({
        projectid: "430274723087",
        appid: "3FD66-F50FD",
        serviceName: ""
    });

	pushNotification.registerDevice(
		function(status) {
			onPushwooshInitialized(pushNotification);
		},
		function(status) {
			swal('', JSON.stringify(['failed to register ', status]));
		}
	);
}

function checkEstado(str) {
    switch (str) {
        case ('Aguascalientes'):
            return '1'
            break;
        case ('Baja California'):
            return '2'
            break;
        case ('Baja California Sur'):
            return '3'
            break;
        case ('Campeche'):
            return '4'
            break;
        case ('Ciudad de México'):
            return '5'
            break;
        case ('Coahuila'):
            return '6'
            break;
        case ('Colima'):
            return '7'
            break;
        case ('Chiapas'):
            return '8'
            break;
        case ('Chihuahua'):
            return '9'
            break;
        case ('Durango'):
            return '10'
            break;
        case ('Guanajuato'):
            return '11'
            break;
        case ('Guerrero'):
            return '12'
            break;
        case ('Hidalgo'):
            return '13'
            break;
        case ('Jalisco'):
            return '14'
            break;
        case ('Edo. de México'):
            return '15'
            break;
        case ('Michoacán'):
            return '16'
            break;
        case ('Morelos'):
            return '17'
            break;
        case ('Nayarit'):
            return '18'
            break;
        case ('Nuevo León'):
            return '19'
            break;
        case ('Oaxaca'):
            return '20'
            break;
        case ('Puebla'):
            return '21'
            break;
        case ('Querétaro'):
            return '22'
            break;
        case ('Quintana Roo'):
            return '23'
            break;
        case ('San Luis Potosí'):
            return '24'
            break;
        case ('Sinaloa'):
            return '25'
            break;
        case ('Sonora'):
            return '26'
            break;
        case ('Tabasco'):
            return '27'
            break;
        case ('Tamaulipas'):
            return '28'
            break;
        case ('Tlaxcala'):
            return '29'
            break;
        case ('Veracruz'):
            return '30'
            break;
        case ('Yucatán'):
            return '31'
            break;
        case ('Zacatecas'):
            return '32'
            break;
        default:
            return '0'
    }
}
