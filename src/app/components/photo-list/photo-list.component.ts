import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Photo } from '../../models/photo';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PhotoListComponent implements OnInit {
  photos: Photo[] = [];
  newPhoto: Photo = new Photo(0, 0, '', '', '');
  selectedPhoto: Photo | null = null;
  showModal = false;

  constructor(private photoService: PhotoService) { }

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos(): void {
    this.photoService.getPhotos().subscribe({
      next: (photos) => {
        this.photos = photos.slice(0, 10);
      },
      error: (error) => {
        console.error('Error loading photos:', error);
      }
    });
  }

  addPhoto(): void {
    if (this.newPhoto.title && this.newPhoto.url) {
      const tempId = this.photos.length > 0 ? Math.max(...this.photos.map(p => p.id)) + 1 : 1;
      const photoToAdd = new Photo(
        this.newPhoto.albumId,
        tempId,
        this.newPhoto.title,
        this.newPhoto.url,
        this.newPhoto.thumbnailUrl || this.newPhoto.url
      );

      this.photoService.addPhoto(photoToAdd).subscribe({
        next: (photo) => {
          this.photos.unshift(photo);
          this.resetForm();
        },
        error: (error) => {
          console.error('Error adding photo:', error);
          this.photos.unshift(photoToAdd);
          this.resetForm();
        }
      });
    }
  }

  openEditModal(photo: Photo): void {
    this.selectedPhoto = { ...photo };
    this.showModal = true;
  }

  updatePhoto(): void {
    if (this.selectedPhoto) {
      this.photoService.updatePhoto(this.selectedPhoto).subscribe({
        next: (photo) => {
          const index = this.photos.findIndex(p => p.id === photo.id);
          if (index !== -1) {
            this.photos[index] = photo;
          }
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating photo:', error);
          const index = this.photos.findIndex(p => p.id === this.selectedPhoto!.id);
          if (index !== -1) {
            this.photos[index] = this.selectedPhoto!;
          }
          this.closeModal();
        }
      });
    }
  }

  deletePhoto(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
      this.photoService.deletePhoto(id).subscribe({
        next: () => {
          this.photos = this.photos.filter(photo => photo.id !== id);
        },
        error: (error) => {
          console.error('Error deleting photo:', error);
          this.photos = this.photos.filter(photo => photo.id !== id);
        }
      });
    }
  }

  resetForm(): void {
    this.newPhoto = new Photo(0, 0, '', '', '');
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPhoto = null;
  }
}