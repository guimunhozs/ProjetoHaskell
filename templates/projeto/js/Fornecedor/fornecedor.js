$(document).ready(function() {
    var table = $('#example1').DataTable();

    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/fornecedor",
      method: "GET",
      success: function(json){
          console.log(json)
        table.row("#teste").remove().draw();
        json['result'].forEach(function(Element){
            table.row.add([
                Element[0]['id'],    
                Element[0]['nome'],
                Element[1]['nome'],
                Element[2]['sigla'],
                Element[0]['telefone'],
                "<div class='organiza'><i id='e"+Element[0]['id']+"' class='fa fa-window-close btnX'></i><i id='a"+Element[0]['id']+"' class='fa fa-pencil-square btnE'></i></div>"
            ]).draw(false).nodes().to$().attr("id","f"+Element[0]['id']);
        })
    }});
    
    $(document).on('click', '.btnE', function(){
        localStorage.setItem('fornecedorId',this.id);
        window.location="../Fornecedor/editarFornecedor.html"; 
    });
    
    $(document).on('click', '.btnX', function(){
        var table = $('#example1').DataTable();
        var id = this.id;
        id = id.split("e");
        table.row("#f"+id[1]).remove().draw();
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/fornecedor/"+id[1],
          method: "PATCH"
        });
    });
 
    
});