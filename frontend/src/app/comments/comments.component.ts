
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-comments-dialog',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsDialogComponent implements OnInit, OnDestroy {
  comments: any[] = [];
  newComment = '';
  articleId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private socketService: SocketService
  ) {
    this.articleId = data.articleId;
  }

  ngOnInit(): void {
    this.loadComments();
    this.socketService.joinCommentsRoom(this.articleId);

    this.socketService.onNewComment((comment) => {
      console.log('🟢 Reçu via WebSocket :', comment);
    
      if (
        comment.article === this.articleId ||
        comment.article?._id === this.articleId ||
        comment.article?.toString?.() === this.articleId
      ) {
        this.comments.push(comment);
      }
    });
  }

  ngOnDestroy(): void {
    this.socketService.leaveRoom(this.articleId);
  }

  loadComments(): void {
    this.http.get<{ data: any[] }>(
      `${environment.apiUrl}/api/comments/articles/${this.data.articleId}/comments`
    ).subscribe(res => {
      this.comments = res.data;
    });
  }

  sendComment(): void {
    if (!this.newComment.trim()) return;

    this.http.post(
      `${environment.apiUrl}/api/comments/articles/${this.data.articleId}/comments`,
      { content: this.newComment }
    ).subscribe(() => {
      this.newComment = '';
    });
  }
}
