import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor( 
    private storage: AngularFireStorage,
    private afs:AngularFirestore,
    private toastr: ToastrService,
    private router: Router
  ) { }

  uploadImage(selectedImage: any, postDate: any, formStatus: string = 'Add New', id?: any) {
    const filePath = `postIMG/${Date.now()}`;
    console.log(filePath);
  
    this.storage.upload(filePath, selectedImage).then(() => {
      console.log('Post image uploaded successfully');
  
      this.storage.ref(filePath).getDownloadURL().subscribe(URL => {
        postDate.postImgPath = URL;
        console.log(postDate);
  
        if (formStatus === 'Edit' && id) {
          this.updateData(id, postDate);
        } else {
          this.saveData(postDate);
        }
      });
    });
  }
  

  saveData(postData: any) {
    this.afs.collection('posts').add(postData).then((docRef: any) => {
      this.toastr.success('Data Insert Successfully');
      this.router.navigate(['/posts']);
    });
  }

  loadData() { 
    return this.afs.collection('posts').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        });
      })
    );
  }

  loadOneData(id: any): Observable<any> {
    return this.afs.doc(`posts/${id}`).valueChanges();
  }

  updateData(id: any, postData: any) {
    this.afs.doc(`posts/${id}`).update(postData).then(() => {
      this.toastr.success('Data Updated Successfully');
      this.router.navigate(['/posts']);
    })
  }

  deleteImage(postImgPath: any, id: any) {
    this.storage.storage.refFromURL(postImgPath).delete().then(() => {
      this.deleteData(id);
    });
  }

  deleteData(id:any) {
    this.afs.doc(`posts/${id}`).delete().then(() => {
      this.toastr.warning('Data Deleted ..!')
    });
  }

  markFeatured(id: any, featuredData: any) {
    this.afs.doc(`posts/${id}`).update(featuredData).then(() => {
      this.toastr.info('Featured Status Updated');
    });
  }
}
