import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from "@angular/router";
import {MenuCard} from "../../../types/Menu/MenuCard";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {


  @Input() card!: MenuCard;
  @Output() navigateEmitter:EventEmitter<String> = new EventEmitter<String>();

  navigate(card: any) {
    console.log(card.navigate)
    this.navigateEmitter.emit(card.navigate);
  }
}
