import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'week-calendar',
  templateUrl: './week-calendar.component.html',
  styleUrls: ['./week-calendar.component.css']
})
export class WeekCalendarComponent implements OnInit {
  @ViewChild('div') divEl!: ElementRef

  @Output() sentCurrDate = new EventEmitter

  iconLeft = faCaretLeft
  iconRight = faCaretRight

  d = new Date()
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  currYear = this.d.getFullYear()
  currMonthIndex = this.d.getMonth()
  currMonth = this.months[this.currMonthIndex];
  currDay = this.d.getDate()
  currDayWeek = this.weekdays[this.d.getDay()]

  startWeek = this.currDay - this.d.getDay()
  dates = new Array(this.weekdays.length).fill(0)
  selectedEl!: any
  daysForMonth!: number
  pressedNext!: boolean
  disable = true
  matchDate = true

  ngOnInit(): void {
    this.daysForMonth = this.getdaysFromMouths(this.currMonthIndex)
    for (let i = 0; i < this.weekdays.length; i++) {
      this.dates[i] = this.startWeek
      this.startWeek++
      if (this.startWeek > this.daysForMonth) {
        this.changeMonth()
        this.startWeek = 1
      }
    }
  }

  selected(e: any) {
    if (this.currYear < this.d.getFullYear() ||
      this.currMonthIndex < this.d.getMonth() ||
      this.currMonthIndex == this.d.getMonth() &&
      e.target.textContent <= this.currDay) {
      return
    }

    if (this.selectedEl) {
      this.selectedEl.classList.remove('selected')
    }
    e.target.parentElement.classList.add('selected')
    this.selectedEl = e.target.parentElement
    this.sentCurrDate.emit(e.target.textContent)
  }

  changeMonth() {
    this.pressedNext ? this.currMonthIndex++ : this.currMonthIndex--
    if (this.currMonthIndex < 0) {
      this.currMonthIndex = 11
      this.currYear--
    }
    if (this.currMonthIndex > 11) {
      this.currYear++
    }
    this.daysForMonth = this.getdaysFromMouths(this.currMonthIndex)
    this.currMonth = this.months[this.currMonthIndex % this.months.length]
  }

  next() {
    this.matchDate = false
    this.pressedNext = true
    this.forward()
  }

  previous() {
    if (this.matchDate && this.checkCurrDate()) {
      return
    }

    this.matchDate = false
    this.pressedNext = false
    this.backward()
  }

  forward() {
    this.startWeek = this.dates[this.dates.length - 1] + 1
    for (let i = 0; i < this.weekdays.length; i++) {
      this.dates[i] = this.startWeek
      if (this.startWeek == this.currDay) {
        this.matchDate = true
      }
      this.startWeek++
      if (this.startWeek > this.daysForMonth) {
        this.changeMonth()
        this.startWeek = 1
      }
    }
  }

  backward() {
    this.startWeek = this.dates[0] - 1
    for (let i = this.weekdays.length - 1; i >= 0; i--) {
      this.dates[i] = this.startWeek
      if (this.startWeek == this.currDay) {
        this.matchDate = true
      }
      this.startWeek--
      if (this.startWeek < 1) {
        this.changeMonth()
        this.startWeek = this.daysForMonth
      }
    }
  }

  checkCurrDate() {
    return this.currMonth == this.months[this.d.getMonth()] &&
           this.currYear == this.d.getFullYear()
  }

  getdaysFromMouths(month: any) {
    let daysFromMouths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    return daysFromMouths[month]
  }
}
