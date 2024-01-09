import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonContent, InfiniteScrollCustomEvent, IonList, IonItem, IonAvatar, IonSkeletonText, IonAlert, IonLabel, IonBadge, IonInfiniteScroll, IonInfiniteScrollContent, IonCardHeader } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { MovieResult } from '../interfaces';
import { MovieService } from '../services/movie.service';
import { catchError, finalize } from 'rxjs';

@Component({
  selector: 'app-home-defer',
  templateUrl: './home-defer.page.html',
  styleUrls: ['./home-defer.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonSkeletonText, IonAlert, IonLabel, DatePipe, RouterModule, IonBadge, IonInfiniteScroll, IonInfiniteScrollContent]
})
export class HomeDeferPage {

  private movieService = inject(MovieService);
  private currentPage = 1;
  public error = null;
  public isLoading = false;
  public movies: MovieResult[] = [];
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public dummyArray = new Array(5);

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
        // console.log(result);
        this.movies.push(...result.results);
        if (event) {
          event.target.disabled = result.total_pages === this.currentPage;
        }
      }


    })
  }

  loadMoreMovies(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
  }



}
