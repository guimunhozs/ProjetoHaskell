$(document).ready(function() {
    var table = $('#example1').DataTable();

    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/cliente",
      method: "GET",
      success: function(json){
          console.log(json)
        table.row("#teste").remove().draw();
        json['Cliente'].forEach(function(Element){
            table.row.add([
                Element['id'],    
                Element['nome'],
                Element['cpf'],
                Element['rg'],
                Element['telefone'],
                "<div class='organiza'><i id='e"+Element['id']+"' class='fa fa-window-close btnX'></i><i id='a"+Element['id']+"' class='fa fa-pencil-square btnE'></i></div>"
            ]).draw(false).nodes().to$().attr("id","c"+Element['id']);
        })
    }});
    
    $(document).on('click', '.btnE', function(){
        var id = this.id;
        id = id.split("a");
        localStorage.setItem('clienteId', id[1]);
        window.location="../Cliente/editarCliente.html"; 
    });
    
    $(document).on('click', '.btnX', function(){
        var table = $('#example1').DataTable();
        var id = this.id;
        id = id.split("e");
        table.row("#c"+id[1]).remove().draw();
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/cliente/"+id[1],
          method: "PATCH"
        });
    });
 
    
});