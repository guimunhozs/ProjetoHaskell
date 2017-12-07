$(document).ready(function() {
    var table = $('#example1').DataTable();
    
    function getNumero(num){
        if(isNaN(num)){
            return 0;
        }else{
            return num;
        }
    }
    
    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/servico",
      method: "GET",
      success: function(json){
          console.log(json)
        table.row("#teste").remove().draw();
        json['result'].forEach(function(Element){
            if(Element[0].dataFinal == null){
                table.row.add([
                    Element[0]['id'],    
                    Element[2]['nome'],
                    Element[1]['nome'],
                    Element[0]['dataInicial'],
                    Element[0]['dataFinal'],
                    "R$ "+ getNumero(parseFloat(Element[0]['valor'])).toFixed(2),
                    "<div class='organiza'><i id='e"+Element[0]['id']+"' class='fa fa-window-close btnX'></i><i id='a"+Element[0]['id']+"' class='fa fa-pencil-square btnE'></i></div>"
                ]).draw(false).nodes().to$().attr("id","s"+Element[0]['id']);
            }
        })
    }});
    
    $(document).on('click', '.btnE', function(){
        var id = this.id;
        id = id.split("a");
        localStorage.setItem('servicoId', id[1]);
        window.location="../Servico/editarServico.html"; 
    });
    
    $(document).on('click', '.btnX', function(){
        var table = $('#example1').DataTable();
        var id = this.id;
        id = id.split("e");
        table.row("#s"+id[1]).remove().draw();
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/servico/status/"+id[1],
          method: "PATCH"
        });
    });
 
    
});