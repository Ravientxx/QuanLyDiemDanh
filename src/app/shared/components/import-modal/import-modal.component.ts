import { Component, OnInit, Input, Output , EventEmitter} from '@angular/core';
import { FileUploader } from "ng2-file-upload/ng2-file-upload";
declare var jQuery: any;

@Component({
  selector: 'import-modal',
  templateUrl: './import-modal.component.html',
})
export class ImportModalComponent implements OnInit {
	@Input() modal_title : string;


    constructor() { }
    ngOnInit() {
        this.import_progress = 0;
    }

    import_list = [];
    uploader: FileUploader = new FileUploader({ url: '' });
    import_progress = 0;
    isImporting = false;
    onSelectFile(files : any){

        var file_list = Array.prototype.slice.call(files);
        for(var i = 0 ; i < file_list.length; i++){
            var _import = {
                file : file_list[i],
                result : ''
            }
            this.import_list.push(_import);
        }
    }
    onRemoveFile(index : number){
        for(var i = index;i < this.import_list.length-1; i++){
            this.import_list[i].file = this.import_list[i+1].file;
            this.import_list[i].result = this.import_list[i+1].result;
        }
        this.import_list.pop();
    }
    onRemoveAllFile(i : number){
        this.import_list = [];
    }
    onCancelImport(){

        jQuery("#importModal").modal("hide");
    }
    onImport(){
        this.import_progress = 0;
        this.isImporting = true;
        for(var i = 0 ; i < this.import_list.length; i++){
            setTimeout(() => {
                this.import_progress += 100 / this.import_list.length;
            },2000);
        }
    }
    onStopImport(){
        this.isImporting = false;
    }
    public onOpenModal() {
        jQuery("#importModal").modal("show");
    }
}