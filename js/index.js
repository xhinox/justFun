/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// var app = {
//     // Application Constructor
//     initialize: function() {
//         this.bindEvents();
//     },
//     // Bind Event Listeners
//     //
//     // Bind any events that are required on startup. Common events are:
//     // 'load', 'deviceready', 'offline', and 'online'.
//     bindEvents: function() {
//         document.addEventListener('deviceready', this.onDeviceReady, false);
//     },
//     // deviceready Event Handler
//     //
//     // The scope of 'this' is the event. In order to call the 'receivedEvent'
//     // function, we must explicitly call 'app.receivedEvent(...);'
//     onDeviceReady: function() {
//         app.receivedEvent('deviceready');
//     },
//     // Update DOM on a Received Event
//     receivedEvent: function(id) {
//         var parentElement = document.getElementById(id);
//         var listeningElement = parentElement.querySelector('.listening');
//         var receivedElement = parentElement.querySelector('.received');
//
//         listeningElement.setAttribute('style', 'display:none;');
//         receivedElement.setAttribute('style', 'display:block;');
//
//         console.log('Received Event: ' + id);
//     }
// };

// var swal = require('sweetalert');
var uuid = '';

$(document).ready(function (){
    document.addEventListener("deviceready",onDeviceReady,false);

    $('#txtTelefono').mask('(000) 000.0000');
    $('#codigoPostal').mask('00000');
    $("#NoCsam").prop("checked", true);


    // INICIA MENU
    var mnu = document.querySelector('.menu'), menu = new Hammer(mnu);

    menu.on("tap", function(ev) {
        var $target = $(ev.target);

        if ($target.data('link') == 'registrate') {
            $('.regP1').removeClass('is-right').addClass('is-center');
            $('.menu').removeClass('is-not-vanish').addClass('is-vanish');
        }
        else if ($target.data('link') == 'noticias') {

            var url_put = 'https://tecnico-mirage.firebaseio.com/news.json';

            $.ajax({
                url: url_put,
                type: "GET",
                success: function (data) {

                    var dataUser = JSON.parse(localStorage.getItem('dataUser'));

                    var estado = checkEstado(dataUser.estado), today = moment(), isCsam = dataUser.isCsam;

                    var arr = [];
                    arr = $.map(data, function(value, index) {

                        var fecha = value.fecha;
                        var realDate = moment().year(parseInt(fecha.substr(6,4))).month(parseInt(fecha.substr(3,2)) -1).dates(parseInt(fecha.substr(0,2)));

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

                    localStorage.setItem('news', JSON.stringify(arr));

                    console.log(arr);
                    fillNoticias(arr);
                },
                error: function(error) {
                    console.log(error);
                }
            });

            $('.noticia').removeClass('is-right').addClass('is-center');
            $('.menu').removeClass('is-not-vanish').addClass('is-vanish');
        }
        else if ($target.data('link') == 'acerca') {
            $('.acerca').removeClass('is-right').addClass('is-center');
            $('.menu').removeClass('is-not-vanish').addClass('is-vanish');
        }
        else if ($target.data('link') == 'aviso') {
            $('.aviso').removeClass('is-right').addClass('is-center');
            $('.menu').removeClass('is-not-vanish').addClass('is-vanish');
        }
    });
    // TERMINA MENU

    // INICIA REGISTRO
    var registro1 = document.querySelector('.regP1'), reg1 = new Hammer(registro1),
        registro2 = document.querySelector('.regP2'), reg2 = new Hammer(registro2),
        registro3 = document.querySelector('.regP3'), reg3 = new Hammer(registro3),
        registro4 = document.querySelector('.regP4'), reg4 = new Hammer(registro4);

    reg1.on("tap", function(ev) {
        var $target = $(ev.target);

        if ($target.data('link') == 'menu') {
            $('.regP1').removeClass('is-center').addClass('is-right');
            $('.menu').removeClass('is-vanish').addClass('is-not-vanish');
        }
        else if ($target.data('link') == 'toRegP2') {
            var $nombre = $('#txtNombre').val(), $apellido = $('#txtApellido').val(),
                $correo = $('#txtCorreo').val(), $telefono = $('#txtTelefono').val();

            // Validar formulario
            if ($nombre === '') {
                swal ("Un momento", "Favor de capturar su nombre", "warning");
            }
            else if ($apellido === '') {
                swal ("Un momento", "Favor de capturar su apellido", "warning");
            }
            else if ($correo === '') {
                swal ("Un momento", "Favor de capturar su correo electrónico", "warning");
            }
            else if ($telefono === '') {
                swal ("Un momento", "Favor de capturar su teléfono", "warning");
            }
            else {

                if ( !validar_email( $correo )) {
                    swal ("Un momento", "Favor de corregir el formato del correo", "warning" );
                }
                else if ($telefono.length <= 13) {
                    swal ("Un momento", "Favor de capturar su número teléfonico completo", "warning" );
                }
                else {
                    var user = {
                        nombre : $nombre,
                        apellido : $apellido,
                        correo : $correo,
                        tel : $telefono,
                    }

                    sessionStorage.setItem('user', JSON.stringify(user));

                    $('.regP1').removeClass('is-center').addClass('is-left');
                    $('.regP2').removeClass('is-right').addClass('is-center');
                }

            }


        }
    });

    reg2.on("tap", function(ev) {
        var $target = $(ev.target);

        if ($target.data('link') == 'back') {
            $('.regP2').removeClass('is-center').addClass('is-right');
            $('.regP1').removeClass('is-left').addClass('is-center');
        }
        else if ($target.data('link') == 'look') {
            var $codigo = $('#codigoPostal').val();
            var cp = parseInt($codigo);

            if ($codigo.length < 5) {
                swal ("Un momento", "Favor de capturar su código postal completo", "warning");

            } else {
                var url_link = 'https://api-codigos-postales.herokuapp.com/v2/codigo_postal/' + cp + '';

                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: url_link,
                    success: function(data) {
                        var user = JSON.parse(sessionStorage.getItem('user'));
                        $('.UsuarioLocalizado').text(data.estado + ', ' + data.municipio);
                        user.estado = data.estado;
                        user.municipio = data.municipio;
                        user.cp = cp;
                        if ($('#SiCsam:checked').length === 1) {
                            user.csam = 1;
                        }
                        else {
                            user.csam = 0;
                        }

                        sessionStorage.setItem('user', JSON.stringify(user));
                    },
                    error: function(data) {
                        swal('Un momento', 'Fallo la conexión, favor de intentarlo de nuevo', 'warning');
                    }
                });
            }
        }
        else if ($target.data('link') == 'toRegP3') {
            var $Codigo = $('.UsuarioLocalizado').text();

            if ($Codigo === '') {
                swal('Un momento', 'Favor de localizar su ubicación por medio de su código postal', 'warning')
            }
            else {
                $('.regP2').removeClass('is-center').addClass('is-left');
                $('.regP3').removeClass('is-right').addClass('is-center');
            }

        }
    });

    reg3.on("tap", function(ev) {
        var $target = $(ev.target);

        if ($target.data('link') == 'back') {
            $('.regP3').removeClass('is-center').addClass('is-right');
            $('.regP2').removeClass('is-left').addClass('is-center');
        }
        else if ($target.data('link') == 'toRegP4') {

            var url_put = 'https://tecnico-mirage.firebaseio.com/users/' + uuid + '/.json';

            var params = JSON.parse(sessionStorage.getItem('user'));

            $.ajax({
                url: url_put,
                type: "PUT",
                data: JSON.stringify(params),
                success: function () {
                    swal("", "Sus datos han sido capturados con exito", "success");

                    var html = "<span class='h5 d-block'>" + params.user + ' ' + params.apellido + "</span>";
                        html += "<small class='d-block'>a nuestro programa</small>"

                    var $html = $(html);
                    $('.nombreTecnico').append($html);
                },
                error: function(error) {
                    swal("error");
                }
            });

            $('.regP3').removeClass('is-center').addClass('is-left');
            $('.regP4').removeClass('is-right').addClass('is-center');
        }
    });

    reg4.on('tap', function(ev) {
        var $target = $(ev.target);

        if ($target.data('link') == 'back') {
            $('.regP4').removeClass('is-center').addClass('is-right');
            $('.regP3').removeClass('is-left').addClass('is-center');
        }
    });
    // TERMINA REGISTRO

    // INICIA NOTICIA
    var noticia = document.querySelector('.noticia'), ntc = new Hammer(noticia);

    ntc.on("tap", function(ev) {
        var $target = $(ev.target);

        if ($target.data('item') == 'menu') {
            $('.noticia').removeClass('is-center').addClass('is-right');
            $('.menu').removeClass('is-vanish').addClass('is-not-vanish');
        }
        else if ($target.data('link') == 'articulo') {
            $('.articulo-fill').empty();
            var news = JSON.parse(localStorage.getItem('news'));
            var newIndex = $target.data('num');
            $('.articulo-fill').append(news[newIndex].articulo);

            $('.noticia').removeClass('is-center').addClass('is-left');
            $('.articulo').removeClass('is-right').addClass('is-center');
        }
        else if ($target.data('link') == 'back') {
            $('.articulo').removeClass('is-center').addClass('is-right');
            $('.noticia').removeClass('is-left').addClass('is-center');
        }

    });
    // TERMINA NOTICIA

    // INICIA ARTICULO
    var articulo = document.querySelector('.articulo'), art = new Hammer(articulo);

    art.on("tap", function(ev) {
        var $target = $(ev.target);

        if ($target.data('link') == 'back') {
            $('.articulo').removeClass('is-center').addClass('is-right');
            $('.noticia').removeClass('is-left').addClass('is-center');
        }

    });
    // TERMINA ARTICULO

    // INICIA ACERCA
    var acerca = document.querySelector('.acerca'), crc = new Hammer(acerca);

    crc.on("tap", function(ev) {
        var $target = $(ev.target);

        if ($target.data('item') == 'acerca') {
            $('.acerca').removeClass('is-center').addClass('is-right');
            $('.menu').removeClass('is-vanish').addClass('is-not-vanish');
        }

    });
    // TERMINA ACERCA

    // INICIA AVISO
    var aviso = document.querySelector('.aviso'), vso = new Hammer(aviso);

    vso.on("tap", function(ev) {
        var $target = $(ev.target);
        console.log($(ev.target));

        if ($target.data('item') == 'aviso') {
            $('.aviso').removeClass('is-center').addClass('is-right');
            $('.menu').removeClass('is-vanish').addClass('is-not-vanish');
        }

    });
    // TERMINA AVISO
});

function onDeviceReady(){
    //write your function body here
    // initPushwoosh();
    uuid = device.uuid;

    // localStorage.removeItem('dataUser');
    var dataUser = JSON.parse(localStorage.getItem('dataUser'));

    // Validacion de usuario
    if (dataUser) {
        $('.mnu-registro').addClass('is-hidden');
        $('.mnu-noticias').removeClass('is-hidden');
    }
    else {
        var url_put = 'https://tecnico-mirage.firebaseio.com/users/' + uuid + '.json';

        $.ajax({
            url: url_put,
            type: "GET",
            success: function (data) {

                if (data) {
                    var dataUser = {
                        isCsam : data.csam,
                        estado : data.estado
                    }

                    localStorage.setItem('dataUser', JSON.stringify(dataUser));
                    $('.mnu-registro').addClass('is-hidden');
                    $('.mnu-noticias').removeClass('is-hidden');
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    // swal(device.cordova + ', ' +  device.model + ', ' +  device.platform + ', ' +
    //     device.uuid + ', ' +  device.version + ', ' +  device.manufacturer + ', ' +
    //     device.isVirtual + ', ' +  device.serial)

    document.addEventListener("offline", onOffline, false);

    checkConnection();

    $('.actCamera').on('click', function(){
        navigator.camera.getPicture(uploadPhotoSuccess, cameraError, {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            targetWidth: 200,
            targetHeight: 200,
            correctOrientation: true
        });
    });

}

function uploadPhotoSuccess(imageURI) {
    $('.actCamera').css('background', 'green');
    $('.actCameraIcon').attr('src', 'images/iconOk.png');

    var user = JSON.parse(sessionStorage.getItem('user'));
    user.image = 'data:image/jpeg;base64,' + imageURI;
    sessionStorage.setItem('user', JSON.stringify(user));

    var image = document.getElementById('tecnicoSelfie');
    image.src = 'data:image/jpeg;base64,' + imageURI;
}

function cameraError(message) {
    swal('', 'Failed because: ' + message);
}

// Validar que no se desconecte de la red
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

    // document.getElementById("pgbNetwork").innerHTML = states[networkState] + "<p>";
}

// llenar espacio de Noticias
function fillNoticias(data) {

    // type 01
    var tmp = "";
    tmp += "<section class='notice typeA d-flex justify-content-between mb-2' data-link='articulo' data-num=':num:'>";
    tmp += "<header class='notice-header d-flex flex-column justify-content-between :importantHeader:' data-link='articulo' data-num=':num:'>";
    tmp += "<div class='notice-title' data-link='articulo' data-num=':num:'>:titulo:</div>";
    tmp += "<div class='notice-date' data-link='articulo' data-num=':num:'>:fecha:</div>";
    tmp += "</header>";
    tmp += "<article class='notice-body d-flex justify-content-between align-items-center :importantBody:' data-link='articulo' data-num=':num:'>";
    tmp += "<div class='notice-text' data-link='articulo' data-num=':num:'>:descripcion:</div>";
    tmp += "<i class='fas fa-chevron-right' data-link='articulo' data-num=':num:'></i>";
    tmp += "</article>";
    tmp += "</section>";

    // type 02
    var tmp2 = "";
    tmp2 += "<section class='notice typeB d-flex flex-column' data-link='articulo' data-num=':num:'>";
    tmp2 += "<header class='notice-header d-flex flex-column justify-content-between :importantHeader:' data-link='articulo' data-num=':num:'>";
    tmp2 += "<div class='notice-title' data-link='articulo' data-num=':num:'>:titulo:</div>";
    tmp2 += "<div class='notice-date' data-link='articulo' data-num=':num:'>:fecha:</div>";
    tmp2 += "</header>";
    tmp2 += "<article class='notice-body d-flex justify-content-between align-items-center :importantBody:' data-link='articulo' data-num=':num:'>";
    tmp2 += "<div class='notice-text' data-link='articulo' data-num=':num:'>:descripcion:</div>";
    tmp2 += "<i class='fas fa-chevron-right' data-link='articulo' data-num=':num:'></i>";
    tmp2 += "</article>";
    tmp2 += "</section>";

    // var tmp = "";
    // tmp += "<div class='noticia-item border rounded d-flex justify-content-between' data-link='articulo' data-num=':num:'>";
    // tmp += "<div class='noticia-data d-flex' data-link='articulo' data-num=':num:'>";
    // tmp += "<h6 data-link='articulo' data-num=':num:'>:titulo:</h6>";
    // tmp += "<small class='text-muted' data-link='articulo' data-num=':num:'>:fecha:</small>";
    // tmp += "<small data-link='articulo' data-num=':num:'>:descripcion:.</small>";
    // tmp += "</div>";
    // tmp += "<div class='noticia-icon align-self-center' data-link='articulo' data-num=':num:'>";
    // tmp += "<i class='fas fa-angle-right' data-link='articulo' data-num=':num:'></i>";
    // tmp += "</div>";
    // tmp += "</div>";

    var dataUser = JSON.parse(localStorage.getItem('dataUser'));

    var finale = "";
    data.forEach(function (el, i) {
        var temp;

        var headImportant = '', bodyImportant = '';

        if (el.importancia === 1) {
            headImportant = 'is-importHighHead';
            bodyImportant = 'is-importHighBody';
        }
        else if (el.importancia === 2) {
            headImportant = 'is-importMidHead';
            bodyImportant = 'is-importMidBody';
        }
        else {
            headImportant = 'is-importLowHead';
            bodyImportant = 'is-importLowBody';
        }

        if (i === 0) {
            temp = tmp.replace(':titulo:', el.titulo)
                .replace(':fecha:', el.fecha)
                .replace(':descripcion:', el.descripcion)
                .replace(':importantHeader:', headImportant)
                .replace(':importantBody:', bodyImportant)
                .replace(/:num:/g, i);
        }
        else {
            temp = tmp2.replace(':titulo:', el.titulo)
                .replace(':fecha:', el.fecha)
                .replace(':descripcion:', el.descripcion)
                .replace(':importantHeader:', headImportant)
                .replace(':importantBody:', bodyImportant)
                .replace(/:num:/g, i);
        }

        finale += temp;
    });

    var $finale = $(finale);
    $('.noticia-fill').empty();
    $('.noticia-fill').append($finale);

}

// Validar correo electronico
function validar_email( email ) {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
}

// Pushwoosh
function onPushwooshInitialized(pushNotification) {

	//if you need push token at a later time you can always get it from Pushwoosh plugin
	pushNotification.getPushToken(
		function(token) {
			console.info('push token: ' + token);
		}
	);

	//and HWID if you want to communicate with Pushwoosh API
	pushNotification.getPushwooshHWID(
		function(token) {
			console.info('Pushwoosh HWID: ' + token);
		}
	);

	//settings tags
	pushNotification.setTags({
			tagName: "tagValue",
			intTagName: 10
		},
		function(status) {
			console.info('setTags success: ' + JSON.stringify(status));
		},
		function(status) {
			console.warn('setTags failed');
		}
	);

	pushNotification.getTags(
		function(status) {
			console.info('getTags success: ' + JSON.stringify(status));
		},
		function(status) {
			console.warn('getTags failed');
		}
	);

	//start geo tracking.
	pushNotification.startLocationTracking();
}

function initPushwoosh() {
	var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");

	//set push notifications handler
	document.addEventListener('push-notification',
		function(event) {
			var message = event.notification.message;
			var userData = event.notification.userdata;

			// document.getElementById("pushMessage").innerHTML = message + "<p>";
			// document.getElementById("pushData").innerHTML = JSON.stringify(event.notification) + "<p>";

			//dump custom data to the console if it exists
			if (typeof(userData) != "undefined") {
				console.warn('user data: ' + JSON.stringify(userData));
			}
		}
    );

    document.addEventListener('push-receive',
        function (event) {
            var message = event.notification.message;
            var userData = event.notification.userdata;

            // document.getElementById("pushMessage").innerHTML = message + "<p>";
            // document.getElementById("pushData").innerHTML = JSON.stringify(event.notification) + "<p>";

            //dump custom data to the console if it exists
            if (typeof (userData) != "undefined") {
                console.warn('user data: ' + JSON.stringify(userData));
            }
        }
    );

	//initialize Pushwoosh with projectid: "GOOGLE_PROJECT_ID", appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
    pushNotification.onDeviceReady({
        projectid: "388070461955",
        appid: "15359-10938",
        serviceName: ""
    });

	//register for push notifications
	pushNotification.registerDevice(
		function(status) {
			// document.getElementById("pushToken").innerHTML = status.pushToken + "<p>";
			onPushwooshInitialized(pushNotification);
		},
		function(status) {
			alert("failed to register: " + status);
			console.warn(JSON.stringify(['failed to register ', status]));
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
