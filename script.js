
document.addEventListener("DOMContentLoaded", function () {
  //HAETAAN TARVITTAVAT ELEMENTIT JA TALLENNETAAN NE MUUTTUJIIN
    const teatteriValinta = document.getElementById("teatteri");
    const haeElokuvatNappi = document.getElementById("haeElokuvat");
    const leffat = document.getElementById("leffat");
  
  // Haetaan leffateatterit XML muodossa käyttäen finnkinon tarjoamaa APIA
  fetch('https://www.finnkino.fi/xml/TheatreAreas/')
  .then(vastaus => vastaus.text()) // MUUTETAAN VASTAUS TEKSIMUOTOON
  .then(data => {
    const parseri = new DOMParser(); // LUODAAN XML PARSER
    const xmlDoc = parseri.parseFromString(data, 'text/xml'); //MUUTETAAN SAATU TEKTSI XML:LÄKSI
    const teatteriVaihtoehdot = xmlDoc.getElementsByTagName("TheatreArea"); //HAETAAN "THEATREAREA" EKEMENTITI

    for (let i = 0; i < teatteriVaihtoehdot.length; i++) { //LUODAAN VAIHTOEHDOT JA LISÄTÄÄN NE TEATTERIVALINTAAN
      const vaihtoehto = document.createElement("option"); 
      vaihtoehto.value = teatteriVaihtoehdot[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue; //ASETETAAN VAIHTOEHDON ARVO JA TEKSTI
      vaihtoehto.text = teatteriVaihtoehdot[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
      teatteriValinta.add(vaihtoehto); //LISÄTÄÄN VAIHTOEHTO
    }
  })
  
    // KUUNNELLAAN NAPIN KLIKKAUSTA 
    haeElokuvatNappi.addEventListener("click", function () {
      const valittuTeatteriId = teatteriValinta.value; // HAETAAN TEATTERIN ID VALINTA ELEMENTISTÄ
  
      // HAETAAN VALITUN TEATTERIN ELOKUVAT OSOITTEESTA
      fetch(`https://www.finnkino.fi/xml/Schedule/?area=${valittuTeatteriId}`)
        .then(vastaus => vastaus.text())
        .then(data => {
          // KÄSITELLÄÄN ELOKUVATIETOJA JA LISÄTÄÄN NE LEFFAT DIVIIN
          leffat.innerHTML = ''; // TYHJENNETÄÄN AIEMMAT TIEDOT
  
          const parseri = new DOMParser();
          const xmlDoc = parseri.parseFromString(data, 'text/xml');
          const elokuvat = xmlDoc.getElementsByTagName("Show");
  
          // KÄYDÄÄN LÄPI JOKAINEN LEFFA JA LISÄTÄÄN NE KORTTEINA NÄYTÖLLE (TÄSSÄ KÄYTETTY APUNA CHAT GPT)
          for (let i = 0; i < elokuvat.length; i++) {
            //HAETAAN ELOKUVATIEDOT
            const elokuvanNimi = elokuvat[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue;
            const elokuvanAloitusAika = elokuvat[i].getElementsByTagName("dttmShowStart")[0].childNodes[0].nodeValue;
            const elokuvanKuvaURL = elokuvat[i].getElementsByTagName("EventLargeImagePortrait")[0].childNodes[0].nodeValue;
            //LUODAAN KORTTI JA LISÄTÄÄN SIIHEN LEFFATIEDOT (TÄSSÄ KÄYTETTY APUNA CHAT GPT)
            const elokuvanKortti = document.createElement("div"); //
            elokuvanKortti.classList.add("col-md-4", "mb-4");
      
            const korttiElementti = `
              <div class="card">
                <img src="${elokuvanKuvaURL}" class="card-img-top" alt="${elokuvanNimi}">
                <div class="card-body">
                  <h5 class="card-title">${elokuvanNimi}</h5>
                  <p class="card-text">Aika: ${elokuvanAloitusAika}</p>
                </div>
              </div>
            `;

            //LISÄTÄÄN LUOTU KORTTI 
            elokuvanKortti.innerHTML = korttiElementti;
            leffat.appendChild(elokuvanKortti);
          }
        })
    });
  });
  