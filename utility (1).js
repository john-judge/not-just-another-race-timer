 function tableJSONtoHTML(jsonData) {
     
    var col = [];
    var i;
    for (i = 0; i < jsonData.length; i++) {
        for (var key in jsonData[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // Create dynamic table
    var table = document.createElement("table");
    table.setAttribute("style", "border: 2px solid #1c87c9; \
                                border-collapse: collapse;  \
                                width: 70%");
     
    var tr = table.insertRow(-1);                   // table row
    tr.setAttribute("style", "border: 2px solid #1c87c9");

    for (i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // table header
        th.innerHTML = col[i];
        tr.appendChild(th);
    }
    // Add rows
    for (i = 0; i < jsonData.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = jsonData[i][col[j]];
        }
    }
    return table;
 }
 
 function addRowHandlers(tbl, trigger) {
    var rows = tbl.rows;
    for (i = 0; i < rows.length; i++) {
        rows[i].onclick = function(){ return function(){
            $(this).addClass('selected').siblings().removeClass('selected');
            trigger(this.cells);
        };}(rows[i]);
    }
}

function haversineDisplacement(coord1, coord2) {
    // given two locations in form {lat, lng} in degrees, compute the distance in meters as the crow flies {x,y}, such that the distance is Haversine (great circle distance)
    // transitivity approximation holds well for both equator and poles
    
    var radian = Math.PI / 180;
    var R = 6378137; // radius of Earth in meters 
    
    // separation of latitude is locally approx. Cartesian
    var dy = (coord2.lat - coord1.lat) * radian; 
    // but longitudinal sep does NOT approximate Cartesian locally.
    var dx = (coord2.lng - coord1.lng) * radian; 

    var sinLon = Math.sin(dx / 2);
    var a = Math.cos(coord2.lat * radian) * sinLon * sinLon;
    var c = Math.atan( Math.sqrt(a), Math.sqrt(1-a) );
    dx = 2 * c * c;

    return {x: dx * R, y: dy * R}; 
}


