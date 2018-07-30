const MARKER_PATH = "img/markers/";
const MAP_MARKER = MARKER_PATH + "if_Marker_1891030.png";
const MAP_MARKER_2 = MARKER_PATH + "if_map-marker_285659.png";
const MAP_MARKER_3 = MARKER_PATH + "if_map-marker_299087.png";
const MAP_MARKER_PIN = MARKER_PATH + "if_Pin_728961.png";
const MAP_MARKER_LOCATION = MARKER_PATH + "if_location_925919.png";

var map = {};

jQuery(function ($) {
    if(!validateAuthentication()){
        clearCredentials();
        window.location = URL_LOGIN;
    }
    loadUserInformation();
    const $afterLoadSecciones = settings;
    loadSecciones($afterLoadSecciones);
    const $afterLoadRegiones = initMap;
    loadRegiones($afterLoadRegiones);
});

function loadUserInformation(){
    const $user = authenticatedUser();
    $("#username").text($user.nombre);
}

function validateAuthentication(){
    return (typeof authenticatedUser === 'function' && authenticatedUser() !== null);
}

function settings() {
    $(".sidebar-dropdown > a").click(function () {
        console.log($(this));
        $(".sidebar-submenu").slideUp(200);
        if ($(this).parent().hasClass("active")) {
            $(".sidebar-dropdown").removeClass("active");
            $(this).parent().removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this).next(".sidebar-submenu").slideDown(200);
            $(this).parent().addClass("active");
        }
    });

    $("#close-sidebar").click(function () {
        $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function () {
        $(".page-wrapper").addClass("toggled");
    });
    var themes = "chiller-theme ice-theme cool-theme light-theme green-theme spicy-theme purple-theme";
    $('[data-theme]').click(function () {
        $('.page-wrapper').removeClass(themes);
        $('.page-wrapper').addClass($(this).attr('data-theme'));
    });

    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $(".sidebar-content").mCustomScrollbar({
            axis: "y",
            autoHideScrollbar: true,
            theme: "minimal"
        });
        $(".sidebar-content").addClass("desktop");
    }
}

function initMap($regiones, $afterMapIsLoaded) {  
    console.log('load map'); 
    if(typeof $regiones === 'undefined' || $regiones === null)
        return;    
    map = L.map('map-container');
    if(typeof $afterMapIsLoaded === 'function' && $afterMapIsLoaded !== null)
        map.on('load', $afterMapIsLoaded);
    map.setView([-12.046374, -77.042793],6);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',//'mapbox.streets',
        accessToken: 'pk.eyJ1IjoicHNoYXJweCIsImEiOiJjamljbzN0cngwMzAzM3B0ZDZ6aHNiNmRyIn0.2ZAyLQwArDCLoZsT4Ji3EA'
    }).addTo(map);

    var baseballIcon = L.icon({
		iconUrl: 'baseball-marker.png',
		iconSize: [32, 37],
		iconAnchor: [16, 37],
		popupAnchor: [0, -28]
    });
    
    const onEachFeature = function onEachFeature(feature, layer) {        
		var popupContent = "<p>I started out as a GeoJSON " +
				feature.geometry.type + ", but now I'm a Leaflet vector!</p>";
		if (feature.properties && feature.properties.NOMBDIST) {            
            $template = renderHandlebarsTemplate(
                "#region-popupcontent-template", null, { properties: feature.properties }, null, true
            );
			popupContent = $template;
		}
		layer.bindPopup(popupContent);
    }
    
    var myStyle = {
        "color": "#ff7800",
        "opacity": 0.65
    };

    L.geoJSON($regiones, {
        style: myStyle,
        onEachFeature: onEachFeature,
    }).addTo(map);
}

function markers(){
    return {
        markerLocationIcon: L.icon({
            iconUrl: MAP_MARKER_LOCATION,
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -28]
        }),
        markerPinIcon: L.icon({
            iconUrl: MAP_MARKER_PIN,
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -28]
        }),
        markerMapIcon: L.icon({
            iconUrl: MAP_MARKER_2,
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -28]
        }),        
    };
}

function loadRegiones($afterLoadRegiones){
    $.ajax({
        url : API_REGIONES,        
        type : 'GET',
        dataType : 'json',
        success : function($response) {
            if(typeof ($response !== 'undefined') && $response !== null){
                if($response.status){                    
                    const $onceMapIsLoaded = onceMapIsLoaded;                    
                    $afterLoadRegiones($response.data, $onceMapIsLoaded);
                }
            }
        },     
        error : function(xhr, status) {            
        },     
        complete : function(xhr, status) {            
        }
    });
}

function onceMapIsLoaded(){    
    const $menu_container = $("#menu-sidebar");
    var $items = $menu_container.find("input[type='checkbox'].menu-item");
    const $whenMenuItemIsChecked = function(){
        console.log("checked");
        const $isChecked = $(this).prop('checked');
        const $seccion = $(this).data('value');
        const $parent = $(this).data('parent');
        
        const $afterLoadPuntos = function($seccion){
            const $id = $seccion.id;
           
            if($seccion.geoJsonFile){
                const $onEachFeature = function(feature, layer) {
                    var popupContent = "<p>I started out as a GeoJSON " +
                            feature.geometry.type + ", but now I'm a Leaflet vector!</p>";
                    if (feature.properties) {
                        $template = renderHandlebarsTemplate(
                            "#punto-popupcontent-template", null, { properties: {descripcion: feature.properties.OR_} }, null, true
                        );
                        popupContent = $template;
                    }
                    layer.bindPopup(popupContent);
                }

                const divIcon = L.divIcon({
                    className: 'custom-marker',
                    html: '<div><i class="fas 3x fa-map-marker-alt"></i></div>',
                    iconSize: [128, 128]
                });
                
                let $points =JSON.parse( $seccion.geoJsonFile);
                
                L.geoJSON($points, {
                    onEachFeature: $onEachFeature,
                    pointToLayer: function (feature, latlng) {
                        // return L.marker(latlng, {icon: divIcon});
                        return L.marker(latlng, { icon: markers().markerMapIcon });
                        // return L.circleMarker(latlng, {
                        //     radius: 8,
                        //     fillColor: "#ff7800",
                        //     color: "#000",
                        //     weight: 1,
                        //     opacity: 1,
                        //     fillOpacity: 0.8
                        // });
                    }
                }).addTo(map);
            }            
        };

        const $afterLoadPoligonos = function($poligonos){
            const $id = $poligonos.id;
            const $geoDatos = $poligonos.geoDatos;
            var $points = ($geoDatos !== null && $geoDatos.length > 0) ? $geoDatos[0]: false;
            if($points){
                const $onEachFeature = function(feature, layer) {        
                    var popupContent = "<p>I started out as a GeoJSON " +
                            feature.geometry.type + ", but now I'm a Leaflet vector!</p>";
                    if (feature.properties) {
                        $template = renderHandlebarsTemplate(
                            "#punto-popupcontent-template", null, { properties: {descripcion: "A description"} }, null, true
                        );
                        popupContent = $template;
                    }
                    layer.bindPopup(popupContent);
                }

                const divIcon = L.divIcon({
                    className: 'custom-marker',
                    html: '<div><i class="fas 3x fa-map-marker-alt"></i></div>',
                    iconSize: [128, 128]
                });

                $points = $points.dataJson;
                L.geoJSON($points, {
                    onEachFeature: $onEachFeature,
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, {icon: divIcon});
                        // return L.circleMarker(latlng, {
                        //     radius: 8,
                        //     fillColor: "#ff7800",
                        //     color: "#000",
                        //     weight: 1,
                        //     opacity: 1,
                        //     fillOpacity: 0.8
                        // });
                    }
                }).addTo(map);
            }            
        };

        const $afterLoadLines = function($lineas){
            const $id = $lineas.id;
            const $geoDatos = $lineas.geoDatos;
            var $lines = ($geoDatos !== null && $geoDatos.length > 0) ? $geoDatos[0]: false;
            if($lines){
                const $onEachFeature = function(feature, layer) {        
                    var popupContent = "<p>I started out as a GeoJSON " +
                            feature.geometry.type + ", but now I'm a Leaflet vector!</p>";
                    if (feature.properties) {
                        $template = renderHandlebarsTemplate(
                            "#punto-popupcontent-template", null, { properties: {descripcion: "A description"} }, null, true
                        );
                        popupContent = $template;
                    }
                    layer.bindPopup(popupContent);
                }

                const divIcon = L.divIcon({
                    className: 'custom-marker',
                    html: '<div><i class="fas 3x fa-map-marker-alt"></i></div>',
                    iconSize: [128, 128]
                });

                $lines = $lines.dataJson;
                L.geoJSON($lines, {
                    onEachFeature: $onEachFeature,
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, {icon: divIcon});
                        // return L.circleMarker(latlng, {
                        //     radius: 8,
                        //     fillColor: "#ff7800",
                        //     color: "#000",
                        //     weight: 1,
                        //     opacity: 1,
                        //     fillOpacity: 0.8
                        // });
                    }
                }).addTo(map);
            }            
        };

        loadSeccion($afterLoadPuntos, $seccion);
        // loadPoligonos($afterLoadPoligonos);
        // loadLineas($afterLoadLines);
    };
    $items.on("change", $whenMenuItemIsChecked);    
}

function loadSeccion($afterLoadPuntos, $seccion){
    $.ajax({
        url : API_SECCIONES + '/' + $seccion.id,        
        type : 'GET',
        dataType : 'json',
        success : function($response) {
            if(typeof ($response !== 'undefined') && $response !== null){
                if($response.status){                    
                    $afterLoadPuntos($response.data);                    
                }
            }
        },     
        error : function(xhr, status) {            
        },     
        complete : function(xhr, status) {            
        }
    });
}

function loadLineas($afterLoadLineas){
    $.ajax({
        url : API_SECCIONES_LINEAS,        
        type : 'GET',
        dataType : 'json',
        success : function($response) {
            if(typeof ($response !== 'undefined') && $response !== null){
                if($response.status){                    
                    $afterLoadLineas($response.data);
                }
            }
        },     
        error : function(xhr, status) {            
        },     
        complete : function(xhr, status) {            
        }
    });
}

function loadPoligonos($afterLoadPoligonos){
    $.ajax({
        url : API_SECCIONES_POLIGONOS,        
        type : 'GET',
        dataType : 'json',
        success : function($response) {
            if(typeof ($response !== 'undefined') && $response !== null){
                if($response.status){                    
                    $afterLoadPoligonos($response.data);
                }
            }
        },     
        error : function(xhr, status) {            
        },     
        complete : function(xhr, status) {            
        }
    });
}

function loadSecciones($afterLoadSecciones){
    const $urlSecciones= API_SECCIONES;

    $.ajax({
        url : API_SECCIONES,
        type : 'GET',
        dataType : 'json',
        success : function($response) {
            if(typeof ($response !== 'undefined') && $response !== null){
                if($response.status){
                    buildSecciones($response.data, $afterLoadSecciones);
                }
            }            
        },     
        error : function(xhr, status) {            
        },     
        complete : function(xhr, status) {            
        }
    });
}

function buildSecciones($secciones, $afterBuildSecciones){
    if(typeof $secciones == 'undefined' || $secciones === null)
        return false;
    if(typeof _ == 'undefined')
        throw Exception("No lodash object found");
    $secciones = _.groupBy($secciones, function($item){
        let key=$item.idSeccionPadre;
        if($item.idSeccionPadre == null)
            key='0';
        return key;
    });

    $cabecera = _.find($secciones, function($item, $key){
        if($key === '' || $key == null || $key === '0') 
            return $item;
    });

    $cabecera = _.map($cabecera, function($item, $key){
        $children = _.filter($secciones, function($children, $subKey){
            return ($item.id == $subKey);
        });
        $item["children"] = ($children !== null && $children.length > 0) ? $children[0]: [];
        $item["hasChildren"] = ($children !== null && $children.length > 0);
        return $item;
    });
    $secciones = _.filter($secciones, function($item, $key){
        if($key !== '' || $key !== null)
            return true;
    });

    //renderHandlebarsTemplate("js/templates/secciones.hbs", "#menu-sidebar", $cabecera);
    renderHandlebarsTemplate(
        "#secciones-template", "#menu-sidebar", { secciones: $cabecera }, $afterBuildSecciones, true
    );
}

function getTemplateAjax(path, callback) {
    var source, template;
    $.ajax({
        url: path,
        dataType: "html",        
        success: function (data) {
            source = data;            
            template = Handlebars.compile(source);
            if (callback) callback(template);
        }
    });
}
 
function renderHandlebarsTemplate(withTemplate,inElement,withData, callback, inlineTemplate){
    if(typeof inlineTemplate !== 'undefined' && inlineTemplate){        
        var targetTemplate = (typeof withTemplate == 'string') ? $(withTemplate).html() : withTemplate.html() ;
        template = Handlebars.compile(targetTemplate);
        if(inElement === null || inElement === '')
            return template(withData);
        var targetDiv = (typeof inElement == 'string') ? $(inElement) : inElement ;
        targetDiv.html(template(withData));
        if (callback) { callback()}
        return;
    }
    
    getTemplateAjax(withTemplate, function(template) {
        if(inElement === null || inElement === '')
            return template(withData);
        var targetDiv = (typeof inElement == 'string') ? $(inElement) : inElement ;
        targetDiv.html(template(withData));
        if (callback) { callback()}
    })
};