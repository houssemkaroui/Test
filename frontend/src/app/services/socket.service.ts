

import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiUrl);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }


  joinArticleRoom(articleId: string) {
    this.socket.emit('joinArticleRoom', articleId);
  }

  sendComment(data: {
    articleId: string,
    content: string,
    userId: string,
    parentCommentId?: string
  }) {
    this.socket.emit('createComment', data);
  }

  onCommentAdded(callback: (comment: any) => void) {
    this.socket.on('commentAdded', callback);
  }

  onCommentError(callback: (err: any) => void) {
    this.socket.on('commentError', callback);
  }

  onNotifyComment(callback: (data: any) => void) {
    this.socket.on('notifyComment', callback);
  }

  likeArticle(data: { articleId: string, userId: string }) {
    this.socket.emit('likeArticle', data);
  }

  onArticleLiked(callback: (data: { likes: string[], likesCount: number }) => void) {
    this.socket.on('articleLiked', callback);
  }


  joinArticlesRoom() {
    this.socket.emit('joinArticlesRoom');
  }

  onNewArticle(callback: (article: any) => void) {
    this.socket.on('newArticle', callback);
  }

  onArticleUpdated(callback: (article: any) => void) {
    this.socket.on('articleUpdated', callback);
  }

  onArticleDeleted(callback: (id: string) => void) {
    this.socket.on('articleDeleted', callback);
  }
  leaveRoom(room: string) {
    this.socket.emit('leaveRoom', room);
  }
  
  onNewComment(callback: (comment: any) => void) {
    this.socket.on('newComment', (comment) => {
      console.log('📥 SocketService a reçu newComment:', comment);
      callback(comment);
    });
  }
  joinCommentsRoom(articleId: string) {
    this.socket.emit('joinArticleRoom', articleId);
  }
}
