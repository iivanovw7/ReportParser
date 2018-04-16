$( document ).ready(function() {
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
	};

	reader.onload = onload;
	reader.readAsText(input.files[0]);
    $("#placeHolder").remove();
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


var parseReport = function(text) {
    var xmlDoc = $.parseXML(text);
    var reportIndex = 0;

    var measuringPoint = xmlDoc.getElementsByTagName("measuringpoint")[0];
    var measuringChannel01  = measuringPoint.childNodes[0];
    var measuringChannel03  = measuringPoint.childNodes[1];
    console.log(measuringPoint);
    console.log(measuringChannel01);

    $getNumber = $(xmlDoc.getElementsByTagName("measuringpoint")[0]);
    var number = $getNumber.attr('code');


    if (number = 782130212218101) {
        $("#inputNumber").append("РУ-1  0,4кВ");
        reportIndex = 1;
    }




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
        console.log(chartAP[l])
    };


    var chartAP_120 = [];
    for (var t = 0; t < chartAP.length; t = t+4) {
        chartAP_120.push(chartAP[t]);
        console.log(chartAP[t])
    };

    var chartRP_60 = [];
    for (var p = 0; p < chartRP.length; p = p+2) {
        chartRP_60.push(chartRP[p]);
        console.log(chartRP[p])
    };


    var chartRP_120 = [];
    for (var u = 0; u < chartRP.length; u = u+4) {
        chartRP_120.push(chartRP[u]);
        console.log(chartRP[u])
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


};



