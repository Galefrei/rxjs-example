import {Component} from '@angular/core';
import {from, merge, Observable, Subject} from 'rxjs';
import {map, scan} from 'rxjs/operators';

type TaskUpdate = (tasks: string[]) => string[];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rxjs-example';
  taskText: string;

  addTask$: Subject<string> = new Subject<string>();
  removeTask$: Subject<string> = new Subject<string>();
  taskList$: Observable<string[]>;

  constructor() {
    const initialTasks$: Observable<TaskUpdate> = from([['Написать пример работы с RxJs в стиле реактивного программирования']]).pipe(
      map((initialTasks: string[]) => () => initialTasks)
    );

    const addTaskObs$: Observable<TaskUpdate> = this.addTask$.pipe(
      map((newTask: string) => (oldTasks: string[]) => [...oldTasks, newTask])
    );

    const removeTaskObs$: Observable<TaskUpdate> = this.removeTask$.pipe(
      map((removedTask: string) => (oldTasks: string[]) => oldTasks.filter(t => t !== removedTask))
    );

    this.taskList$ = merge(initialTasks$, addTaskObs$, removeTaskObs$).pipe(
      scan((tasks, taskUpdate) => taskUpdate(tasks), [])
    );
  }

  addTask(): void {
    this.addTask$.next(this.taskText);
  }

  removeTask(task: string): void {
    this.removeTask$.next(task);
  }
}
