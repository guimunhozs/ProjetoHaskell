$(document).ready(function() {
    var table = $('#example1').DataTable();
    
     $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/venda",
      method: "GET",
      success: function(json){
          console.log(json)
        table.row("#teste").remove().draw();
        console.log(json);
        json['result'].forEach(function(Element){
            table.row.add([
                Element[0]['id'],    
                Element[2]['nome'],
                Element[1]['nome'].split(" ")[0]+" "+Element[1]['nome'].split(" ")[1].split("")[0].toUpperCase()+".",
                Element[0]['valor'].toFixed(2),
                Element[0]['dataEmissao'],
                Element[0]["dataVencimento"],
                "<div class='organiza'><i id='e"+Element[0]['id']+"' class='fa fa-window-close btnX'></i><i id='a"+Element[0]['id']+"' class='fa fa-pencil-square btnE'></i></div>"
            ]).draw(false).nodes().to$().attr("id","eq"+Element[0]['id']);
        })
    }});
    
    $(document).on('click', '.btnE', function(){
        var id = this.id;
        id = id.split("a");
        localStorage.setItem('vendaId', id[1]);
        window.location="../Vendas/editarVenda.html"; 
    });
    
    $(document).on('click', '.btnX', function(){
        var table = $('#example1').DataTable();
        var id = this.id;
        id = id.split("e");
        table.row("#eq"+id[1]).remove().draw();
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/venda/"+id[1],
          method: "PATCH"
        });
    });
 
    
});