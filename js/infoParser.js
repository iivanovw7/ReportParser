$( document ).ready(function() {
    $("#FullChartBtn").hide();
    $("#placeHolder").append("Для вывода отчета загрузите файл с расширением XML");
    
});



var openFile = function(event) {
	var input = event.target;
	var text = "";
	var reader = new FileReader();
	var onload = function(event) {
        text = reader.result;
        parseInfo(text);
        parseReport(text);
        reportParser(text, 0);
        reportParser(text, 1);
        reportParser(text, 2);
        reportParser(text, 3);
	};

	reader.onload = onload;
	reader.readAsText(input.files[0]);
    $("#placeHolder").remove();
    $("#FullChartBtn").show();
};




var parseInfo = function(text) {
	var xmlDoc = $.parseXML(text),
		$xml = $(xmlDoc),
		$fileDate = $xml.find('day');

    var dateString  = $fileDate.text();
    var year        = dateString.substring(0,4);
    var month       = dateString.substring(4,6);
    var day         = dateString.substring(6,8);
    var date      	= year+'.'+month+'.'+day;

    $("#fileDate").append( "Дата формирования отчета: " + "<span class=\"dateStyle\" >" + date +"</span>" + " (гггг.мм.дд)" );

    $timeStamp = $xml.find('timestamp');
    var stampString = $timeStamp.text();
    var sYyear     = stampString.substring(0,4);
    var sMonth     = stampString.substring(4,6);
    var sDay       = stampString.substring(6,8);
    var sHr        = stampString.substring(8,10);
    var sMin       = stampString.substring(10,12);
    var sSec       = stampString.substring(12,14);
    
    var sDate      	= sYyear+'.'+sMonth+'.'+sDay+'  '+sHr+'.'+sMin+'.'+sSec;
    $("#timeStamp").append( "Метка времени формирования отчета: " + "<span class=\"dateStyle\" >"
        + sDate + "</span>" + " (гггг.мм.дд чч.мм.сс)" );

    $sender = $xml.find('comment');
    $("#fileSender").append( $sender.text() );

    
};

var showTitles = function() {

    $("#chartAP60").append("Активная энергия (кВт*ч) / Время окончания периода (часы)");
    $("#chartAP120").append("Активная энергия (кВт*ч) / Время окончания периода (часы)");
    $("#chartRP60").append("Реактивная энергия (кВар*ч) / Время окончания периода (часы)");
    $("#chartRP120").append("Реактивная энергия (кВар*ч) / Время окончания периода (часы)");

};

var reportParser = function(text, pointNumber) {
    var xmlDoc = $.parseXML(text);
    var reportIndex = 0;

    var measuringPoint = xmlDoc.getElementsByTagName("measuringpoint")[pointNumber];
    var measuringChannel01  = measuringPoint.childNodes[0];
    var measuringChannel03  = measuringPoint.childNodes[1];

    $getNumber = $(xmlDoc.getElementsByTagName("measuringpoint")[pointNumber]);
    var number = $getNumber.attr('code');
    console.log(number)

    if (number == 782130212218101) {
        $("#inputNumber"+pointNumber).append("РУ-1  0,4кВ");
        reportIndex = 1;
    } else  

    if (number == 782130212218401) {
        $("#inputNumber"+pointNumber).append("РУ-4  0,4кВ");
        reportIndex = 4;
    } else

    if (number == 782130212218301) {
        $("#inputNumber"+pointNumber).append("РУ-3  0,4кВ");
        reportIndex = 3;
    } else

    if (number == 782130212218201) {
        $("#inputNumber"+pointNumber).append("РУ-2  0,4кВ");
        reportIndex = 2;
    }

    var fullWidthLabels = [];
    var chartAP = [];
    var chartRP = [];

    chartAP.push(null);
    chartRP.push(null);

    var chartAP_sum = 0;
    var chartRP_sum = 0;

    for (var i = 0; i < measuringChannel01.childNodes.length; i++) {

        $y = $(measuringChannel01.childNodes[i]);
        $z = $(measuringChannel03.childNodes[i]);
        $value01 = $y.find("value");
        $value03 = $z.find("value");
        var start = $y.attr('start');
        var end = $y.attr('end');
        var StartHr = start.substring(0,2);
        var StartMin = start.substring(2,4);
        var EndHr = end.substring(0,2);
        var EndMin = end.substring(2,4);
        chartAP.push($value01.text());
        chartRP.push($value03.text());
        fullWidthLabels.push(start.substring(0,4));


        chartAP_sum += Number($value01.text());
        chartRP_sum += Number($value03.text());


        $("#values"+pointNumber).append("<tr>"+"<th>"+i+"</th>"+"<th>"+StartHr+":"+StartMin+"</th>"+"<th>"+EndHr+":"+EndMin+"</th>"+
            "<th>"+$value01.text()+"</th>"+"<th>"+$value03.text()+"</th>"+"</tr>");
    }

    $("#valuesHeader"+pointNumber).append("<tr>"+"<th>№</th>"+"<th>"+"<p>Начало периода</p>"+"</th>"+"<th>"+
    "<p>Окончание периода</p>"+"</th>"+"<th>"+"<p>Активная энергия (кВт*ч)</p>"+"</th>"+
    "</p>"+"<th>"+"<p>Реактивная энергия (кВар*ч)</p>"+"</th>"+"</tr>");

    $("#sumtableAPRP"+pointNumber).append("<tr>"+"<th>"+"Активная энергия"+"</th>"+"<th>"+"Реактивная энергия"+"</th>"+"</tr>"+
    "<tr>"+"<th>"+chartAP_sum+" кВт*ч"+"</th>"+"<th>"+chartRP_sum+" кВар*ч"+"</th>"+"</tr>");


}


var parseReport = function(text) {

    var xmlDoc = $.parseXML(text);
    var reportIndex = 0;

    var measuringPoint = xmlDoc.getElementsByTagName("measuringpoint")[0];
    var measuringChannel01  = measuringPoint.childNodes[0];
    var measuringChannel03  = measuringPoint.childNodes[1];


    $getNumber = $(xmlDoc.getElementsByTagName("measuringpoint")[0]);
    var number = $getNumber.attr('code');


    if (number = 782130212218101) {
        $("#inputNumber").append("РУ-1  0,4кВ");
        reportIndex = 1;
    }



    var fullWidthLabels = [];
    var chartAP = [];
    var chartRP = [];

    chartAP.push(null);
    chartRP.push(null);

    var chartAP_sum = 0;
    var chartRP_sum = 0;


    for (var i = 0; i < measuringChannel01.childNodes.length; i++) {


        $y = $(measuringChannel01.childNodes[i]);
        $z = $(measuringChannel03.childNodes[i]);
        $value01 = $y.find("value");
        $value03 = $z.find("value");
        var start = $y.attr('start');
        var end = $y.attr('end');
        var StartHr = start.substring(0,2);
        var StartMin = start.substring(2,4);
        var EndHr = end.substring(0,2);
        var EndMin = end.substring(2,4);
        chartAP.push($value01.text());
        chartRP.push($value03.text());
        fullWidthLabels.push(start.substring(0,4));


        chartAP_sum += Number($value01.text());
        chartRP_sum += Number($value03.text());


        $("#values").append("<tr>"+"<th>"+i+"</th>"+"<th>"+StartHr+":"+StartMin+"</th>"+"<th>"+EndHr+":"+EndMin+"</th>"+
            "<th>"+$value01.text()+"</th>"+"<th>"+$value03.text()+"</th>"+"</tr>");
    }


    $("#valuesHeader").append("<tr>"+"<th>№</th>"+"<th>"+"<p>Начало периода</p>"+"</th>"+"<th>"+
        "<p>Окончание периода</p>"+"</th>"+"<th>"+"<p>Активная энергия (кВт*ч)</p>"+"</th>"+
        "</p>"+"<th>"+"<p>Реактивная энергия (кВар*ч)</p>"+"</th>"+"</tr>");

    $("#sumtableAPRP").append("<tr>"+"<th>"+"Активная энергия"+"</th>"+"<th>"+"Реактивная энергия"+"</th>"+"</tr>"+
        "<tr>"+"<th>"+chartAP_sum+" кВт*ч"+"</th>"+"<th>"+chartRP_sum+" кВар*ч"+"</th>"+"</tr>");

    var chartAP_60 = [];
    for (var l = 0; l < chartAP.length; l = l+2) {
        chartAP_60.push(chartAP[l]);
    };


    var chartAP_120 = [];
    for (var t = 0; t < chartAP.length; t = t+4) {
        chartAP_120.push(chartAP[t]);
    };

    var chartRP_60 = [];
    for (var p = 0; p < chartRP.length; p = p+2) {
        chartRP_60.push(chartRP[p]);
    };


    var chartRP_120 = [];
    for (var u = 0; u < chartRP.length; u = u+4) {
        chartRP_120.push(chartRP[u]);
    };


    new Chartist.Line('#chart1', {
        labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
        series: [chartAP_60]
    },
        {
            low: 0,
            showArea: true,
            axisX: {
                fillHoles: false,
                onlyInteger: true,
                offset: 40
            },
            axisY: {
                onlyInteger: true,
                offset: 20
            }
        }
    );



    new Chartist.Line('#chart2', {
            labels: [0,2,4,6,8,10,12,14,16,18,20,22,24],
            series: [chartAP_120]
        },
        {
            low: 0,
            showArea: true,
            axisX: {
                onlyInteger: true,
                offset: 40
            },
            axisY: {
                onlyInteger: true,
                offset: 20
            }
        }


    );

    new Chartist.Line('#chart3', {
            labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
            series: [chartRP_60]
        },
        {
            low: 0,
            showArea: true,
            axisX: {
                fillHoles: false,
                onlyInteger: true,
                offset: 40
            },
            axisY: {
                onlyInteger: true,
                offset: 20
            }
        }
    );



    new Chartist.Line('#chart4', {
            labels: [0,2,4,6,8,10,12,14,16,18,20,22,24],
            series: [chartRP_120]
        },
        {
            low: 0,
            showArea: true,
            axisX: {
                onlyInteger: true,
                offset: 40
            },
            axisY: {
                onlyInteger: true,
                offset: 20
            }
        }


    );



    showTitles();


    var ctx = document.getElementById("fullWidthChart").getContext('2d');
    var fullChart01RP = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
            datasets: [{
                label: 'Реактивная энергия (кВар*ч)',
                data: chartRP_60,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            },
            {
                label: 'Активная энергия (кВт*ч)',
                data: chartAP_60,
                borderWidth: 1
            }
        ]
        },
        
        
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Измеряемая величина',
                        fontSize: 20 
                     }
                }]
            }
        }
    });





};



