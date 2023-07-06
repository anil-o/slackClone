import { UsersService } from './../../services/users.service';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import { ChannelService } from 'src/app/services/channel.service';
import { ChatService } from 'src/app/services/chat.service';
import { FirestoreService } from 'src/app/services/firestore.service';



@Component({
  selector: 'app-commentfield',
  templateUrl: './commentfield.component.html',
  styleUrls: ['./commentfield.component.scss']
})
export class CommentfieldComponent implements OnInit {
  @ViewChild("textEditor") textEditor: ElementRef;
  @Input() parentName: string;
  @Input() threadId: string;
  editorForm: FormGroup;
  editorContent: string;
  selectedFile: File;
  quillEditorRef: any;
  maxUploadFileSize = 1000000;

  editorStyle = {
    height: '100px'
  }

  modules = {}

  constructor(public channelService: ChannelService, public firestoreService: FirestoreService, public chatService: ChatService, public usersService: UsersService) {
    this.modules = {
      'emoji-shortname': true,
      'emoji-textarea': false,
      'emoji-toolbar': true,
      'toolbar': {
        container: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],

          // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          // [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
          // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
          // [{ 'direction': 'rtl' }],                         // text direction

          // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          // [{ 'font': [] }],
          // [{ 'align': [] }],

          // ['clean'],                                         // remove formatting button

          ['image'],                                            // image

          //['link', 'video'],                                  // link and video

          ['emoji'],
        ],
        handlers: { 'emoji': function () { } }
      }
    }
  }

  ngOnInit(): void {
    this.editorForm = new FormGroup({
      'editor': new FormControl(null)
    });
  }

  handleImageUpload(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    this.editorContent = this.editorForm.get('editor').value;
    if (this.parentName == 'channel') {
      this.channelService.addNewMessage(this.editorContent);
    } else if (this.parentName == 'chat') {
      this.chatService.sendChatMessage(this.editorContent);
    } else if (this.parentName == 'thread') {
      this.firestoreService.updateSpecificThread(this.channelService.activeThread.threadId, this.editorContent, this.currentUserId$);
      this.channelService.updateThread();
    } else if (this.parentName == 'threadshortcut') {
      this.firestoreService.updateSpecificThread(this.threadId, this.editorContent, this.currentUserId$);
    }
    // Clear the editor content
    this.editorForm.get('editor').setValue(null);
  }

  maxLength(e) {
    if (e.editor.getLength() > 1000) {
      e.editor.deleteText(1000, e.editor.getLength());
    };
  }

  get currentUserId$() {
    return this.usersService.currentUserId$;
  }

  getEditorInstance(editorInstance: any) {
    this.quillEditorRef = editorInstance;
    console.log(this.quillEditorRef);
    const toolbar = editorInstance.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler);
  }

  imageHandler = (image, callback) => {
    const input = <HTMLInputElement>document.getElementById('fileInputField');
    document.getElementById('fileInputField').onchange = () => {
      let file: File;
      file = input.files[0];
      // file type is only image.
      if (/^image\//.test(file.type)) {
        if (file.size > this.maxUploadFileSize) {
          alert('Image needs to be less than 1MB');
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            const range = this.quillEditorRef.getSelection();
            const img = '<img src="' + reader.result + '" />';
            this.quillEditorRef.clipboard.dangerouslyPasteHTML(
              range.index,
              img
            );
          };
          reader.readAsDataURL(file);
        }
      } else {
        alert('You could only upload images.');
      }
    };

    input.click();
  };
}

