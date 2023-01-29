import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { calcMD5 } from '../util';

@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.css']
})
export class UpdateComponent {
    @ViewChild('upFile') upFile: ElementRef | undefined;
    @ViewChild('modalMD5Confirm') modalMD5Confirm: ElementRef | undefined;
    @ViewChild('modalMD5OK') modalMD5OK: ElementRef | undefined;

    public upName: string = 'firmware.bin';
    public uploadProgress: number = 0;
    public uriProgress: number | null = 0;
    public locked: boolean = false;
    public md5value: string = '';

    constructor(private apiService: ApiService) { }

    public updateUploadName() {
        if (this.upFile!.nativeElement.files.length > 0)
            this.upName = this.upFile!.nativeElement.files[0].name;
    }

    private openModal() {
        this.modalMD5Confirm!.nativeElement.classList.add('is-active');
    }

    private closeModal() {
        this.modalMD5Confirm!.nativeElement.classList.remove('is-active');
    }

    public resetForms() {
        this.locked = false;
        this.uriProgress = 0;
        this.uploadProgress = 0;
        this.closeModal();
    }

    private lockForms() {
        this.locked = true;
    }

    private finalize(xhr: XMLHttpRequest) {
        if (xhr.status == 200)
            alert("Firmware updated.");
        else
            alert("Error " + xhr.status + ": " + xhr.responseText);
        this.resetForms();
    }

    public submitFile(event: Event) {
        event.preventDefault();
        var data = new FormData(event.target as HTMLFormElement);
        this.lockForms();
        var reader = new FileReader();
        var that = this;
        reader.onload = evt => {
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable)
                    this.uploadProgress = evt.loaded / evt.total;
            }, false);
            xhr.onload = that.finalize.bind(that, xhr);
            xhr.open('POST', this.apiService.makePath('/api/ota/passive'), true);
            that.apiService.authenticateXhr(xhr);
            xhr.setRequestHeader('x-UpdateHash', calcMD5(evt.target!.result));
            xhr.send(data);
        }
        reader.readAsBinaryString(data.get('upload') as Blob);
    }

    public submitURI(event: Event) {
        event.preventDefault();
        var data = new FormData(event.target as HTMLFormElement);
        var uri = data.get('uri') as string;
        this.uriProgress = null; // Set it to indeterminante
    
        // Download the firmware to the browser to calculate the MD5 from it.
        var firmwareXhr = new window.XMLHttpRequest();
        // Workaround to get the binary data directly as string: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data#receiving_binary_data_in_older_browsers
        firmwareXhr.overrideMimeType('text\/plain; charset=x-user-defined');
        var that = this;
        firmwareXhr.onload = function () {
            if (this.status == 200) {
                that.lockForms();
                const checksum = calcMD5(this.response);
                that.md5value = checksum;
                that.modalMD5OK!.nativeElement.onclick = () => {
                    that.closeModal();
                    var xhr = new window.XMLHttpRequest();
                    xhr.onload = that.finalize.bind(that, xhr);
                    xhr.open('POST', that.apiService.makePath('/api/ota/active'), true);
                    that.apiService.authenticateXhr(xhr);
                    xhr.send(checksum + ';' + uri);
                };
                that.openModal();
            } else
                alert("Error " + this.status + ": " + this.responseText);
        };
        firmwareXhr.open('GET', uri, true);
        firmwareXhr.send(null);
    }
}
