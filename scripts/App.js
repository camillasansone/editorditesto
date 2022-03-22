import { FileDoc } from "./FileDoc.js";
import { UserInterface } from "./UserInterface.js";
/*importa le due classi definite negli altri files*/
export class App {
  /* costruttore: i dati sono presi dal file editor.js che contengono gli id dell'html, che istanzia una nuova app e tramite il costruttore assegna i valori all'istanza di UserInterface  */
  constructor(_ui) {
    this.ui = _ui;

    /*inizializza tinymce, passando il riferimento all html tramite la proprietà dell'oggetto*/
    tinymce.init({
      selector: `#${this.ui.editor}`,
    });
    // quando nei metodi dovrò usare tinymce.get(this.ui.editor) avrò due metodi .setContent() e .getContent()
    /*assegnare le proprietà dell'oggetto riferendosi al DOM e passando la proprietà dell'oggetto UserInterface come sopra*/
    this.save = document.getElementById(`${this.ui.save}`);
    this.title = document.getElementById(`${this.ui.title}`);
    this.editor = document.getElementById(`${this.ui.editor}`);
    this.file_list = document.getElementById(`${this.ui.file}`);
    this.new = document.getElementById(`${this.ui.new}`);

    /* chiamare il metodo che fa il bind dell'evento click */
    this.getClick();

    /* chiamare il metodo che recupera i dati dal localStorage*/
    this.recoverText();
  }

  ui = new UserInterface();
  files = []; // Array in cui tengo gli oggetti dei testi
  openFile = null; // File aperto
  textId = -1; // ID dei file iniziale

  /* metodo che fa il bind sul click, attenzione all'uso di this*/
  getClick() {
    this.save.addEventListener("click", this.saveText.bind(this));
    this.new.addEventListener("click", this.newText.bind(this));
  }

  /* metodo che recupera i dati nel localStorage*/
  recoverText() {
    if (localStorage.getItem("Texts")) {
      this.files = JSON.parse(localStorage.getItem("Texts"));
      this.buildList();
    }
  }

  /* metodo che carica l'oggetto file */
  showText(listItem) {
    this.textId = listItem.target.dataset.id;
    this.openFile = new FileDoc(
      this.files[this.textId].title,
      this.files[this.textId].text
    );
    this.title.value = this.openFile.title;
    tinymce.get(this.ui.editor).setContent(this.openFile.text);
  }

  /* metodo che ripulisce */
  newText() {
    this.title.value = "";
    tinymce.get(this.ui.editor).setContent("");
    this.openFile = null;
  }

  /* altro metodo: se non ci sono file caricati crea un oggetto file e fa il push nell'array */
  /* altrimenti modifica il file assegnando i valori letti dal form*/
  saveText() {
    if (this.openFile == null && this.title.value != "") {
      let doc = new FileDoc();
      doc.title = this.title.value;
      doc.text = tinymce.get(this.ui.editor).getContent();
      this.files.push(doc);
    } else if (this.openFile != null && this.title.value != "") {
      this.openFile.title = this.title.value;
      this.openFile.text = tinymce.get(this.ui.editor).getContent();
      this.files[this.textId] = this.openFile;
    } else {
      this.files.splice(this.textId, 1); // Elimina il file in caso non ci siano presenti titoli
    }
    console.log("Testo Salvato");
    localStorage.setItem("Texts", JSON.stringify(this.files));
    this.buildList();
    this.newText();
  }
  /* salva l'array nel localStorage e chiama la funzione che stampa a video*/

  /* metodo che stampa a video */
  buildList() {
    this.file_list.innerHTML = "";
        this.files.forEach((element, index) => {
            this.file_list.innerHTML += (`<li data-id="${index}" class="list-group-item testi">${element.title}</li>`)
        });
        $(".testi").click(this.showText.bind(this));
    }
}