$(document).ready(function() {
    var id = localStorage.getItem("clienteId");
    
    //função q colocar os valores nos campos
    function valueInput(value,id) {
        $("#"+id).val(value)
    }
    
    $.ajax({
      url: "https://haskalpha-romefeller.c9users.io/cliente/"+id,
      method: "GET",
      success: function(json){
         var cli = json["Cliente"];
        valueInput(id,"cd");
        valueInput(cli["nome"],"nome");
        valueInput(cli["email"],"email");
        valueInput(cli["telefone"],"tell");
        valueInput(cli["rg"],"rg");
        valueInput(cli["cpf"],"cpf");
        valueInput(cli["cep"],"cep");
        valueInput(cli["logradouro"],"logradouro");
        valueInput(cli["complemento"],"complemento");
        valueInput(cli["bairro"],"bairro");
        
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/estado/",
          method: "GET",
          success: function(estados){
            estados["estados"].forEach(function(Element){
                var estado = new Option(Element["nome"], Element["id"], true, true);
                $("#estado").append(estado);
            });
            var int = parseInt(cli["estadoId"]);
            $("#estado").val(int);
        }});
        
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/cidade/estado/"+cli["estadoId"],
          method: "GET",
          success: function(cidades){
            localStorage.setItem("cidades",JSON.stringify(cidades));
            cidades["cidade"].forEach(function(Element){
                var cidade = new Option(Element["nome"], Element["id"], true, true);
                $("#cidade").append(cidade);
            });
            var int = parseInt(cli["cidadeId"]);
            $("#cidade").val(int);
        }});
    }});
    
    function salvar(){
      var nome = $("#nome").val();
      var logradouro = $("#logradouro").val();
      var cep = $("#cep").val();
      var cpf = $("#cpf").val();
      var rg = $("#rg").val();
      var telefone = $("#tell").val();
      var email = $("#email").val();
      var bairro = $("#bairro").val();
      var excluido = "false";
      var complemento = $("#complemento").val();
      var cidadeId = parseInt($("#cidade").val());
      var estadoId = parseInt($("#estado").val());

      var json = '{"nome":"'+nome+'",'
               + '"rg":"'+rg+'",'
               + '"cpf":"'+cpf+'",'
               + '"logradouro":"'+logradouro+'",'
               + '"bairro":"'+bairro+'",'
               + '"cep":"'+cep+'",'
               + '"telefone":"'+telefone+'",'
               + '"email":"'+email+'",'
               + '"complemento":"'+complemento+'",'
               + '"excluido": false,'
               + '"cidadeId":'+cidadeId+','
               + '"estadoId":'+estadoId+''
               + '}';
      console.log(json);
    
      $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/cliente/"+$("#cd").val(),
          method: "PUT",
          data: json,
          success: function(result){
            $('#success').modal({show: 'true'}); 
          },
          error: function(result){
            $('#error').modal({show: 'false'})
          }
      });
    }
    
    $("#salvar").click(function() {
      salvar();
    });
    
    
    $("#estado").change(function(){
      $('#cidade').empty();
      $.ajax({
        url: "https://haskalpha-romefeller.c9users.io/cidade/estado/"+$("#estado").val(),
        method: "GET",
        success: function(cidades){
          cidades["cidade"].forEach(function(Element){
              var cidade = new Option(Element["nome"], Element["id"], true, true);
              $("#cidade").append(cidade);
          });
          var int = parseInt(cidades["cidade"][0]["id"]);
          $("#cidade").val(int);
      }});
    });
});