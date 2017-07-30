import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService, QuizService, AttendanceService, AuthService, SocketService, AppConfig, CheckAttendanceService } from '../../shared/shared.module';
import { LocalStorageService } from 'angular-2-local-storage';
declare var jQuery: any;
@Component({
    selector: 'check-attendance-quiz-teacher',
    templateUrl: './check-attendance-quiz-teacher.component.html'
})
export class CheckAttendanceQuizTeacherComponent implements OnInit, OnDestroy {
    public stopped_modal_message;
    public constructor(public quizService: QuizService, public location: Location, public checkAttendanceService: CheckAttendanceService,
        public appConfig: AppConfig, public socketService: SocketService,
        public authService: AuthService, public attendanceService: AttendanceService, public localStorage: LocalStorageService, public appService: AppService, public router: Router) {
        socketService.consumeEventOnQuizAnswered();
        socketService.invokeQuizAnswered.subscribe(result => {
            this.getOpeningQuiz();
        });
        socketService.consumeEventOnQuizStopped();
        socketService.invokeQuizStopped.subscribe(result => {
            if (this.quiz.id == result['quiz_id']) {
                this.stopped_modal_message = "Quiz is " + result['message'];
                jQuery('#quizStoppedModal').modal({ backdrop: 'static', keyboard: false });
            }
        });
    }
    public is_started = false;
    public apiResult;
    public apiResultMessage;
    public selected_attendance = {};
    public quizzes = [];
    public quiz_types = [];
    public selected_quiz = 0;
    public selected_quiz_type = 1;
    public quiz = {
        id: 0,
        code: '',
        is_show_question_text: true,
        is_show_one_question: true,
        is_use_timer: true,
        timer: '00:00',
        title: '',
        questions: [{
            text: '',
            option_a: '',
            option_b: '',
            option_c: '',
            option_d: '',
            correct_option: null,
            answers: []
        }]
    };
    public mask = [/\d/, /\d/, ':', /\d/, /\d/];
    public ngOnDestroy() {
        this.socketService.stopEventOnQuizAnswered();
        this.socketService.stopEventOnQuizStopped();
    }
    public getOpeningQuiz() {
        this.quizService.getOpeningQuizByCourseAndClass(this.selected_attendance['course_id'], this.selected_attendance['class_id']).subscribe(result => {
            this.apiResult = result.result;
            this.apiResultMessage = result.message;
            if (this.apiResult == 'failure') {
                this.appService.showPNotify('failure', this.apiResultMessage, 'error');
            } else {
                if (result.quiz != undefined) {
                    this.quiz = result.quiz;
                    this.is_started = true;
                    //display quiz if choose to hide question text from student
                    if(!this.quiz.is_show_question_text){
                         this.localStorage.set('displayQuizId',this.quiz.id);
                        window.open(this.appConfig.host + '/quiz/display', '_blank', 'scrollbars=yes,status=0,toolbar=0,menubar=0,location=0');
                    }
                } else {
                    this.getQuizList();
                }
            }
        }, error => { this.appService.showPNotify('failure', "Server Error! Can't get opening quiz", 'error'); });
    }
    public ngOnInit() {
        this.selected_attendance = this.localStorage.get('selected_attendance');
        this.getOpeningQuiz();
        this.quiz_types.push(this.appService.quiz_type.miscellaneous);
        this.quiz_types.push(this.appService.quiz_type.academic);
    }
    public onAddQuestion() {
        this.quiz.questions.push({
            text: '',
            option_a: '',
            option_b: '',
            option_c: '',
            option_d: '',
            correct_option: null,
            answers: []
        });
    }
    public onRemoveQuestion(index: number) {
        for (var i = index; i < this.quiz.questions.length - 1; i++) {
            this.quiz.questions[i].text = this.quiz.questions[i + 1].text;
            this.quiz.questions[i].option_a = this.quiz.questions[i + 1].option_a;
            this.quiz.questions[i].option_b = this.quiz.questions[i + 1].option_b;
            this.quiz.questions[i].option_c = this.quiz.questions[i + 1].option_c;
            this.quiz.questions[i].option_d = this.quiz.questions[i + 1].option_d;
            this.quiz.questions[i].correct_option = this.quiz.questions[i + 1].correct_option;
        }
        this.quiz.questions.pop();
    }
    public onUseTimer() {
        if (this.quiz.is_use_timer) {
            if(this.quiz.is_show_one_question){
                this.quiz.timer = '00:10';
            }else{
                this.quiz.timer = '15:00';
            }
        } else {
            this.quiz.timer = '00:00';
        }
    }
    public onStartQuiz() {
        this.quizService.startQuiz(this.selected_attendance['course_id'], this.selected_attendance['class_id'], this.quiz).subscribe(result => {
            this.apiResult = result.result;
            this.apiResultMessage = result.message;
            if (this.apiResult == 'failure') {
                this.appService.showPNotify('failure', this.apiResultMessage, 'error');
            } else {
                this.quiz.id = result.quiz_id;
                // if(this.quiz.is_use_timer){
                //     var temp = this.quiz.timer.split(':');
                //     var time_left = (+temp[0]*60 + (+temp[1]));
                //     var interval = setInterval(() => {
                //         var second = Math.floor(time_left % 60);
                //         var minute = Math.floor(time_left / 60);
                //         if (second == 0 && minute == 0) {
                //             clearInterval(interval);
                //             this.stopQuiz();
                //         }
                //         this.quiz.timer = (minute > 9 ? minute : '0' + minute) + ':' + (second > 9 ? second : '0' + second);
                //         time_left--;
                //     }, 1000);
                // }
                this.is_started = true;
                //display quiz if choose to hide question text from student
                if(!this.quiz.is_show_question_text){
                    this.localStorage.set('displayQuizId',this.quiz.id);
                    window.open(this.appConfig.host + '/quiz/display', '_blank', 'scrollbars=yes,status=0,toolbar=0,menubar=0,location=0');
                }
            }
        }, error => { this.appService.showPNotify('failure', "Server Error! Can't start quiz", 'error'); });
    }
    public onStopQuiz() {
        jQuery('#confirmStopQuizModal').modal('show');
    }
    public stopQuiz() {
        this.quizService.stopQuiz(this.quiz.id).subscribe(result => {
            this.apiResult = result.result;
            this.apiResultMessage = result.message;
            if (this.apiResult == 'failure') {
                this.appService.showPNotify('failure', this.apiResultMessage, 'error');
            } else {
                this.is_started = false;
                this.socketService.emitEventOnQuizStopped({ quiz_id: this.quiz.id, message: ' stopped by ' + this.authService.current_user.first_name + ' ' + this.authService.current_user.last_name });
                this.router.navigate(['/check-attendance']);
            }
        }, error => { this.appService.showPNotify('failure', "Server Error! Can't stop quiz", 'error'); });
    }
    public onBack() {
        this.location.back();
    }
    public onChangeQuiz(){
        for(var i = 0 ; i < this.quizzes.length; i++){
            if(this.selected_quiz == this.quizzes[i].id){
                this.quiz.questions = [];
                this.quiz.id = this.quizzes[i].id;
                this.quiz.title = this.quizzes[i].title;
                this.quiz.code = this.quizzes[i].code;
                for(var j = 0; j < this.quizzes[i].questions.length; j++){
                    this.quiz.questions.push({
                        text : this.quizzes[i].questions[j].text,
                        option_a : this.quizzes[i].questions[j].option_a,
                        option_b : this.quizzes[i].questions[j].option_b,
                        option_c : this.quizzes[i].questions[j].option_c,
                        option_d : this.quizzes[i].questions[j].option_d,
                        correct_option : this.quizzes[i].questions[j].correct_option,
                        answers: []
                    });
                }
                return;
            }
        }
    }
    public onChangeQuizType(){

    }
    public getQuizList(){
        this.quizService.getQuizByCourseAndClass(this.selected_attendance['course_id'], this.selected_attendance['class_id']).subscribe(result=>{
            this.apiResult = result.result;
            this.apiResultMessage = result.message;
            if(this.apiResult == 'failure'){
                this.appService.showPNotify(this.apiResult,this.apiResultMessage,'error');
            }else{
                this.quizzes = result.quiz_list;
                this.quizzes.unshift({
                    id: 0,
                    code: result.quiz_code,
                    is_use_timer: true,
                    timer: '15:00',
                    title: 'New quiz',
                    questions: [{
                        text: '',
                        option_a: '',
                        option_b: '',
                        option_c: '',
                        option_d: '',
                        correct_option: null,
                        answers: []
                    }]
                });
                this.selected_quiz = this.quizzes[0].id;
                this.onChangeQuiz();
            }
        },error=>{this.appService.showPNotify('failure',"Server Error! Can't get quiz list",'error');});
    }
}
