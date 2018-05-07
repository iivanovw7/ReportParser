//getting page onload states
$( document ).ready(function() {
    $(".measuringBlock").hide();
    $("#FullChartBtn").hide();
    $("#placeHolder").append("Для вывода отчета загрузите файл с расширением XML");
    $('.hidden').fadeIn(1000).removeClass('hidden');
    
});

var fullChartShow = function() {
    $("#tableChart").fadeIn();
    $("#fullwidth").fadeIn();
    $("#fullChart").hide();
     $(".measuringBlock").hide();
  }

var tableChartShow = function() {
    $("#tableChart").hide();
    $("#fullwidth").hide();
    $("#fullChart").fadeIn();
    $(".measuringBlock").fadeIn();
  }

var initialChartShow = function() {
    $("#tableChart").hide();
    $("#fullwidth").hide();
    $("#fullChart").fadeIn();
  }



//upload xml file function
//calling parsing function with measuring point id
var openFile = function(event) {
	var input = event.target;
	var text = "";
	var reader = new FileReader();
	var onload = function(event) {
        text = reader.result;
        parseInfo(text);
        reportParser(text, 0);
        reportParser(text, 1);
        reportParser(text, 2);
        reportParser(text, 3);
        reportSumTables();
	};

	reader.onload = onload;
    reader.readAsText(input.files[0]);
    
    initialChartShow();
    $("#placeHolder").remove();
    $("#FullChartBtn").fadeIn();
    $("#fullChart").fadeIn();
    $(".measuringBlock").fadeIn();
};


//show report information block
var parseInfo = function(text) {

    $("#fileDate").empty();
    $("#timeStamp").empty();
    $("#fileSender").empty();

	var xmlDoc = $.parseXML(text),
		$xml = $(xmlDoc),
		$fileDate = $xml.find('day');

    var dateString  = $fileDate.text();
    var year        = dateString.substring(0,4);
    var month       = dateString.substring(4,6);
    var day         = dateString.substring(6,8);
    var date      	= year+'.'+month+'.'+day;

    $("#fileDate").append( "Отчетный период: " + "<span class=\"dateStyle\" >" + date +"</span>" + " (гггг.мм.дд)" );

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


var ChartAP60_1 = [];
var ChartRP60_1 = [];

var ChartAP60_2 = [];
var ChartRP60_2 = [];

var ChartAP60_3 = [];
var ChartRP60_3 = [];

var ChartAP60_4 = [];
var ChartRP60_4 = [];

var chartAP_sum_1 = 0;
var chartRP_sum_1 = 0;

var chartAP_sum_2 = 0;
var chartRP_sum_2 = 0;

var chartAP_sum_3 = 0;
var chartRP_sum_3 = 0;

var chartAP_sum_4 = 0;
var chartRP_sum_4 = 0;

// function saving AR RP values to global variables, to form overrall sum report
var overallSum = function(value_AR, value_RP, pointNumber) {
    
    switch(pointNumber) {
        case 0:
            chartAP_sum_1 = value_AR;
            chartRP_sum_1 = value_RP;
            break;
        case 1:
            chartAP_sum_4 = value_AR;
            chartRP_sum_4 = value_RP;
            break;
        case 2:
            chartAP_sum_3 = value_AR;
            chartRP_sum_3 = value_RP;
            break;
        case 3:
            chartAP_sum_2 = value_AR;
            chartRP_sum_2 = value_RP;
            break;
        default:
            break;
    }


}

//function exports sum data to titleWrapper
var reportSumTables = function() {

    var AP = chartAP_sum_1 + chartAP_sum_2 + chartAP_sum_3 + chartAP_sum_4;
    var RP = chartRP_sum_1 + chartRP_sum_2 + chartRP_sum_3 + chartRP_sum_4;

    $("#sumtableAPRP_header").empty();
    $("#sumtableAPRP_title").empty();

    $("#sumtableAPRP_title").append("<span>"+"Накопленные данные по отчету:"+"</span>");

    $("#sumtableAPRP_header").append("<tr>"+"<th>"+"Активная энергия"+"</th>"+"<th>"+"Реактивная энергия"+"</th>"+"</tr>"+
    "<tr>"+"<th>"+AP+" кВт*ч"+"</th>"+"<th>"+RP+" кВар*ч"+"</th>"+"</tr>");

}



//xml parsing function
var reportParser = function(text, pointNumber) {
    var xmlDoc = $.parseXML(text);
    var reportIndex = 0;
    var chartA = "";
    var chartB = "";
    var chartC = "";
    var chartD = "";

    var measuringPoint = xmlDoc.getElementsByTagName("measuringpoint")[pointNumber];
    var measuringChannel01  = measuringPoint.childNodes[0];
    var measuringChannel03  = measuringPoint.childNodes[1];

    $getNumber = $(xmlDoc.getElementsByTagName("measuringpoint")[pointNumber]);
    var number = $getNumber.attr('code');

    var fullWidthLabels = [];
    var chartAP = [];
    var chartRP = [];

    chartAP.push(null);
    chartRP.push(null);

    var chartAP_sum = 0;
    var chartRP_sum = 0;

    $("#values"+pointNumber).empty();

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

    $("#valuesHeader"+pointNumber).empty();
    $("#sumtableAPRP"+pointNumber).empty();
    $("#sumtableWide"+pointNumber).empty();


    $("#valuesHeader"+pointNumber).append("<tr>"+"<th>№</th>"+"<th>"+"<p>Начало периода</p>"+"</th>"+"<th>"+
    "<p>Окончание периода</p>"+"</th>"+"<th>"+"<p>Активная энергия (кВт*ч)</p>"+"</th>"+
    "</p>"+"<th>"+"<p>Реактивная энергия (кВар*ч)</p>"+"</th>"+"</tr>");

    $("#sumtableAPRP"+pointNumber).append("<tr>"+"<th>"+"Активная энергия"+"</th>"+"<th>"+"Реактивная энергия"+"</th>"+"</tr>"+
    "<tr>"+"<th>"+chartAP_sum+" кВт*ч"+"</th>"+"<th>"+chartRP_sum+" кВар*ч"+"</th>"+"</tr>");

    $("#sumtableWide"+pointNumber).append("<tr>"+"<th>"+"Активная энергия"+"</th>"+"<th>"+"Реактивная энергия"+"</th>"+"</tr>"+
    "<tr>"+"<th>"+chartAP_sum+" кВт*ч"+"</th>"+"<th>"+chartRP_sum+" кВар*ч"+"</th>"+"</tr>");

    overallSum(chartAP_sum, chartRP_sum, pointNumber);

    //variables for charts

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


    //get measuring point parameters and call fullWidthChart functions separately
    if (number == 782130212218101) {
        $("#inputNumber"+pointNumber).empty()
        $("#inputNumber"+pointNumber).append("РУ-1  0,4кВ");
        reportIndex = 1;
        chartA = "#chartAP600";
        chartB = "#chartAP1200";
        chartC = "#chartRP600";
        chartD = "#chartRP1200";
        drawFullWidthChart00(chartRP_60, chartAP_60);
        
    } else  

    if (number == 782130212218401) {
        $("#inputNumber"+pointNumber).empty()
        $("#inputNumber"+pointNumber).append("РУ-4  0,4кВ");
        reportIndex = 4;
        chartA = "#chartAP601";
        chartB = "#chartAP1201";
        chartC = "#chartRP601";
        chartD = "#chartRP1201";
        drawFullWidthChart01(chartRP_60, chartAP_60);
        
    } else

    if (number == 782130212218301) {
        $("#inputNumber"+pointNumber).empty()
        $("#inputNumber"+pointNumber).append("РУ-3  0,4кВ");
        reportIndex = 3;
        chartA = "#chartAP602";
        chartB = "#chartAP1202";
        chartC = "#chartRP602";
        chartD = "#chartRP1202";
        drawFullWidthChart02(chartRP_60, chartAP_60);
        
    } else

    if (number == 782130212218201) {
        $("#inputNumber"+pointNumber).empty()
        $("#inputNumber"+pointNumber).append("РУ-2  0,4кВ");
        reportIndex = 2;
        chartA = "#chartAP603";
        chartB = "#chartAP1203";
        chartC = "#chartRP603";
        chartD = "#chartRP1203";
        drawFullWidthChart03(chartRP_60, chartAP_60);
        
    }


    //append chart in right bar

        new Chartist.Line([chartA], {
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

        new Chartist.Line([chartB], {
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

        new Chartist.Line([chartC], {
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



        new Chartist.Line([chartD], {
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

    
        

};


var drawFullWidthChart00 = function(chartRP_60, chartAP_60) {
    new Chart(document.getElementById("wideChart0"), {
        type: 'line',
        data: {
            labels: ["0:00","1:00","2:00","3:00","4:00","5:00","6:00","7:00",
            "8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00",
            "18:00","19:00","20:00","21:00","22:00","23:00","24:00"],
            datasets: [{
                label: 'Реактивная энергия (кВар*ч)',
                data: chartRP_60,
                fill: true,
                backgroundColor: "rgba(66, 129, 191,0.3)",
                borderColor: "rgba(66, 129, 191,1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(66, 129, 191,1)",
            },
                {
                    label: 'Активная энергия (кВт*ч)',
                    data: chartAP_60,
                    fill: true,
                    backgroundColor: "rgba(255,99,132,0.2)",
                    borderColor: "rgba(255,99,132,1)",
                    pointBorderColor: "#fff",
                    pointBackgroundColor: "rgba(255,99,132,1)",
                    pointBorderColor: "#fff",
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
}

var drawFullWidthChart01 = function(chartRP_60, chartAP_60) {
    new Chart(document.getElementById("wideChart1"), {
        type: 'line',
        data: {
            labels: ["0:00","1:00","2:00","3:00","4:00","5:00","6:00","7:00",
            "8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00",
            "18:00","19:00","20:00","21:00","22:00","23:00","24:00"],
            datasets: [{
                label: 'Реактивная энергия (кВар*ч)',
                data: chartRP_60,
                fill: true,
                backgroundColor: "rgba(66, 129, 191,0.3)",
                borderColor: "rgba(66, 129, 191,1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(66, 129, 191,1)",
            },
                {
                    label: 'Активная энергия (кВт*ч)',
                    data: chartAP_60,
                    fill: true,
                    backgroundColor: "rgba(255,99,132,0.2)",
                    borderColor: "rgba(255,99,132,1)",
                    pointBorderColor: "#fff",
                    pointBackgroundColor: "rgba(255,99,132,1)",
                    pointBorderColor: "#fff",
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
}

var drawFullWidthChart02 = function(chartRP_60, chartAP_60) {
    new Chart(document.getElementById("wideChart2"), {
        type: 'line',
        data: {
            labels: ["0:00","1:00","2:00","3:00","4:00","5:00","6:00","7:00",
            "8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00",
            "18:00","19:00","20:00","21:00","22:00","23:00","24:00"],
            datasets: [{
                label: 'Реактивная энергия (кВар*ч)',
                data: chartRP_60,
                fill: true,
                backgroundColor: "rgba(66, 129, 191,0.3)",
                borderColor: "rgba(66, 129, 191,1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(66, 129, 191,1)",
            },
                {
                    label: 'Активная энергия (кВт*ч)',
                    data: chartAP_60,
                    fill: true,
                    backgroundColor: "rgba(255,99,132,0.2)",
                    borderColor: "rgba(255,99,132,1)",
                    pointBorderColor: "#fff",
                    pointBackgroundColor: "rgba(255,99,132,1)",
                    pointBorderColor: "#fff",
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
}

var drawFullWidthChart03 = function(chartRP_60, chartAP_60) {
    new Chart(document.getElementById("wideChart3"), {
        type: 'line',
        data: {
            labels: ["0:00","1:00","2:00","3:00","4:00","5:00","6:00","7:00",
            "8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00",
            "18:00","19:00","20:00","21:00","22:00","23:00","24:00"],
            datasets: [{
                label: 'Реактивная энергия (кВар*ч)',
                data: chartRP_60,
                fill: true,
                backgroundColor: "rgba(66, 129, 191,0.3)",
                borderColor: "rgba(66, 129, 191,1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(66, 129, 191,1)",
            },
                {
                    label: 'Активная энергия (кВт*ч)',
                    data: chartAP_60,
                    fill: true,
                    backgroundColor: "rgba(255,99,132,0.2)",
                    borderColor: "rgba(255,99,132,1)",
                    pointBorderColor: "#fff",
                    pointBackgroundColor: "rgba(255,99,132,1)",
                    pointBorderColor: "#fff",
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
}

