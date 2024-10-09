$( function() {
// 1 item
    $( "#drag" ).draggable();
// 2 item
$( "#draggable" ).draggable();
    $( "#drop" ).droppable({
      drop: function( event, ui ) {
        $( this )
          .addClass( "ui-state-highlight" )
          .find( "p" )
            .html( "Dropped!" );
      }
    });
    // 3 item
        $( "#resizable" ).resizable();
    //  4 item
        $( "#selectable" ).selectable();
    // 5 item
    $( "#sortable" ).sortable();
  } );