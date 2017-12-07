$(document).ready(function() {
    var table = $('#example1').DataTable();

    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/produto",
      method: "GET",
      success: function(json){
          console.log(json)
        table.row("#teste").remove().draw();
        json['result'].forEach(function(Element){
            if (Element[0].quantidadeMin > Element[0].quantidade){
                table.row.add([
                    Element[0]['id'],    
                    Element[0]['nome'],
                    Element[0]['quantidade'],
                    "R$ "+ parseFloat(Element[0]['valorCusto']).toFixed(2),
                    "R$ "+ parseFloat(Element[0]['valorVenda']).toFixed(2),
                    Element[0]['marca'],
                    Element[1]['nome'],
                    "<div class='organiza'><i id='e"+Element[0]['id']+"' class='fa fa-window-close btnX'></i><i id='a"+Element[0]['id']+"' class='fa fa-pencil-square btnE'></i></div>"
                ]).draw(false).nodes().to$().attr("id","p"+Element[0]['id']);
            }     
        })
    }});
    
    $(document).on('click', '.btnE', function(){
        var id = this.id;
        id = id.split("a");
        localStorage.setItem('produtoId', id[1]);
        window.location="../Estoque/editarProduto.html"; 
    });
    
    $(document).on('click', '.btnX', function(){
        var table = $('#example1').DataTable();
        var id = this.id;
        id = id.split("e");
        table.row("#p"+id[1]).remove().draw();
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/produto/"+id[1],
          method: "PATCH"
        });
    });
 
    
});