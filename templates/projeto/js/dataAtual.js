function dataAtual(){
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
    
      if(dd<10) {
        dd = '0'+dd
      } 
    
      if(mm<10) {
        mm = '0'+mm
      } 
    
      return today = yyyy + '-' + mm + '-' + dd;
  }

function dataValor(data){
  var valores = data.split("-");
  let ano = parseInt(valores[0]) * 365;
  let mes = parseInt(valores[1]) * 30;
  let dia = parseInt(valores[2]);
  return (ano +mes +dia);
}

function dataCinco(){
      var today = new Date();
      var dd = today.getDate() + 5;
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
    
      if(dd<10) {
        dd = '0'+dd
      } 
    
      if(mm<10) {
        mm = '0'+mm
      } 
    
      return today = yyyy + '-' + mm + '-' + dd;
  }