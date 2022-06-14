function loadRepos() {
   const baseUrl = 'https://api.github.com/users/testnakov/repos';

   let xmlHttpRequest = new XMLHttpRequest();
   xmlHttpRequest.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
         let resultDivElement = document.getElementById('res');
         resultDivElement.textContent = this.responseText;
      }
   }

   xmlHttpRequest.open('GET', baseUrl);
   xmlHttpRequest.send();
}