'use strict';

var chartarea = document.getElementById("myChart").getContext("2d");
   var socket = io.connect('http://stocks-naiyucko.c9users.io/');
   var data3 = {};
   data3.datasets = [];
  socket.on('news', function (data) {
     var htmlsto = "";
      for (var v = 0; v < data.length; v++) {
         htmlsto = htmlsto.concat('<br /><div>' + data[v].stock + '<button class="btn btn-danger" onclick="rrmartin(\'' + data[v].stock + '\')">Remove</button>' + '</div>');
      }
      $("#liststo").html(htmlsto);
     asyncLoop(data.length, function(loop) {
        
    $.ajax({
                    url: 'http://dev.markitondemand.com/Api/v2/InteractiveChart/jsonp?jsoncallback=Lel&parameters=%7B%22Normalized%22%3Afalse%2C%22NumberOfDays%22%3A7%2C%22DataPeriod%22%3A%22Day%22%2C%22Elements%22%3A%5B%7B%22Symbol%22%3A%22' + data[loop.iteration()].stock + '%22%2C%22Type%22%3A%22price%22%2C%22Params%22%3A%5B%22c%22%5D%7D%5D%7D',
                    dataType: 'jsonp',
                    type: 'GET',
                    timeout:3000,
                    beforeSend:function() {
                       $("#loadgif").css("visibility", "visible");
                    },
                    complete:function() {
                       $("#loadgif").css("visibility", "hidden");
                    },                      
                    jsonpCallback: 'jsoncallback',
                    success: function(ahuehue){
                       //console.log(ahuehue.Elements[0].DataSeries.close.values);
         var valuesofdata = ahuehue.Elements[0].DataSeries.close.values;
         data3.labels = ahuehue.Dates;
         var rand1 = Math.floor(Math.random()*(255+1));
         var rand2 = Math.floor(Math.random()*(255+1));
         var rand3 = Math.floor(Math.random()*(255+1));
        data3.datasets[loop.iteration()] = {
            label: ahuehue.Elements[0].Symbol,
            fillColor: "rgba(" + rand1 + "," + rand2 + "," + rand3 + "," + "0.2)",
            strokeColor: "rgba(" + rand1 + "," + rand2 + "," + rand3 + "," + "1)",
            pointColor: "rgba(" + rand1 + "," + rand2 + "," + rand3 + "," + "1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(" + rand1 + "," + rand2 + "," + rand3 + "," + "1)",
            data: valuesofdata
        };
        // Okay, for cycle could continue
        loop.next();
                    }
                });
    },updateChart
   );
  });
  
  $( "#sendBtn" ).click(function() {
  socket.emit('addstock', {stock: $("#moooo").val()});
  $("#moooo").val('');
});

function ajaxRequest (method, url, callback) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
      xmlhttp.send();
   }
   function asyncLoop(iterations, func, callback) {
    var index = 0;
    var done = false;
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);

            } else {
                done = true;
                callback();
            }
        },

        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}
function updateChart() {
     var myLineChart = new Chart(chartarea).Line(data3, {multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>"});
}
function rrmartin (value) {
   socket.emit('removestock', {stock: value});
}
/*
   function addMessage(msg, pseudo) {
    $("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
   }
   function sentMessage() {
    if ($('#messageInput').val() != "") 
    {
        socket.emit('message', $('#messageInput').val());
        addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
        $('#messageInput').val('');
    }
   }
   
   function setPseudo() {
    if ($("#pseudoInput").val() != "")
    {
        socket.emit('setPseudo', $("#pseudoInput").val());
        $('#chatControls').show();
        $('#pseudoInput').hide();
        $('#pseudoSet').hide();
    }
   }
   
   socket.on('message', function(data) {
    addMessage(data['message'], data['pseudo']);
   });
   
$(function() {
    $("#chatControls").hide();
    $("#pseudoSet").click(function() {setPseudo()});
    $("#submit").click(function() {sentMessage();});
});

*/