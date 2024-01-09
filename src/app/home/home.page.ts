import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, InfiniteScrollCustomEvent } from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { catchError, finalize } from 'rxjs';
import { MovieResult } from '../interfaces';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {

  private movieService = inject(MovieService);
  private currentPage = 1;
  private error = null;
  private isLoading = false;
  private movies: MovieResult[] = [];
  public imageBaseUrl = 'https://image.tmdb.org/t/p';

  constructor() {
    this.loadMovies();
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    if (!event) {
      this.isLoading = true;
    }

    this.movieService.getTopRatedMovies(this.currentPage).pipe(
      finalize(() => {
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      }),
      catchError((err: any) => {
        console.log(err)
        this.error = err.error.status_message;
        return [];
      })
    ).subscribe({
      next: (result) => {
        console.log(result);
        this.movies.push(...result.results);
        if (event) {
          event.target.disabled = result.total_pages === this.currentPage;
        }
      }


    })
  }

  loadMoreMovies(event: InfiniteScrollCustomEvent) {

  }


}
