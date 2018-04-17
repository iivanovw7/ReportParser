var xml = "<datetime><timestamp>20180411030425</timestamp><day>20180408</day><daylightsavingtime>0</daylightsavingtime></datetime>",
  xmlDoc = $.parseXML( xml ),
  $xml = $( xmlDoc ),
  $day = $xml.find( "day" );

$( "#someElement" ).append( $day.text() );

$day.text( "XML Title" );

$( "#anotherElement" ).append( $day.text() );




