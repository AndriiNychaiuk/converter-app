import { Component, OnInit } from '@angular/core';
import { Currency } from '../models/Currency';
import { CurrencyRateApiService } from '../services/currency-rate.api.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  rates: Currency[] = [];

  firstValue = 1;
  firstCurrencyRate = 1;
  firstCode = 'UAH'

  secondValue = 1;
  secondCurrencyRate = 1;
  secondCode = 'UAH'

  finalRate = 1;

  setSuitableValue(
    initialValue: number,
    rate: number): number {
    const fullValue = String(initialValue * rate);

    if (+fullValue >= 1) {
      return Math.round(+fullValue * 100) / 100;
    }

    let decimal = 0
    let suitableValue = '';

    for (let i = 0; i < fullValue.length; i++) {
      suitableValue += fullValue[i];

      if (decimal === 1 && +fullValue[i] !== 0) {
        suitableValue += fullValue[i + 1]
        break;
      }

      if (fullValue[i] === '.') {
        decimal = 1;
      }
    }

    return +suitableValue;
  }

  setAscRate() {
    this.finalRate = this.firstCurrencyRate / this.secondCurrencyRate;
    this.secondValue = this.setSuitableValue(this.firstValue, this.finalRate);
  }

  setDescRate() {
    this.finalRate = this.secondCurrencyRate / this.firstCurrencyRate;
    this.firstValue = this.setSuitableValue(this.secondValue, this.finalRate);
  }

  onFirstSelect(event: Event) {
    const selectorValue = (event.target as HTMLSelectElement).value;

    this.firstCurrencyRate = this.rates.find(currency => currency.cc === selectorValue)?.rate || 1;
    this.setAscRate();
  }

  onSecondSelect(event: Event) {
    const selectorValue = (event.target as HTMLSelectElement).value;

    this.secondCurrencyRate = this.rates.find(currency => currency.cc === selectorValue)?.rate || 1;
    this.setDescRate();
  }

  onFirstInputChange(event: Event) {
    this.firstValue = Number((event.target as HTMLInputElement).value);
    this.setAscRate();
  }

  onSecondInputChange(event: Event) {
    this.secondValue = Number((event.target as HTMLInputElement).value);
    this.setDescRate();
  }

  constructor(private currencyService: CurrencyRateApiService) { }

  ngOnInit(): void {
    this.currencyService.getBasicCurrency().subscribe(allRates => {
      this.rates = allRates.sort((a, b) => a.txt.localeCompare(b.txt));
    })
  }
}
