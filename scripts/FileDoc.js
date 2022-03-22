export class FileDoc{
    title="";
    text="";
    constructor(_title="", _text=""){
        this.title = _title;
        this.text = _text;
    }
}
/* definizione della classe e costruttore: attenzione all'export del module per l'import nell'altro file */