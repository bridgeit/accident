window.echoHub = 'http://api.bridgeit.mobi/echo/';

function setMinContentHeight(event){
    if( navigator.userAgent.toLowerCase().indexOf('android') > -1 ){
        if( event && event.type == 'resize'){
            return;
        }
    }
    var bufferHeight = 
        (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) ? 50 : 70);
    var minContentHeight = $(window).height() - bufferHeight;
    $("div[data-role='content']").each(function(idx, elem){
        elem.style.minHeight = '' + minContentHeight + 'px';
    });
}
window.addEventListener('onorientationchange', setMinContentHeight, false);

//check local storage and load any existing contacts
var CONTACT_STORE_KEY = 'contacts';
var contacts = getLocallyStoredObject(CONTACT_STORE_KEY , initializeContacts);

function onAfterReturnFromContacts1(event)  {
    if( event.value ){
        var text = decodeURIComponent(event.value);
        console.log('onAfterReturnFromContacts1: ' + text);
        var record = bridgeit.url2Object(text);
        $('#cntct1Form')[0].reset();
        for (var key in record)  {
            if(key === 'name'){
                $('#cntct1Name').val(record[key]);
                contacts.cntct1Name = record[key];
            }
            if(key === 'email'){
                $('#cntct1Email').val(record[key]);
                contacts.cntct1Email = record[key];
            }
            if(key === 'phone'){
                $('#cntct1Phone').val(record[key]);
                contacts.cntct1Phone = record[key];
            }
        }
        saveContactsLocally();
    }
}

function onAfterReturnFromContacts2(event)  {
    if( event.value ){
        var text = decodeURIComponent(event.value);
        console.log('onAfterReturnFromContacts2: ' + text);
        var record = bridgeit.url2Object(text);
        $('#cntct2Form')[0].reset();
        for (var key in record)  {
            if(key === 'name'){
                $('#cntct2Name').val(record[key]);
                contacts.cntct2Name = record[key];
            }
            if(key === 'email'){
                $('#cntct2Email').val(record[key]);
                contacts.cntct2Email = record[key];
            }
            if(key === 'phone'){
                $('#cntct2Phone').val(record[key]);
                contacts.cntct2Phone = record[key];
            }
        }
        saveContactsLocally();
    }
}

function initializeContacts(){
    return {'cntct1Name': '',
            'cntct1Email': '',
            'cntct1Phone': '',
            'cntct2Name': '',
            'cntct2Email': '',
            'cntct2Phone': ''
           };
}

function saveContactsLocally(){
    localStorage[CONTACT_STORE_KEY] = JSON.stringify(contacts);
}

//check local storage and load any existing vehicles
var VEHICLES_STORE_KEY = 'vehicles';
var vehicles = getLocallyStoredObject(VEHICLES_STORE_KEY, initializeVehicles);

function onAfterCaptureScan(event)  {
    console.log('onAfterCaptureScan: ' + JSON.stringify(event));
    if(event.name === 'scan1Btn'){
        $('#scn1Form')[0].reset();
        $('#scn1Vin').val(event.value);
        vehicles.scn1Vin = event.value;
        <!-- Hard coded so you can scan any bar code.  This simulates looking up VIN details via a service -->
        $('#scn1Make').val('Lamborghini');
        vehicles.scn1Make = 'Lamborghini';
        $('#scn1Model').val('Gallardo');
        vehicles.scn1Model = 'Gallardo';
        $('#scn1Year').val('2009');
        vehicles.scn1Year = '2009';
    }else if(event.name === 'scan2Btn'){
        $('#scn2Form')[0].reset();
        $('#scn2Vin').val(event.value);
        vehicles.scn2Vin = event.value;
        <!-- Hard coded so you can scan any bar code.  This simulates looking up VIN details via a service -->
        $('#scn2Make').val('Mazda');
        vehicles.scn2Make = 'Mazda';
        $('#scn2Model').val('RX-8');
        vehicles.scn2Model = 'RX-8';
        $('#scn2Year').val('2007');
        vehicles.scn2Year = '2007';
    }
    saveVehiclesLocally();
}

function initializeVehicles(){
    return {'scn1Vin': '',
            'scn1Make': '',
            'scn1Model': '',
            'scn1Year': '',
            'scn2Vin': '',
            'scn2Make': '',
            'scn2Model': '',
            'scn2Year': ''
           };
}

function saveVehiclesLocally(){
    localStorage[VEHICLES_STORE_KEY] = JSON.stringify(vehicles);
}

//check local storage and load existing location
var map;
var mapOptions = {
    maxZoom: 20,
    zoom: 18,
    draggable: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};
var LOCATION_STORE_KEY = 'mapLocation';
var mapLocation = getLocallyStoredObject(LOCATION_STORE_KEY, initializeLocation);

function identifyLocation()  {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function (position){
            mapLocation.latitude = position.coords.latitude;
            mapLocation.longitude = position.coords.longitude;
            placeLocationOnMap();
            saveLocationLocally();
        }, function(){
            handleNoGeolocation(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handeNoGeolocation(false);
    }
}

function placeLocationOnMap(){
    map  = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);
    var pos = new google.maps.LatLng(mapLocation.latitude,mapLocation.longitude);
    var locationMarker = new google.maps.Marker({
        map: map,
        position: pos,
        title: 'Location of Accident'
    });
    map.setCenter(pos);
}

function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }
    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };
    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

function initializeLocation(){
    return {'latitude': '',
            'longitude': ''
           };
}

function saveLocationLocally(){
    localStorage[LOCATION_STORE_KEY] = JSON.stringify(mapLocation);
}

//check photo storage and load any existing photos
var PHOTO_STORE_KEY = 'photos';
var photos = getLocallyStoredArray(PHOTO_STORE_KEY);

function onAfterPhotoCapture(event)  {
    console.log('handleCam: ' + JSON.stringify(event));
    if (event.response)  {
        var photo = JSON.parse(event.response);
        var elem = document.getElementById('images');
        var row = document.createElement('div');
        row.setAttribute('class','row');
        elem.appendChild(row);
        var img = document.createElement('img');
        img.setAttribute('src',  photo);
        row.appendChild(img);
        photos.push(photo);
        savePhotosLocally();
    }
}

function savePhotosLocally(){
    localStorage[PHOTO_STORE_KEY] = JSON.stringify(photos);
}

//check storage and load any existing recordings
var AUDIO_STORE_KEY = 'recordings';
recordings = getLocallyStoredArray(AUDIO_STORE_KEY);
var TEXT_DESCRIPTION_STORE_KEY = 'textDescription';
var textDescription = getLocallyStoredObject(TEXT_DESCRIPTION_STORE_KEY, initializeTextDescription);

function onAfterAudioCapture(event)  {
    console.log('onAfterAudioCapture: ' + event);
    if (event.response)  {
        var audioSrc = JSON.parse(event.response);
        var row = document.createElement('div');
        row.setAttribute('class','row');
        var elem = document.getElementById('recordings');
        elem.insertBefore(row,elem.firstChild);
        var audioElem = document.createElement('audio');
        audioElem.setAttribute('src',  audioSrc);
        audioElem.setAttribute('controls', 'controls');
        audioElem.setAttribute('preload', 'auto');
        audioElem.setAttribute('type', 'audio/mp3');
        row.appendChild(audioElem);
        recordings.push(audioSrc);
        saveRecordingsLocally();
    }
}

function saveRecordingsLocally(){
    localStorage[AUDIO_STORE_KEY] = JSON.stringify(recordings);
}

function initializeTextDescription(){
    return {'description': ''
           };
}

function saveTextDescriptionLocally(){
    localStorage[TEXT_DESCRIPTION_STORE_KEY] = JSON.stringify(textDescription);
}

function getLocallyStoredObject(key, initFunction){
    var localStorageValue = localStorage[key];
    if( localStorageValue ){
        return JSON.parse(localStorageValue);
    }
    else{
        return initFunction();
    }
}

function getLocallyStoredArray(key){
    var localStorageValue = localStorage[key];
    if( localStorageValue ){
        return JSON.parse(localStorageValue);
    }
    else{
        return [];
    }
}

function resetPage(){
    contacts = initializeContacts();
    saveContactsLocally();
    $('#cntct1Form')[0].reset();
    $('#cntct2Form')[0].reset();

    vehicles = initializeVehicles();
    saveVehiclesLocally();
    $('#scn1Form')[0].reset();
    $('#scn2Form')[0].reset();

    mapLocation = initializeLocation();
    saveLocationLocally();
    $(document).off( "expand", "#geotrackColl", loadMap);
    $('#mapCanvas').hide();

    photos = [];
    savePhotosLocally();
    document.getElementById("images").innerHTML = '';

    textDescription = initializeTextDescription();
    saveTextDescriptionLocally();
    $('#dscrForm')[0].reset();
    recordings = [];
    saveRecordingsLocally();
    document.getElementById("recordings").innerHTML = '';
}

var req;
var reportId;

function postData(always){
    var d = new Date();
    reportId = mapLocation.latitude + "-" + mapLocation.longitude + "-" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "-" + d.getHours() + "-" + d.getMinutes() + "-" + d.getMilliseconds();
    alert(reportId);
    var reportUrl = 'http://api.bridgeit.mobi/echo/list/' + encodeURIComponent(reportId);
    alert(reportUrl);
    var jsonData = {"contacts" : contacts,
                    "vehicles" : vehicles,
                    "mapLocation" : mapLocation,
                    "photos" : photos,
                    "textDescription" : textDescription,
                    "recordings" : recordings
    };
    $('.ui-dialog').dialog('close');
    req = $.ajax({
      url:reportUrl,
      type:"POST",
      data:JSON.stringify(jsonData),
      contentType:"application/json; charset=utf-8",
      dataType:"json"
    })
    .always(always);
}

function launchReport(){
    postData(viewAlways);
    var win=window.open('http://' + location.host + '/accident/static.html?reportId=' + reportId, '_blank');
    win.focus();
}

function viewAlways(){
    console.log(JSON.stringify(req));
    if( req.status == 200 ){
        // No further action required
    }
    else{
        alert("Sorry, there was an error sending the report, please try again later.");
    }
}

function smsAlways(){
    console.log(JSON.stringify(req));
    if( req.status == 200 ){
        bridgeit.sms(document.getElementById('smsnumber').value, 'Accident Report http://' + location.host + '/accident/static.html?reportId=' + reportId);
        $('#submitForm')[0].reset();
    }
    else{
        alert("Sorry, there was an error sending the report, please try again later.");
    }
}

function emailAlways(){
    console.log(JSON.stringify(req));
    if( req.status == 200 ){
        $('#submitForm')[0].reset();
        $('.ui-dialog').dialog('close');
        alert( "Page content successfully emailed." );
    }
    else{
        alert("Sorry, there was an error emailing the report, please try again later.");
    }

    messageGiven = true;
}

function validate(form){
    if( form.name.value == ''){
        alert("Don't forget to add your name...");
        return false;
    }
    if( form.email && form.email.value == ''){
        alert("Don't forget to add your email...");
        return false;
    }
    if( form.smsnumber && form.smsnumber.value == ''){
        alert("Don't forget to add a number for the SMS...");
        return false;
    }
    if( form.smsnumber && form.smsnumber.value.length < 7){
        alert("Invalid SMS Input");
        return false;
    }
    if( form.name.value.length > 70){
        alert("Name Invalid.");
        return false;
    }
    if( form.email && form.email.value.length > 200){
        alert("Name Invalid.");
        return false;
    }
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if( form.email && !re.test(form.email.value) ){
        alert('Please check that the provided email is valid.');
        return false;
    }
    return true;
}

function setParams(){
    var contactParams = '';
    contactParams += '&' + $('#cntct1Form').serialize();
    contactParams += '&' + $('#cntct2Form').serialize();
    var scanParams1 = '&' + $('#scn1Form').serialize();
    var scanParams2 = '&' + $('#scn2Form').serialize();
    var lctnParam = '&lctn=';
    if(mapLocation.latitude.length === 0 && mapLocation.longitude.length === 0){
        // Location has not been identified, leave param empty
    }else{
        lctnParam += mapLocation.latitude + ',' + mapLocation.longitude;
    }
    var cmrParams = '';
    var photos = getLocallyStoredArray(PHOTO_STORE_KEY);
    if( photos.length > 0 ){
        for( var i=0 ; i < photos.length; i++ ){
            cmrParams += '&cmr' + i + '=' + photos[i];
        }
    }else{
        cmrParams += '&cmr0=';
    }
    var dscrParam = '&' + $('#dscrForm').serialize();
    var rcrdngsParams = '';
    var recordings = getLocallyStoredArray(AUDIO_STORE_KEY);
    if( recordings.length > 0 ){
        for( var j=0 ; j < recordings.length; j++ ){
            rcrdngsParams += '&rcrdng' + j + '=' + recordings[j];
        }
    }else{
        rcrdngsParams += '&rcrdng0=';
    }
    return contactParams + scanParams1 + scanParams2 + lctnParam + cmrParams + dscrParam + rcrdngsParams;
}

