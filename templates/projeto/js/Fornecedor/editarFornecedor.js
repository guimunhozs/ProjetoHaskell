$(document).ready(function() {
    var id = localStorage.getItem("fornecedorId");
    
    //função q colocar os valores nos campos
    function valueInput(value,id) {
        $("#"+id).val(value)
    }
    
    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/fornecedor/"+id,
      method: "GET",
      success: function(json){
         var forn = json["Fornecedor"];
        valueInput(id,"cd");
        valueInput(forn["nome"],"razao");
        valueInput(forn["contato"],"nomeContato");
        valueInput(forn["telefone"],"tell");
        valueInput(forn["email"],"email");
        valueInput(forn["cnpj"],"cnpj");
        valueInput(forn["cep"],"cep");
        valueInput(forn["logradouro"],"logradouro");
        valueInput(forn["complemento"],"complemento");
        valueInput(forn["bairro"],"bairro");
        
        
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/estado/",
          method: "GET",
          success: function(estados){
            console.log(estados);
            estados["estados"].forEach(function(Element){
                var estado = new Option(Element["nome"], Element["id"], true, true);
                $("#estado").append(estado).trigger('change');
            });
            var int = parseInt(forn["estadoId"]);
            $("#estado").val(int).trigger('change');
        }});
        
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/cidade/estado/"+forn["estadoId"],
          method: "GET",
          success: function(cidades){
            cidades["cidade"].forEach(function(Element){
                var cidade = new Option(Element["nome"], Element["id"], true, true);
                $("#cidade").append(cidade).trigger('change');
            });
            var int = parseInt(forn["cidadeId"]);
            $("#cidade").val(int).trigger('change');
        }});
        
        // TODO fazer a parte do salvar
          
    }});
    
    
});