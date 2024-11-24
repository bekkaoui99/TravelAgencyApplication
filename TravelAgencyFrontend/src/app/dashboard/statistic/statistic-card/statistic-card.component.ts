import {Component, Input} from '@angular/core';
import {Statistic} from "../../../types/Statistic/Statistic";

@Component({
  selector: 'app-statistic-card',
  templateUrl: './statistic-card.component.html',
  styleUrls: ['./statistic-card.component.css']
})
export class StatisticCardComponent {
  @Input() card!: any;
}
