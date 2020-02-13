
$( document ).ready(function() {




var Label = {
    table:0,
    info_array:[],
    colors: ['red', 'blue', 'green', 'black','yellow'], 
   
    images:[
        // 'labeling_0000.jpg',
        // 'labeling_0001.jpg',
        // 'labeling_0002.jpg',
    ],
    datas:[],

    current_task: 0,

    scale_ratio:1,


    init:function(datas, images=[]){
        this.datas = datas;
        this.images = images;

        this.setupEventListener();
        this.renderImage();
        this.renderInfo();
    },

    setupEventListener:function(){
        
        // 
        $(document).on('keypress',function(e) {
            if(e.which == 13) {
                Label.submit(e)
            }
        });
        
        
        // Submit button
        document.getElementById("submit-btn").addEventListener('click',function(e){
            Label.submit(e)
        });

            
    },

    submit:function(e){
        event.preventDefault();

        // 1.Ouput的 data
        var messages = '';
        var elements = [];
        var rows = Label.table.rows( { selected: true } ).data()
        
            // 
        for(var i=0;i<rows.length;i++){
            messages+=" "+rows[i]['text']

            var boundingBox = rows[i]['boxes']
            elements.push({"boundingBox":boundingBox});
        }

        console.log(messages)
        console.log(elements)
       

        $.ajax({
            type: "POST",
            url: '',
            data: {
              text: messages.trim() ,
              elements:elements
            },
            dataType: 'json',
            success: function (data) {
              if (data.is_taken) {
                alert("A user with this username already exists.");
              }
            }
        })
        .then(()=>{

        });

        // Clean previous datable
        $('#info_table').DataTable().clear().destroy();
        $('#info_table tbody').remove();
        $('#info_table tbody').empty();
        Label.table=0;
        Label.info_array = []

        
        // 下一張
        Label.current_task +=1;
        localStorage.setItem("current_task", Label.current_task);

        Label.renderImage();
        Label.renderInfo();
    },

    renderInfo:function(){
        var category = Label.datas[Label.current_task].contents;

        // Loop through 2d array, and assign to Label.info_array
        for(var i=0;i<category.length;i++){
            var rows = category[i];
            
            for(var j=0;j<rows.length;j++){
                var row = rows[j]
                Label.info_array.push(row)
            }
        }
        
        Label.table = $('#info_table').DataTable( {
            "processing": true,
            data:Label.info_array,

            "createdRow": function( row, data, dataIndex){
                var colors = Label.colors;
                $(row).addClass(colors[data['colour']]+"Class");
            },
            "columns": [
                { "data": "text" },
                { "data": "reason" },
                { "data": "prob" },
            ],
            "order": [[ 2, "desc" ]],
            select: {
                style: 'multi'
            },
        }).row(':eq(0)').select();
    },

    renderImage:function(){
        $("#next_images_prev").attr("src","/static/img/output_img_tel/"+this.images[this.current_task+1]);
        $("#active_img_prev").attr("src","/static/img/output_img_tel/"+this.images[this.current_task]);


        var canvas=document.getElementById("myCanvas");
        var ctx=canvas.getContext("2d");


        var bbox_annotator_img=document.getElementById("active_img_prev");  

        this.scale_ratio = 500/bbox_annotator_img.width;


        bbox_annotator_img.onload = function(){
            // ctx.clearRect(0, 0, ctx.width,ctx.height);

            // ctx.fillStyle = "rgba(0, 0, 0, 0)";
            // ctx.fillRect(0, 0, ctx.width, ctx.height);

            ctx.beginPath();
            ctx.drawImage(bbox_annotator_img,
                0,
                0,
                // bbox_annotator_img.width * this.scale_ratio, //width
                // bbox_annotator_img.height * this.scale_ratio, //height
                
            );

            ctx.clearRect(0, 0, ctx.width,ctx.height);


            
            // Label.renderBoundingBox();

        }
        

        
    },
    
    renderBoundingBox:function(){;
        
        var canvas=document.getElementById("myCanvas");
        var ctx=canvas.getContext("2d");

        var colors = ['red', 'blue', 'green', 'black','yellow'];
        var colors_index = 0
       
    
        this.datas.contents.forEach(function(item, i) {
            var text = item['text'];
            // var words = item['words']
            var boundingBox_array = item['boundingBox'];
            var reason = item['reason'];

            
            // // Draw Info
            // var div =  $("<div> ");

            // for(var j=0; i<boundingBox_array.length;j++){
            //     // var id =  "user_chosen_group"+i;


            //     var label = $("<label>").text(text);
            //     var input = $('<input type="checkbox">')
            //         .attr({
            //             name: 'user_chosen_group',
            //             // value:5*i+j
            //         });

            //     input.appendTo(label);
            //     label.appendTo(div);
            // }
            // div.appendTo('#info_field');
            
            
            
            // Draw box
            boundingBox_array.forEach(function(box, i){
                var [x1,y1,x2,y2,x3,y3,x4,y4] = box;

                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = colors[colors_index];
                ctx.moveTo(x1,y1);
                ctx.lineTo(x2,y2);
                ctx.lineTo(x3,y3);
                ctx.lineTo(x4,y4);
                ctx.closePath();
                ctx.stroke();
                
            });

            colors_index+=1
            
        });

        // var test1 = [59, 151, 99, 144, 101, 154, 61, 161]
        // var test2 = [101, 143, 111, 142, 113, 153, 103, 154]
        // ctx.scale(this.scale_ratio,1);
        
        // ctx.beginPath();
        // ctx.lineWidth = 7;
        // ctx.strokeStyle = "red";
        // ctx.moveTo(59,151);
        // ctx.lineTo(99,144);
        // ctx.lineTo(101,154);
        // ctx.lineTo(61,161);
        // ctx.closePath();
        // ctx.stroke();
        
        // /////
        // ctx.beginPath();
        // ctx.lineWidth = 7;
        // ctx.strokeStyle = "red";
        // ctx.moveTo(101,143);
        // ctx.lineTo(111,142);
        // ctx.lineTo(113,153);
        // ctx.lineTo(103,154);
        // ctx.closePath();

        // ctx.stroke();
        
      }


};

window.Label = Label;
});













// /*
// ============ Initializing Annotator ============
// */
// var annotator;
// var annotations = []

// function getParameterByName(name) {
//     var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
//     return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
// }

// function addAnnotation(left, top, width, height, label) {
//     var html = '<div class="entry">' +
//         '<p class="line"><span class="boldme">Object: </span>' + label + '</p>' +
//         '<p class="line"><span class="boldme">Corner: </span>' + left + 'x' + top + '</p>' +
//         '<p class="line"><span class="boldme">Size: </span>' + width + 'x' + height + '</p>' +
//         '</div>'
//     $('#annotated_box').append(html);
// }

// function renderTask(task) {
//     // Can be one of ['text', 'select', 'fixed']
//     var inputMethod = getParameterByName("input");
//     $("#bbox_annotator").empty()
//     $("#annotated_box").empty().append("<h3>Annotations</h3>");
//     // Initialize the bounding-box annotator.
//     annotator = new BBoxAnnotator({
//         url: task.params.attachment,
//         input_method: "fixed",
//         //input_method: "select",
//         labels: task.objects_to_annotate,
//         onchange: function(entries) {
//             // Input the text area on change. Use "hidden" input tag unless debugging.
//             // <input id="annotation_data" name="annotation_data" type="hidden" />
//             // $("#annotation_data").val(JSON.stringify(entries))
//             //$("#annotation_data").text(JSON.stringify(entries, null, "  "));
//             $("#annotated_box").empty().append("<h3>Annotations</h3>");
//             for (i = 0; i < entries.length; i++) {
//                 addAnnotation(entries[i].left, entries[i].top, entries[i].width, entries[i].height, entries[i].label);
//             }
//             annotations = entries;
//             console.log(entries);
//         },
//         radio: $('input:radio:checked')
//     });
//     // Initialize the reset button.
//     $("#reset_button").click(function(e) {
//         annotator.clear_all();
//     })
//     $(document).keypress(function(e) {
//         if (e.which == 114) { // r key press
//             annotator.clear_all();
//         }
//     });
// }

// /*
// ============ Initializing Angular ============
// */

// var current_task = {};
// var current_index = 0;
// var all_tasks = [];y
// var app = angular.module('myApp', []);

// app.factory('socket', ['$rootScope', function($rootScope) {
//     var socket = io.connect();

//     return {
//         on: function(eventName, callback) {
//             socket.on(eventName, callback);
//         },
//         emit: function(eventName, data) {
//             socket.emit(eventName, data);
//         }
//     };
// }]);

// app.controller('TaskController', function($scope, socket) {
//     function load_task() {
//         $scope.task_id = current_task._id;
//         $scope.callback_url = current_task.callback_url;
//         $scope.attachment = current_task.params.attachment;
//         $scope.created_at = current_task.created_at;
//         $scope.instruction = current_task.instruction;
//         $scope.objects_to_annotate = current_task.params.objects_to_annotate;
//         $scope.urgency = current_task.urgency;
//         $scope.with_labels = current_task.params.with_labels;
//         renderTask(current_task);
//     }

// /*
// ============ DOM Element Actions ============
// */

//     $(document).keypress(function(e) {
//         if (e.which == 13 || e.which == 32) { // enter or space
//             e.preventDefault();
//             //current_task = all_tasks[4];
//             //$scope.$apply(load_task);
//             current_task.annotations = annotations;
//             socket.emit("task", current_task);
//         } else if (e.which == 114) { // r key press
//             socket.emit('reset', 'hello');
//         } else if (e.which == 33) {
//             socket.emit('reset', 'hello');
//         }
//     });

//     $("#submit-btn").click(function(event) {
//         event.preventDefault();
//         current_task.annotations = annotations;
//         socket.emit("task", current_task);
//     });

//     $("#most_important").click(function(event) {
//         socket.emit("most_important");
//     });

//     $("#date_created").click(function(event) {
//         socket.emit("date_created");
//     });

//     $("#submit_error").click(function(event) {
//         console.log($("#error_message").val());
//         socket.emit("error_msg", {
//             'task': current_task,
//             'error': $("#error_message").val()
//         });
//     });

//     $scope.changeTask = function(index) {
//         current_task = all_tasks[index];
//         load_task();
//     };

// /*
// ============ WebSocket Controller ============
// */
    
//     // On connection, just output on console
//     socket.on('connect', function() {
//         $scope.$apply(function() {
//             console.log("Connected to WebSocket Server");
//         });
//     });

//     // All messages or errors will be outputed in the message box
//     socket.on('message', function(msg) {
//         $scope.$apply(function() {
//             var now = new Date();
//             $scope.message = msg;
//             var old_text = $("#output_message").text();
//             $("#output_message").text(old_text + now + " - " + msg + "\n");
//             $(document).ready(function(){
//                 $('#output_message').scrollTop($('#output_message')[0].scrollHeight);
//             });
//         });
//     });

//     // All tasks get sent to front end, and will load task 
//     // (for scalability, do not send all tasks)
//     socket.on('tasks', function(msg) {
//         $scope.$apply(function() {
//             all_tasks = msg.slice();
//             if (all_tasks.length == 0) {
//                 $scope.task_id = '';
//                 $scope.callback_url = '';
//                 $scope.attachment = '';
//                 $scope.created_at = '';
//                 $scope.instruction = '';
//                 $scope.objects_to_annotate = '';
//                 $scope.urgency = '';
//                 $scope.with_labels = false;
//                 all_tasks = [];
//                 current_task = {};
//                 $scope.tasks = all_tasks;
//                 $("#bbox_annotator").empty().append("<h1>You're all done. You can go home now</h1>");
//                 $("#annotated_box").empty().append("<h3>Annotations</h3>");
//             }
//             current_task = msg[0];
//             console.log(current_task);
//             load_task();
//             $scope.tasks = msg;
//             console.log(msg);
//         });
//     });
// });
