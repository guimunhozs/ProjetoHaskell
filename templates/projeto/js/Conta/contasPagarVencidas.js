$(document).ready(function() {
    var table = $('#example1').DataTable();
    
    var promisse1 = $.ajax("https://haskalpha-romefeller.c9users.io/fornecedor").promise();
    var promisse2 = $.ajax("https://haskalpha-romefeller.c9users.io/contasPagar").promise();
    
    Promise.all([promisse1,promisse2]).then(function(arr){
        var fornecedores = arr[0].result
        fornecedores = fornecedores.map(function(fornecedor){return fornecedor[0]});
        console.log("fornecedores map ", fornecedores);
        var contasPagar = arr[1].Conta;
        contasPagar.forEach(function(Element){
        console.log("fornecedor id ", Element.fornecedorId);
            Element.fornecedor = fornecedores.filter(function(fornecedor){
                return fornecedor.id == Element.fornecedorId
            })[0];
            
            if ((dataValor(Element.dataVencimento) < dataValor(dataAtual())) && (Element.icPago == false)){
                table.row.add([
                    Element.id,    
                    Element.codigo,
                    Element.valor.toFixed(2),
                    Element.fornecedor.nome,
                    Element.dataVencimento,
                    "<div class='organiza'><i id='e"+Element.id +"' class='fa fa-window-close btnX'></i><i id='a"+Element.id+"' class='fa fa-pencil-square btnE'></i></div>"
                ]).draw(false).nodes().to$().attr("id","eq"+Element.id);
            }
        });
        
    });
    
    $(document).on('click', '.btnE', function(){
        var id = this.id;
        id = id.split("a");
        localStorage.setItem('contaId', id[1]);
        localStorage.setItem('tipoConta', "pagar");
        window.location="../Conta/editarConta.html"; 
    });
    
    $(document).on('click', '.btnX', function(){
        var table = $('#example1').DataTable();
        var id = this.id;
        id = id.split("e");
        table.row("#eq"+id[1]).remove().draw();
        $.ajax({
          url: "https://haskalpha-romefeller.c9users.io/conta/"+id[1],
          method: "DELETE"
        });
    });
});