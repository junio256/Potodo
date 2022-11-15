import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {IItem} from "../../../shared/interfaces/IItem";
import {TimerService} from "../../timer.service";
import {IDeactivate} from "../../../shared/interfaces/IDeactivate";

@Component({
    selector: 'pomodoro',
    templateUrl: './pomodoro.component.html',
    styleUrls: ['./pomodoro.component.scss']
})

export class PomodoroComponent implements OnInit, IDeactivate {

    sub: Subscription;
    item!: IItem;

    interval: any;
    isActive: boolean = false;
    started: boolean = false;

    percentage: number = 100;

    sec: number = 0;
    minutes: string = "00";
    extraSeconds: string = "00";

    initial_timer = 0.25;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private service: TimerService
    ) {
        this.sub = this.route.data.subscribe(
            ({tasks}) => {
                this.item = tasks;
            }
        );
    }

    ngOnInit(): void {
    }

    canDeactivate(): boolean {
        const redirectBack = (): boolean => {
            this.isActive = true;
            this.router.navigate([`/timer/${this.item.id}`]).then(r => r);
            return false;
        };


        if (this.isActive) {
            if (confirm("O seu pomodoro esta rolando, sair da página irá pausa-lo<br>Tem certeza que deseja sair?")) {
                this.pauseTimer();
                this.resetTimer();
                return true;
            }
            redirectBack();
        }

        if (!this.isActive && this.started) {
            if (confirm("O seu pomodoro já foi iniciado, mudar de ítem irá resetar o pomodoro. Tem certeza?")) {
                this.resetTimer();
                return true;
            }
            redirectBack();
        }

        return true;
    }

    updatePercentage(percentage?: number): void {
        if (percentage) {
            this.percentage = percentage;
        }
        document.documentElement.style.setProperty('--percentage', this.percentage.toString());
    }

    calcPercentage(total: number, spent: number): number {
        const percentage = ((total - spent) / total) * 100;
        this.updatePercentage(percentage);
        return percentage;
    }

    updateItem() {
        this.service.updateItem(this.item);
    }

    updateTimer(): void {
        let minutes = Math.floor(this.sec / 60);
        let extraSeconds = this.sec % 60;
        this.minutes = (minutes < 10 ? "0" + minutes : minutes).toString();
        this.extraSeconds = (extraSeconds < 10 ? "0" + extraSeconds : extraSeconds).toString();
    }

    resetTimer(): void {
        this.sec = 0;
        this.updateTimer();
        this.updatePercentage(100);
        this.isActive = false;
        this.started = false;
    }

    pauseTimer(): void {
        clearInterval(this.interval);
        this.isActive = false;
    }

    stopTimer() {
        this.pauseTimer();
        this.resetTimer();
    }

    startTimer(): void {
        this.isActive = true;
        this.started = true;
        this.updatePercentage(0);

        const total_time = (this.initial_timer * 60) + 1;
        if (this.sec === 0) this.sec = total_time;

        this.interval = setInterval(() => {
            this.sec--;

            this.percentage = this.calcPercentage(total_time, this.sec);
            this.updateTimer();

            // When times ends, shouts an alert
            if (this.percentage === 100) {
                this.isActive = false;
                this.item.complete = true;
                clearInterval(this.interval);
                this.updateItem();
                this.resetTimer();
                this.pauseTimer();
                this.updatePercentage(100);
                setTimeout(() => {
                    alert("🚨 It is Cool 😎. I wish you could share ");
                }, 1000);
            }
        }, 1000);
    }


    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}