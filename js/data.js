var xml = "<datetime><timestamp>20180411030425</timestamp><day>20180408</day><daylightsavingtime>0</daylightsavingtime></datetime>",
  xmlDoc = $.parseXML( xml ),
  $xml = $( xmlDoc ),
  $day = $xml.find( "day" );
 
// Append "RSS Title" to #someElement
$( "#someElement" ).append( $day.text() );
 
// Change the title to "XML Title"
$day.text( "XML Title" );
 
// Append "XML Title" to #anotherElement
$( "#anotherElement" ).append( $day.text() );




