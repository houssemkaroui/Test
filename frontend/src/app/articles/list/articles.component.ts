import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ArticleFormComponent } from '../form/article-form.component';
import { SocketService } from '../../services/socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { CommentsDialogComponent } from '../../comments/comments.component';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['title', 'author', 'createdAt', 'comments', 'actions'];
  articles: any[] = [];
  unreadCommentsCount: { [articleId: string]: number } = {};

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private socketService: SocketService,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadArticles();
    this.setupSocketListeners();
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  setupSocketListeners(): void {
    this.socketService.onNewArticle((article) => {
      this.articles = [article, ...this.articles];
    });

    this.socketService.onArticleUpdated((updatedArticle) => {
      this.articles = this.articles.map(article =>
        article._id === updatedArticle._id ? updatedArticle : article
      );
    });

    this.socketService.onArticleDeleted((id) => {
      this.articles = this.articles.filter(article => article._id !== id);
    });

    this.socketService.onNewComment((comment) => {
      const articleId = comment.article || comment.articleId;
      if (!this.unreadCommentsCount[articleId]) {
        this.unreadCommentsCount[articleId] = 0;
      }
      this.unreadCommentsCount[articleId]++;
    });
  }

  getUnreadCount(articleId: string): number {
    return this.unreadCommentsCount[articleId] || 0;
  }

  loadArticles(): void {
    this.http.get<{ data: any[] }>(`${environment.apiUrl}/api/articles`)
      .subscribe(res => this.articles = res.data);
  }

  deleteArticle(id: string): void {
    this.http.delete(`${environment.apiUrl}/api/articles/${id}`).subscribe({
      next: () => {
        this.loadArticles();
        this.snackBar.open('🗑️ Article supprimé avec succès', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      },
      error: (err) => {
        const message = err.error?.error || 'Erreur inconnue';
        this.snackBar.open(`❌ ${message}`, 'Fermer', {
          duration: 4000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(ArticleFormComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  openEditModal(article: any): void {
    const dialogRef = this.dialog.open(ArticleFormComponent, {
      width: '600px',
      data: { article }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  openCommentsModal(article: any): void {
    this.unreadCommentsCount[article._id] = 0;

    this.dialog.open(CommentsDialogComponent, {
      width: '600px',
      data: { articleId: article._id }
    });
  }

  logout(): void {
    this.authService.logout();
    this.snackBar.open('👋 Déconnecté', 'Fermer', {
      duration: 2000,
      panelClass: ['snackbar-success']
    });
    this.router.navigate(['/login']);
  }
}
