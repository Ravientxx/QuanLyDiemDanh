import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StudentService, AppService, CourseService,AuthService,QuizService } from '../shared/shared.module';
declare var jQuery: any;
@Component({
    selector: 'app-quiz-teacher',
    templateUrl: './quiz-teacher.component.html'
})
export class QuizTeacherComponent implements OnInit {
    public apiResult: string;
    public apiResultMessage: any;

    public courses: Array < any > = [];
    public selected_course;
    public selected_class_id;
    public quiz_list = [];

    public constructor(public authService: AuthService, public courseService: CourseService, public  appService: AppService,
    public quizService: QuizService, public  studentService: StudentService, public  router: Router) {}

    public ngOnInit() {
        this.courseService.getTeachingCourses(this.authService.current_user.id).subscribe(result=>{
            this.apiResult = result.result;
            this.apiResultMessage = result.message;
            if(this.apiResult == 'failure'){
                this.appService.showPNotify(this.apiResult,this.apiResultMessage,'error');
            }
            this.courses = result.courses;
            this.selected_course = this.courses[0];
            this.loadQuiz();
        },error=>{this.appService.showPNotify('failure',"Server Error! Can't get teaching course",'error');});
    }

    public onChangeCourse() {
        console.log(this.selected_course);
        this.loadQuiz();
    }

    public loadQuiz(){
        this.quizService.getQuizByCourseAndClass(this.selected_course['id'],this.selected_course['class_id']).subscribe(result=>{
            this.apiResult = result.result;
            this.apiResultMessage = result.message;
            if(this.apiResult == 'failure'){
                this.appService.showPNotify(this.apiResult,this.apiResultMessage,'error');
            }else{
                this.quiz_list = result.quiz_list;
                for(var i = 0 ; i < this.quiz_list.length; i++){
                    this.quiz_list[i]['isOpen'] = false;
                }
            }
        },error=>{this.appService.showPNotify('failure',"Server Error! Can't get quiz list",'error');});
    }
}
