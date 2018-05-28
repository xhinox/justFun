
var uuid = '';
var boolUpdate = false;


$(document).ready(function (){

    if (window.screen.height > 480) {
        $('.regP1, .perfil').find('div.input-group').addClass('input-group-lg');
        $('.regP1, .perfil').find('div.input-group').removeClass('mb-2').addClass('mb-3');
    }

    document.addEventListener("deviceready",onDeviceReady,false);

    $('#txtTelefono, #abPhone').mask('(000) 000.0000');
    $('#codigoPostal, #abLocale').mask('00000');
    $("#NoCsam").prop("checked", true);
    $('#codigoCesam').prop("readonly", true);

    // MODAL SAVE datoApe
    var svData = document.getElementById('saveDataLoader'), saveData = new Hammer(svData);

    saveData.on('tap', function(ev) {
        var $target = $(ev.target);

        if ($target.hasClass('saveData')) {
            if (!boolUpdate) {
                guardarRegistro();
            }
            else {
                actualizarRegistro();
            }
        }
    });

    // INICIA MENU
    var mnu = document.querySelector('.menu'), menu = new Hammer(mnu);

    menu.on("tap", function(ev) {
        var $target = $(ev.target), $registro = $('.regP0'), $noticia = $('.noticia'), $perfil = $('.perfil'), $aviso = $('.aviso');

        var fuente = [$registro, $noticia, $perfil, $aviso];

        $('.regP0, .noticia').css("transition","");

        if ($target.data('link') == 'registrate') {
            checkOutMenu($registro, fuente);
        }
        else if ($target.data('link') == 'noticias') {
            checkOutMenu($noticia, fuente);

            $('#loader').modal('show');
            loadNoticias();
        }
        else if ($target.data('link') == 'perfil') {
            checkOutMenu($perfil, fuente);
        }
        else if ($target.data('link') == 'aviso') {
            checkOutMenu($aviso, fuente);
        }
    });
    // TERMINA MENU

    function checkOutMenu(element, fuente) {
        var $e1 = $(element[0]);

        for (var i = 0; i < fuente.length; i++) {
            var e = fuente[i];
            e.removeClass('is-half').removeClass('is-center').addClass('is-right');
        }

        $e1.removeClass('is-right').addClass('is-center');
    }

    // INICIA REGISTRO
    var registro0 = document.querySelector('.regP0'), reg0 = new Hammer(registro0),
        registro1 = document.querySelector('.regP1'), reg1 = new Hammer(registro1),
        registro2 = document.querySelector('.regP2'), reg2 = new Hammer(registro2),
        // registro3 = document.querySelector('.regP3'), reg3 = new Hammer(registro3),
        registro4 = document.querySelector('.regP4'), reg4 = new Hammer(registro4);

    reg0.on("tap", function(ev) {
            var $target = $(ev.target);

            if ($target.data('link') == 'menu') {

                if ($('.regP0').hasClass('is-center')) {
                    $('.regP0').removeClass('is-center').addClass('is-half');
                }
                else {
                    $('.regP0').removeClass('is-half').addClass('is-center');
                }
            }
            else if ($target.data('link') == 'toRegP1') {
                $('.regP0').css("transition","");
                $('.regP0').removeClass('is-center').addClass('is-left');
                $('.regP1').removeClass('is-right').addClass('is-center');
            }
        });

    reg1.on("tap", function(ev) {
        var $target = $(ev.target);

        if ($target.data('link') == 'back') {
            $('.regP1').removeClass('is-center').addClass('is-right');
            $('.regP0').removeClass('is-left').addClass('is-center');
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

    $('#txtNombre').on('keydown', function(ev) {
        if ( ev.which == 13 ) {
            ev.preventDefault();
            $('#txtApellido').focus();
        }
    });

    $('#txtApellido').on('keydown', function(ev) {
        if ( ev.which == 13 ) {
            ev.preventDefault();
            $('#txtCorreo').focus();
        }
    });

    $('#txtCorreo').on('keydown', function(ev) {
        if ( ev.which == 13 ) {
            ev.preventDefault();
            $('#txtTelefono').focus();
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
            }
            else {
                var url_link = 'https://api-codigos-postales.herokuapp.com/v2/codigo_postal/' + cp + '';

                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: url_link,
                    success: function(data) {
                        setTimeout(function() {
                            $('#loader').modal('hide');
                            var user = JSON.parse(sessionStorage.getItem('user'));
                            $('.UsuarioLocalizado').text(data.estado + ', ' + data.municipio);
                            user.estado = data.estado;
                            user.municipio = data.municipio;
                            user.cp = cp;

                            sessionStorage.setItem('user', JSON.stringify(user));
                        }, 1000);

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

                var user = JSON.parse(sessionStorage.getItem('user'));
                user.isCsam = parseInt($('input[name=csam]:checked').val());
                user.csamNum = parseInt($('#codigoCesam').val());
                user.csamAut = 0;

                $('.userName').text('' + user.nombre + ' ' + user.apellido );
                $('.userLocale').text('' + user.municipio + ', ' + user.estado + '. ' + user.cp);
                $('.userMail').text('' + user.correo + '');
                $('.userPhone').text('' + user.tel + '');

                $('.userCsam').text('' + user.isCsam == 1 ? 'Si' : 'No' + '');

                var dataUser = {
                    isCsam : user.isCsam,
                    estado : user.estado
                }

                sessionStorage.setItem('user', JSON.stringify(user));

                $('.regP2').removeClass('is-center').addClass('is-left');
                $('.regP4').removeClass('is-right').addClass('is-center');
            }
        }
    });

    $('input[name=csam]').on('change', function (ev) {
        if (ev.target.id == 'SiCsam') {
            $('#codigoCesam').attr('readonly', false);
        }
        else {
            $('#codigoCesam').prop("readonly", true);
        }
    });

    // reg3.on("tap", function(ev) {
    //     var $target = $(ev.target);
    //
    //     if ($target.data('link') == 'back') {
    //         $('.regP3').removeClass('is-center').addClass('is-right');
    //         $('.regP2').removeClass('is-left').addClass('is-center');
    //     }
    //     else if ($target.data('link') == 'toRegP4') {
    //         var user = JSON.parse(sessionStorage.getItem('user'));
    //         $('.userName').text('' + user.nombre + ' ' + user.apellido );
    //         $('.userLocale').text('' + user.municipio + ', ' + user.estado + '. ' + user.cp);
    //         $('.userMail').text('' + user.correo + '');
    //         $('.userPhone').text('' + user.tel + '');
    //         $('.userCsam').text('' + user.csam == 1 ? 'Si' : 'No' + '');
    //
    //         var dataUser = {
    //             isCsam : user.csam,
    //             estado : user.estado
    //         }
    //
    //         sessionStorage.setItem('dataUser', JSON.stringify(dataUser));
    //
    //         $('.regP3').removeClass('is-center').addClass('is-left');
    //         $('.regP4').removeClass('is-right').addClass('is-center');
    //     }
    // });

    reg4.on('tap', function(ev) {
        var $target = $(ev.target);

        if ($target.data('link') == 'back') {
            $('.regP4').removeClass('is-center').addClass('is-right');
            $('.regP3').removeClass('is-left').addClass('is-center');
        }
        else if ($target.data('toRegFinish')) {
            boolUpdate = false;
        }
    });
    // TERMINA REGISTRO

    // INICIA NOTICIA
    var noticia = document.querySelector('.noticia'), ntc = new Hammer(noticia);

    ntc.get('swipe').set({
        direction: Hammer.DIRECTION_DOWN,
        threshold: 1,
        velocity:0.1
    });

    ntc.on("tap swipedown", function(ev) {
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
                $('.articulo-fill').empty();210
                var news = JSON.parse(sessionStorage.getItem('news'));
                var newIndex = $target.data('num');
                $('.articulo-fill').append(news[newIndex].articulo);

                $('.noticia').removeClass('is-center').addClass('is-left');
                $('.articulo').removeClass('is-right').addClass('is-center');
            }
            else if ($target.data('link') == 'back') {
                $('.articulo').removeClass('is-center').addClass('is-right');
                $('.noticia').removeClass('is-left').addClass('is-center');
            }
        }
        else {
            $('#loader').modal('show');
            $('.noticia-fill').empty();
            loadNoticias();
        }
    });
    // TERMINA NOTICIA

    // INICIA ARTICULO
    var articulo = document.querySelector('.articulo'), art = new Hammer(articulo);

    art.on("tap", function(ev) {
        var $target = $(ev.target);

        if ($target.data('link') == 'back') {
            $('.articulo').removeClass('is-center').addClass('is-half');
        }
    });
    // TERMINA ARTICULO

    // INICIA ACERCA
    var perfil = document.querySelector('.perfil'), prf = new Hammer(perfil);

    prf.on("tap", function(ev) {
        var $target = $(ev.target);

        if ($target.data('item') == 'perfil') {
            if ($('.perfil').hasClass('is-center')) {
                $('.perfil').removeClass('is-center').addClass('is-half');
            }
            else {
                $('.perfil').removeClass('is-half').addClass('is-center');
            }
        }
        /************* BUSCA CODIGO FISCAL **************/
        else if ($target.data('link') == 'look') {
            var $codigo = $('#abLocale').val();
            var cp = parseInt($codigo);

            if ($codigo.length < 5) {
                swal ("Un momento", "Favor de capturar su código postal completo", "warning");
            }
            else {
                var url_link = 'https://api-codigos-postales.herokuapp.com/v2/codigo_postal/' + cp + '';

                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: url_link,
                    success: function(data) {

                        setTimeout(function() {

                            $('#loader').modal('hide');
                            var user = JSON.parse(sessionStorage.getItem('user'));
                            $('.abDireccion').text(data.estado + ', ' + data.municipio);
                            user.estado = data.estado;
                            user.municipio = data.municipio;
                            user.cp = cp;

                            sessionStorage.setItem('user', JSON.stringify(user));
                        }, 1000);

                    },
                    error: function(data) {
                        swal('Un momento', 'Fallo la conexión, favor de intentarlo de nuevo', 'warning');
                    }
                });
            }
        }
        /************* BUSCA CODIGO FISCAL **************/
        /************* ACTUALIZA DATOSL **************/
        else if ($target.data('link') == 'update') {

            boolUpdate = true;
        }
        /************* ACTUALIZA DATOSL **************/
    });
    // TERMINA ACERCA

    // INICIA AVISO
    var aviso = document.querySelector('.aviso'), vso = new Hammer(aviso);

    vso.on("tap", function(ev) {
        var $target = $(ev.target);

        if ($target.data('item') == 'aviso') {
            if ($('.aviso').hasClass('is-center')) {
                $('.aviso').removeClass('is-center').addClass('is-half');
            }
            else {
                $('.aviso').removeClass('is-half').addClass('is-center');
            }
        }
    });
    // TERMINA AVISO
});

function onDeviceReady(){

    uuid = 'afb4ae8805f9b60b';
    // uuid = device.uuid;

    // Validacion de usuario
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
                    // photo : data.image,
                    isCsam : data.isCsam,
                    csamNum : data.csamNum,
                    csamAut : data.csamAut,
                }

                if (data.csamAut == 1) {
                    $('#abCsamAut').text('CSAM Verificado');
                }
                else if (data.csamAut == 0) {
                    $('#abCsamAut').text('CSAM por verificar');
                }

                if (data.isCsam == 1) {
                    $('#csamCheck').attr('checked', 'true');
                }
                else {
                    $('#csamCheck').attr('checked', 'false');
                }

                $('#abName').val(dataUser.nombre);
                $('#abLast').val(dataUser.apellido);
                $('.abDireccion').text(dataUser.municipio + ', ' + dataUser.estado + '.');
                $('#abLocale').val(dataUser.cp);
                $('#abMail').val(dataUser.correo);
                $('#abPhone').val(dataUser.tel);
                $('#abCsam').val(dataUser.csamNum);

                // var abImage = document.getElementById('abImage');
                // abImage.src = dataUser.photo;

                sessionStorage.setItem('user', JSON.stringify(dataUser));

                $('.noticia').removeClass('is-right').addClass('is-center').css("transition","none");
                $('.mnu-noticias, .mnu-acerca, .mnu-perfil').removeClass('is-hidden');

                $('#loader').modal('show');
                $('.noticia-fill').empty();
                loadNoticias();
            }
            else {
                $('.regP0').removeClass('is-right').addClass('is-center').css("transition","none");
                $('.mnu-registro').removeClass('is-hidden');
            }
        },
        error: function(error) {
            swal('', 'Estamos presentando una falla, favor de regresar mas tarde. (err01)');
        }
    });

    document.addEventListener("offline", onOffline, false);

    checkConnection();

    // $('.actCamera').on('click', function(){
    //     console.log('entro');
    //     navigator.camera.getPicture(uploadPhotoSuccess, cameraError, {
    //         quality: 100,
    //         destinationType: Camera.DestinationType.DATA_URL,
    //         sourceType : Camera.PictureSourceType.CAMERA,
    //         targetWidth: 150,
    //         targetHeight: 150,
    //         correctOrientation: true
    //     });
    // });
}

// function uploadPhotoSuccess(imageURI) {
//     $('.actCamera').css('background', 'green');
//     $('.actCameraIcon').attr('src', 'images/iconOk.png');
//
//     var user = JSON.parse(sessionStorage.getItem('user'));
//     user.image = 'data:image/jpeg;base64,' + imageURI;
//     sessionStorage.setItem('user', JSON.stringify(user));
//
//     var image = document.getElementById('tecnicoSelfie');
//     image.src = 'data:image/jpeg;base64,' + imageURI;
// }
//
// function cameraError(message) {
//     swal('', 'Failed because: ' + message);
// }

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

// guardar datos
function guardarRegistro() {

    var url_put = 'https://bdtecnicomirage.firebaseio.com/users/' + uuid + '/.json';

    var params = JSON.parse(sessionStorage.getItem('user'));

    $.ajax({
        url: url_put,
        type: "PUT",
        data: JSON.stringify(params),
        success: function (data) {

            setTimeout(function() {
                $('#loader').modal('hide');

                swal("", "Sus datos han sido capturados con exito", "success");

                $('.regP0, .regP1, .regP2').addClass('is-hidden');

                setTimeout(function () {
                    $('.regP0, .regP1, .regP2').removeClass('is-left').addClass('is-right');
                    $('.regP0, .regP1, .regP2').removeClass('is-hidden');

                    $('#abName').val(params.nombre);
                    $('#abLast').val(params.apellido);
                    $('.abDireccion').text(params.municipio + ', ' + params.estado + '.');
                    $('#abLocale').val(params.cp);
                    $('#abMail').val(params.correo);
                    $('#abPhone').val(params.tel);
                    $('#abCsam').val(params.csamNum);

                    if (params.csamAut == 1) {
                        $('#abCsamAut').text('CSAM Verificado');
                    }
                    else  {
                        $('#abCsamAut').text('CSAM por verificar');
                    }

                    if (params.isCsam == 1) {
                        $('#csamCheck').attr('checked', 'true');
                    }
                    else {
                        $('#csamCheck').attr('checked', 'false');
                    }

                }, 3000);

                $('.mnu-registro').addClass('is-hidden');
                $('.mnu-noticias, .mnu-perfil, .mnu-acerca').removeClass('is-hidden');
                $('.regP4').removeClass('is-center').addClass('is-right');
                $('.noticia').removeClass('is-right').addClass('is-center');
            }, 1000);

        },
        error: function(error) {
            swal('', 'Hubo un error al intentar guardar su información, favor de intentarlo de nuevo. (err02)');
        }
    });

}

function actualizarRegistro() {
    var url_put = 'https://bdtecnicomirage.firebaseio.com/users/' + uuid + '.json';

    var usuario = sessionStorage.getItem('user');
    var user = JSON.parse(usuario);

    user.nombre = $('#abName').val();
    user.apellido = $('#abLast').val();
    user.correo = $('#abMail').val();
    user.tel = $('#abPhone').val();
    user.csamNum = $('#abCsam').val();

    // user.isCsam = parseInt($('input[name=upCsam]:checked').val());

    sessionStorage.setItem('user', JSON.stringify(user));

    $.ajax({
        url: url_put,
        type: "PATCH",
        data: JSON.stringify(user),
        success: function (data) {

            setTimeout(function() {
                $('#loader').modal('hide');

                swal("", "Sus datos han sido actualizados con exito", "success");
            }, 1000);

        },
        error: function(error) {
            swal('', 'Hubo un error al intentar guardar su información, favor de intentarlo de nuevo. (err02)');
        }
    });
}

// Descargar Noticias
function loadNoticias() {
    var url_put = 'https://bdtecnicomirage.firebaseio.com/news.json';

    $.ajax({
        url: url_put,
        type: "GET",
        success: function (data) {

            setTimeout(function() {

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
                    fillNoticias(data, false)
                }

                $('#loader').modal('hide');
            }, 1000);

        },
        error: function(error) {
            fillNoticias(data, false)
        }
    });
}
// llenar espacio de Noticias
function fillNoticias(data, bool) {
    var finale = "";

    if (bool) {
        // type 01
        var tmp = "";
        tmp += "<section class='notice typeA d-flex justify-content-between mb-2' data-link='articulo' data-num=':num:'>";
        tmp += "<header class='notice-header d-flex flex-column justify-content-between rounded-left :importantHeader:' data-link='articulo' data-num=':num:'>";
        tmp += "<div class='notice-title' data-link='articulo' data-num=':num:'>:titulo:</div>";
        tmp += "<div class='notice-date' data-link='articulo' data-num=':num:'>:fecha:</div>";
        tmp += "</header>";
        tmp += "<article class='notice-body d-flex justify-content-between align-items-center rounded-right :importantBody:' data-link='articulo' data-num=':num:'>";
        tmp += "<div class='notice-text' data-link='articulo' data-num=':num:'>:descripcion:</div>";
        tmp += "<i class='fas fa-chevron-right' data-link='articulo' data-num=':num:'></i>";
        tmp += "</article>";
        tmp += "</section>";

        // type 02
        var tmp2 = "";
        tmp2 += "<section class='notice typeB d-flex flex-column mb-2' data-link='articulo' data-num=':num:'>";
        tmp2 += "<header class='notice-header d-flex flex-column justify-content-between rounded-top :importantHeader:' data-link='articulo' data-num=':num:'>";
        tmp2 += "<div class='notice-title' data-link='articulo' data-num=':num:'>:titulo:</div>";
        tmp2 += "<div class='notice-date' data-link='articulo' data-num=':num:'>:fecha:</div>";
        tmp2 += "</header>";
        tmp2 += "<article class='notice-body d-flex justify-content-between align-items-center rounded-bottom :importantBody:' data-link='articulo' data-num=':num:'>";
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
    }
    else {
        finale += "<article class='text-center mx-auto mt-5' style='width:200px;'>";
        finale += "<i class='fas fa-cloud mb-3' style='font-size:68px; color:rgba(0,0,0,.6)'></i>";
        finale += "<p class='text-muted'>Por el momento no se han generado noticias.</p>";
        finale += "</article>";
    }

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

	// if you need push token at a later time you can always get it from Pushwoosh plugin
	pushNotification.getPushToken(
		function(token) {
			console.log('push token: ' + token);
		}
	);

	// and HWID if you want to communicate with Pushwoosh API
	pushNotification.getPushwooshHWID(
		function(token) {
			console.log('Pushwoosh HWID: ' + token);
		}
	);

	// settings tags
	pushNotification.setTags({
			tagName: "tagValue",
			intTagName: 10
		},
		function(status) {
			console.log('setTags success: ' + JSON.stringify(status));
		},
		function(status) {
			console.log('setTags failed');
		}
	);

	pushNotification.getTags(
		function(status) {
			console.log('getTags success: ' + JSON.stringify(status));
		},
		function(status) {
			console.log('getTags failed');
		}
	);

}

function initPushwoosh() {
	var pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");
    //
	// //set push notifications handler
	document.addEventListener('push-notification',
		function(event) {
			var message = event.notification.message;
			var userData = event.notification.userdata;
            console.log('' + message + '', '' + userData + '');
            console.log('' + JSON.stringify(event.notification) + '');

			// document.getElementById("pushMessage").innerHTML = message + "<p>";
			// document.getElementById("pushData").innerHTML = JSON.stringify(event.notification) + "<p>";

			//dump custom data to the console if it exists
			if (typeof(userData) != "undefined") {
				console.log('user data: ' + JSON.stringify(userData));
			}
		}
    );
    //
    document.addEventListener('push-receive',
        function (event) {
            var message = event.notification.message;
            var userData = event.notification.userdata;
            console.log('' + message + '', '' + userData + '');
            console.log('' + JSON.stringify(event.notification) + '');

            // document.getElementById("pushMessage").innerHTML = message + "<p>";
            // document.getElementById("pushData").innerHTML = JSON.stringify(event.notification) + "<p>";

            //dump custom data to the console if it exists
            if (typeof (userData) != "undefined") {
                console.log('','user data: ' + JSON.stringify(userData));
            }
        }
    );
    //
	// //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_ID", appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
    pushNotification.onDeviceReady({
        projectid: "430274723087",
        appid: "3FD66-F50FD",
        serviceName: ""
    });

	//register for push notifications
	pushNotification.registerDevice(
		function(status) {
			// document.getElementById("pushToken").innerHTML = status.pushToken + "<p>";
			onPushwooshInitialized(pushNotification);
		},
		function(status) {
			swal(JSON.stringify(['failed to register ', status]));
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
