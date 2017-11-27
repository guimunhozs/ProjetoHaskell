$(document).ready(function() {
    var table = $('#example1').DataTable();
// '{"nome":"Monitor 24'", "voltagem":"220V", "patrimonio":"12354765", "marca":"LG", "excluido": false, "clienteId":1}'
// commit no equipamento

    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/funcionario",
      method: "GET",
      success: function(json){
          console.log(json)
        table.row("#teste").remove().draw();
        json['Funcionario'].forEach(function(Element){
            table.row.add([
                Element["id"],    
                Element['nome'],
                Element['cpf'],
                Element['rg'],
                Element["telefone"],
                Element["nivel"],
                "<div class='organiza'><i id='e"+Element['id']+"' class='fa fa-window-close btnX'></i><i id='a"+Element['id']+"' class='fa fa-pencil-square btnE'></i></div>"
            ]).draw(false).nodes().to$().attr("id","eq"+Element['id']);
        })
    }});
    
    $(document).on('click', '.btnE', function(){
        var id = this.id;
        id = id.split("a");
        localStorage.setItem('funcionarioId', id[1]);
        window.location="../Funcionario/editarFuncionario.html"; 
    });
    
    $(document).on('click', '.btnX', function(){
        var table = $('#example1').DataTable();
        var id = this.id;
        id = id.split("e");
        table.row("#eq"+id[1]).remove().draw();
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/funcionario/"+id[1],
          method: "PATCH"
        });
    });
 
    
});