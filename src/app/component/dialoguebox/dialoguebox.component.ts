import { Component, EventEmitter, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-dialoguebox',
  standalone: true,
  imports: [],
  templateUrl: './dialoguebox.component.html',
  styleUrls: ['./dialoguebox.component.css']
})
export class DialogueboxComponent {
  @Output() response = new EventEmitter<boolean>();
  
  // Emits the user's response (true for Yes, false for No)
  handleResponse(answer: boolean) {
    this.response.emit(answer);
  }

  // Close the dialogue box when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const box = document.querySelector('.box');
    const target = event.target as HTMLElement;
    if (box && !box.contains(target)) {
      this.closeDialog();
    }
  }

  // Handle the closing of the dialogue box
  closeDialog() {
    this.response.emit(false); // or any value to indicate that the dialog was closed
  }
}
