import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Photo } from '../../models/photo';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-photo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss']
})
export class PhotoListComponent implements OnInit {
  photos: Photo[] = [];
  newPhoto: Photo = new Photo(1, 0, '', '', '');
  selectedPhoto: Photo | null = null;

  constructor(private photoService: PhotoService) { }

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos(): void {
    this.photoService.getPhotos().subscribe(photos => {
      this.photos = photos.slice(0, 10);
    });
  }

  addPhoto(): void {
    this.photoService.createPhoto(this.newPhoto).subscribe(photo => {
      this.photos.unshift(photo);
      this.resetNewPhoto();
    });
  }

  updatePhoto(): void {
    if (this.selectedPhoto) {
      this.photoService.updatePhoto(this.selectedPhoto).subscribe(updatedPhoto => {
        const index = this.photos.findIndex(p => p.id === updatedPhoto.id);
        if (index !== -1) {
          this.photos[index] = updatedPhoto;
        }
        this.selectedPhoto = null;
      });
    }
  }

  deletePhoto(id: number): void {
    this.photoService.deletePhoto(id).subscribe(() => {
      this.photos = this.photos.filter(photo => photo.id !== id);
    });
  }

  selectPhotoForEdit(photo: Photo): void {
    this.selectedPhoto = new Photo(
      photo.albumId,
      photo.id,
      photo.title,
      photo.url,
      photo.thumbnailUrl
    );
  }

  private resetNewPhoto(): void {
    this.newPhoto = new Photo(1, 0, '', '', '');
  }
}