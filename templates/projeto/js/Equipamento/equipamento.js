$(document).ready(function() {
    var table = $('#example1').DataTable();
// '{"nome":"Monitor 24'", "voltagem":"220V", "patrimonio":"12354765", "marca":"LG", "excluido": false, "clienteId":1}'
// commit no equipamento

    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/equipamento",
      method: "GET",
      success: function(json){
          console.log(json)
        table.row("#teste").remove().draw();
        json['result'].forEach(function(Element){
            table.row.add([
                Element[0]['id'],    
                Element[0]['nome'],
                Element[0]['marca'],
                Element[1]['nome'],
                Element[0]["patrimonio"],
                "<div class='organiza'><i id='e"+Element[0]['id']+"' class='fa fa-window-close btnX'></i><i id='a"+Element[0]['id']+"' class='fa fa-pencil-square btnE'></i></div>"
            ]).draw(false).nodes().to$().attr("id","eq"+Element[0]['id']);
        })
    }});
    
    $(document).on('click', '.btnE', function(){
        var id = this.id;
        id = id.split("a");
        localStorage.setItem('equipamentoId', id[1]);
        window.location="../Equipamento/editarEquipamento.html"; 
    });
    
    $(document).on('click', '.btnX', function(){
        var table = $('#example1').DataTable();
        var id = this.id;
        id = id.split("e");
        table.row("#eq"+id[1]).remove().draw();
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/equipamento/"+id[1],
          method: "PATCH"
        });
    });
 
    
});