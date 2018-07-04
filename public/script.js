(function() {
   var canvas = document.getElementById("canvas");
   var context = canvas.getContext("2d");

   context.fillStyle = "#fff"; //internal color of the background of the canvas
   context.strokeStyle = "#444";//color of my signature
   context.lineWidth = 1.5;//thickness of the line of my signature
   //context.lineCap = "round";
   context.fillRect(0, 0, canvas.width, canvas.height); //area of signature: we start from point x=0 and y=0 and we set maximal width and height for signature
   var pixels = [];
   var cpixels = [];
   var xyLast = {};
   var xyAddLast = {};
   var calculate = false;
   //functions
   function remove_event_listeners() {
       canvas.removeEventListener("mousemove", on_mousemove, false);
       canvas.removeEventListener("mouseup", on_mouseup, false);
       document.body.removeEventListener("mouseup", on_mouseup, false);
   }
   function get_coords(e) {
       var x, y;
       if (e.layerX || 0 == e.layerX) {
           x = e.layerX;
           y = e.layerY;
       } else if (e.offsetX || 0 == e.offsetX) {
           x = e.offsetX;
           y = e.offsetY;
       }

       return {
           x: x,
           y: y
       };
   }

   function on_mousedown(e) {
       e.preventDefault();
       e.stopPropagation();
       canvas.addEventListener("mouseup", on_mouseup, false);
       canvas.addEventListener("mousemove", on_mousemove, false);
       document.body.addEventListener("mouseup", on_mouseup, false);
       empty = false;
       var xy = get_coords(e);
       context.beginPath();
       pixels.push("moveStart");
       context.moveTo(xy.x, xy.y);
       pixels.push(xy.x, xy.y);
       xyLast = xy;
   }

   function on_mousemove(e, finish) {
       e.preventDefault();
       e.stopPropagation();
       var xy = get_coords(e);
       var xyAdd = {
           x: (xyLast.x + xy.x) / 2,
           y: (xyLast.y + xy.y) / 2
       };

       if (calculate) {
           var xLast = (xyAddLast.x + xyLast.x + xyAdd.x) / 3;
           var yLast = (xyAddLast.y + xyLast.y + xyAdd.y) / 3;
           pixels.push(xLast, yLast);
       } else {
           calculate = true;
       }

       context.quadraticCurveTo(xyLast.x, xyLast.y, xyAdd.x, xyAdd.y);
       pixels.push(xyAdd.x, xyAdd.y);
       context.stroke();
       context.beginPath();
       context.moveTo(xyAdd.x, xyAdd.y);
       xyAddLast = xyAdd;
       xyLast = xy;
   }
   function on_mouseup(e) {
       remove_event_listeners();
       //disableSave = false;
       context.stroke();
       pixels.push("e");
       calculate = false;
   }
   canvas.addEventListener("mousedown", on_mousedown, false);
})();
