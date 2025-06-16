import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@env/environment';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.css']
})
export class ArticleFormComponent {
  article = { title: '', content: '' };
  tagsInput = '';
  isEdit = false;
  selectedImage: File | null = null;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ArticleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data?.article) {
      this.isEdit = true;
      this.article = {
        title: data.article.title,
        content: data.article.content
      };
      this.tagsInput = data.article.tags.join(', ');
    }
  }

  onFileSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }
  saveArticle(): void {
    const formData = new FormData();
    formData.append('title', this.article.title);
    formData.append('content', this.article.content);
  
    const tagsArray = this.tagsInput.split(',').map(tag => tag.trim());
    tagsArray.forEach(tag => formData.append('tags[]', tag));
  
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
  
    const req = this.isEdit
      ? this.http.put(`${environment.apiUrl}/api/articles/${this.data.article._id}`, formData)
      : this.http.post(`${environment.apiUrl}/api/articles`, formData);
  
    req.subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.snackBar.open(
          this.isEdit ? '✅ Article modifié avec succès' : '✅ Article créé avec succès',
          'Fermer',
          {
            duration: 3000,
            panelClass: ['snackbar-success']
          }
        );
      },
      error: (err) => {
        const message = err.error?.error || 'Erreur lors de l\'enregistrement';
        this.snackBar.open(`❌ ${message}`, 'Fermer', {
          duration: 4000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}